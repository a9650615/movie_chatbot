import Koa from 'koa'
import KoaBody from 'koa-body'
import { Client, validateSignature, WebhookEvent } from "@line/bot-sdk"
import ApiAi from 'apiai'
import Api from './api'
import {LINE, DIALOG_FLOW} from './config'
import Controller from './controller'
import AiController from './aiController'

const lineClient = new Client({
  channelSecret: LINE.channelSecret,
  channelAccessToken: LINE.channelAccessToken
})

const dialogFlow = ApiAi(DIALOG_FLOW);

const app = new Koa();
app.use(KoaBody())

const AiAgent = (message = '', userId) => {
  return new Promise(async (resolve, reject) => {
    let request = dialogFlow.textRequest(message, {
      sessionId: userId
    });
    console.log(message)
    request.on('response', async function(response) {
      if (response.result.action) {
        console.log('action:'+response.result.action)
        if (AiController[response.result.action]) {
          let message = await AiController[response.result.action](response.result)
          resolve(message)
        }
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
            message = await AiAgent(event.message.text, userId)
            console.log(message)
            if (!message)
              // const message = await Controller.getMovie({id: 7161})
              message = await Controller.searchMovie(event.message.text)
            if (message)
              lineClient.pushMessage(userId, message).catch(data => console.log(data.originalError.response.data))
          }
        }
      break;
    case 'postback':
      postBackDispatcher({ event, userId, type });
        break;
  }
}

let postBackDispatcher = async({ event, userId, type }) => {
  let data = event.postback.data
  console.log(data)
  data = JSON.parse('{"' + decodeURI(data).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
  if (Controller[data.action]) {
    console.log('action is:'+data.action)
    let message = await Controller[data.action](data)
    if (message) {
      lineClient.pushMessage(userId, message).catch(data => console.log(data.originalError.response.data))
    }
  }
}

// response
app.use(async (ctx) => {
  console.log(ctx)
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