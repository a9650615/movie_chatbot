import Api from './api'
import Controller from './controller'
import TmpData from './TmpData'

class AiController {
  async searchMovie({ parameters, fulfillment }) {
    console.log('start searching')
    //console.log(parameters.movie[0])
    console.log(fulfillment.speech)
    if (fulfillment.speech == '')
      return Controller.searchMovie(parameters.movie[0])
    else return { type: 'text', text: fulfillment.speech }
  }

  async isRecommend({ parameters }, userId) {
    if (TmpData.lastSearch[userId]) {
      return Controller.isRecommend({ id: TmpData.lastSearch[userId].movie_id })
    } else {
      return { type: 'text', text: '你在說哪部電影呢?' }
    }
  }

  async getMovieSummary({ parameters, fulfillment }, userId) {
    if (TmpData.lastSearch[userId]) {
      return Controller.getMovieSummary({ id: TmpData.lastSearch[userId].movie_id })
    } else if (fulfillment.speech == '') {
      return { type: 'text', text: fulfillment.speech }
    }
  }

  async getStagePhoto({ parameters, fulfillment }, userId) {
    if (TmpData.lastSearch[userId]) {
      return Controller.getStagePhoto({ id: TmpData.lastSearch[userId].movie_id })
    } else if (fulfillment.speech == '') {
      return { type: 'text', text: fulfillment.speech }
    }
  }
  
  async subscribe({ parameters, fulfillment }, userId) {
    Controller.subscribe({ }, userId)
    return { type: 'text', text: fulfillment.speech }
  }

  async unSubscribe({ parameters, fulfillment }, userId) {
    Controller.unSubscribe({ }, userId)
    return { type: 'text', text: fulfillment.speech }
  }

  async randomRecommand({} ,userId) {
    return await Controller.randomRecommand({}, userId)
  }
}

export default new AiController()
