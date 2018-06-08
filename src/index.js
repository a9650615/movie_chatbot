import Koa from 'koa'
import KoaBody from 'koa-body'
import { Client, validateSignature, WebhookEvent } from "@line/bot-sdk"
import ApiAi from 'apiai'
import chatbase from '@google/chatbase'
import schedule from 'node-schedule'
import route from 'koa-route'
import cors from '@koa/cors'
import {LINE, DIALOG_FLOW, CHATBASE} from './config'
import Controller from './controller'
import AiController from './aiController'
import ApiController from './apiController'

const lineClient = new Client({
  channelSecret: LINE.channelSecret,
  channelAccessToken: LINE.channelAccessToken
})

const dialogFlow = ApiAi(DIALOG_FLOW);

const app = new Koa();
app.use(KoaBody())
app.use(cors())
app.use(route.post('/login', ApiController.login))
app.use(route.post('/register', ApiController.register))
app.use(route.get('/hot_list', ApiController.getRecommandList))
app.use(route.get('/list', ApiController.getMovieList))
app.use(route.get('/search/:movie_name', ApiController.searchMovie))
app.use(route.get('/detail/:movie_id', ApiController.getMovieDetail))

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
            if (message) {
              if (typeof message == 'array') {
                message.forEach((val) => {
                  lineClient.pushMessage(userId, val).catch(data => console.log(data.originalError.response.data))
                })
              } else {
                lineClient.pushMessage(userId, message).catch(data => console.log(data.originalError.response.data))
              }
            }
          } else if (type == 'group'){
            if (event.message.text.indexOf('小幫手') != -1) {
              if (event.message.text.replace('小幫手', '') == '') 
                message = {type: 'text', text: '叫我嗎?'};
              if (!message)
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
              if (message) {
                if (typeof message == 'array') {
                  message.forEach((val) => {
                    lineClient.pushMessage(userId, val).catch(data => console.log(data.originalError.response.data))
                  })
                } else {
                  lineClient.pushMessage(userId, message).catch(data => console.log(data.originalError.response.data))
                }
              }
            } else {
              SendMessageToChatBase({
                user: userId,
                intent: 'disscuss',
                type,
                message: event.message.text
              })
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

schedule.scheduleJob('2 2 7 * * *',(time) => {
  console.log('update')
  Controller.sendAllRecommand({ client: lineClient })
})

// response
app.use(async (ctx) => {
  // console.log(ctx)
  const signature = ctx.headers["x-line-signature"] || ''
  console.log(ctx.request.body, signature)
  if (!signature) {
    ctx.body = 'yeah!'
  }
  else if (validateSignature(JSON.stringify(ctx.request.body||``), LINE.channelSecret, signature)) {
      const events = ctx.request.body.events
      events.forEach(event => eventDispatcher(event))
  }
  ctx.res.statusCode = 200
});

app.listen(3000);
console.log('start:3000')