import Koa from 'koa'
import KoaBody from 'koa-body'
import { Client, validateSignature, WebhookEvent } from "@line/bot-sdk"
import ApiAi from 'apiai'
import chatbase from '@google/chatbase'
import schedule from 'node-schedule'
import Api from './api'
import {LINE, DIALOG_FLOW, CHATBASE} from './config'
import Controller from './controller'
import AiController from './aiController'

const lineClient = new Client({
  channelSecret: LINE.channelSecret,
  channelAccessToken: LINE.channelAccessToken
})

const dialogFlow = ApiAi(DIALOG_FLOW);

const app = new Koa();
app.use(KoaBody())

const SendMessageToChatBase = ({ user, message, intent = 'not-found', type, platform = 'Line', version = '1.0' }) => {
  if (type === "user")
    chatbase.setAsTypeUser(type)
  else if (type === "agent")
    chatbase.setAsTypeAgent(type)
  const request = chatbase.newMessage(CHATBASE)
    .setPlatform(platform)
    .setMessage(message)
    .setVersion(version || "1.0")
    .setUserId(user)
    .setIntent(intent)
    .setTimestamp(Date.now().toString())
  if (intent !== "not-found")
    request.setAsHandled()
  else
    request.setAsNotHandled()
  return request.send()
}

const AiAgent = (message = '', userId, type) => {
  return new Promise(async (resolve, reject) => {
    let request = dialogFlow.textRequest(message, {
      sessionId: userId
    });
    console.log(message)
    request.on('response', async function(response) {
      console.log(response)
      if (response.result.action!='input.unknown') {
        console.log('action:'+response.result.action)
        if (AiController[response.result.action]) {
          console.log(response.result)
          SendMessageToChatBase({
            user: userId,
            message: response.result.resolvedQuery,
            intent: response.result.metadata.intentName,
            type: type
          })
          let message = await AiController[response.result.action](response.result, userId)
          resolve(message)
        }
      } else {
        SendMessageToChatBase({
          user: userId,
          message: response.result.resolvedQuery,
          intent: 'not-found',
          type: 'user'
        })
        resolve(null)
      }
    });
    
    request.on('error', reject);
    
    request.end();
  })
}

let eventDispatcher = async (event) => {
  const userId = event.source.userId
  const type = event.source.type // user|group
  // console.log(event.message)
  switch(event.type) {
    case 'follow':
      break;
    case 'unfollow':
      break;
    case 'join':
      break;
    case 'leave':
      break;
    case 'message':
        if (event.message.type === "text") {
          let message;
          if (type == 'user') {
            message = await AiAgent(event.message.text, userId, type)
            console.log(message)
            if (!message) {
              SendMessageToChatBase({
                user: userId,
                intent: 'searchMovie',
                type,
                message: event.message.text
              })
              message = await Controller.searchMovie(event.message.text)
            }
              // const message = await Controller.getMovie({id: 7161})
            if (message)
              lineClient.pushMessage(userId, message).catch(data => console.log(data.originalError.response.data))
          } else if (type == 'group'){
            if (event.message.text.indexOf('小幫手') != -1) {
              message = await AiAgent(event.message.text.replace('小幫手',''), event.source.groupId, type)
              console.log(message)
              if (!message) {
                SendMessageToChatBase({
                  user: event.source.groupId,
                  intent: 'searchMovie',
                  type,
                  message: event.message.text
                })
                message = await Controller.searchMovie(event.message.text.replace('小幫手',''))
              }
                // const message = await Controller.getMovie({id: 7161})
              if (message)
                lineClient.pushMessage(event.source.groupId, message).catch(data => console.log(data.originalError.response.data))
            }
          }
        }
      break;
    case 'postback':
      postBackDispatcher({ event, userId, type, groupId: event.source.groupId });
        break;
  }
}

let postBackDispatcher = async({ event, userId, type, groupId }) => {
  let data = event.postback.data
  console.log(type)
  data = JSON.parse('{"' + decodeURI(data).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
  if (Controller[data.action]) {
    console.log('action is:'+data.action)
    SendMessageToChatBase({
      user: userId,
      intent: data.action,
      type,
      message: event.postback.data
    })
    let message = await Controller[data.action](data, type=='user'?userId: groupId)
    if (message) {
      lineClient.pushMessage(type=='user'?userId: groupId, message).catch(data => console.log(data.originalError.response.data))
    }
  }
}

schedule.scheduleJob('* * 7 * * *',(time) => {
  console.log('update')
  Controller.sendAllRecommand({ client: lineClient })
})

// response
app.use(async (ctx) => {
  // console.log(ctx)
  const signature = ctx.headers["x-line-signature"] || ''
  console.log(ctx.request.body, signature)
  if (validateSignature(JSON.stringify(ctx.request.body||``), LINE.channelSecret, signature)) {
      const events = ctx.request.body.events
      events.forEach(event => eventDispatcher(event))
  }
  ctx.res.statusCode = 200
});

app.listen(3000);
console.log('start:3000')