import Koa from 'koa'
import KoaBody from 'koa-body'
import { Client, validateSignature, WebhookEvent } from "@line/bot-sdk"
import Api from './api'
import {LINE} from './config'
import Controller from './controller'

const lineClient = new Client({
  channelSecret: LINE.channelSecret,
  channelAccessToken: LINE.channelAccessToken
})

const app = new Koa();
app.use(KoaBody())

let eventDispatcher = async (event) => {
  const userId = event.source.userId
  const type = event.source.type // user|group
  console.log(event.type)
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
          if (type == 'user') {
            const message = await Controller.getMovie({id: 7161})
            lineClient.pushMessage(userId, message).catch(data => console.log(data))
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
  data = JSON.parse('{"' + decodeURI(data).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
  if (Controller[data.action]) {
    let message = await Controller[data.action]({ id: data.id })
    if (message) {
      lineClient.pushMessage(userId, message).catch(data => console.log(data))
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