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

  async setFavorite({ parameters, fulfillment }, userId) {
    if (TmpData.lastSearch[userId]) {
      let lastData = TmpData.lastSearch[userId];
      return Controller.setFavorite({ id: lastData.movie_id, name: lastData.movie_name }, userId)
    } else if (fulfillment.speech == '') {
      return { type: 'text', text: fulfillment.speech }
    }
  }

  async removeFavorite({ parameters, fulfillment }, userId) {
    if (TmpData.lastSearch[userId]) {
      let lastData = TmpData.lastSearch[userId];
      return Controller.removeFavorite({ id: lastData.movie_id, name: lastData.movie_name }, userId)
    } else if (fulfillment.speech == '') {
      return { type: 'text', text: fulfillment.speech }
    }
  }

  async showMyFavorite({ parameters, fulfillment }, userId) {
    return Controller.showMyFavorite({ }, userId)
    if (fulfillment.speech == '') {
      return { type: 'text', text: fulfillment.speech }
    }
  }

  async hotFavorite({ parameters, fulfillment }, userId) {
    return await Controller.hotFavorite({}, userId)
  }

  async hotSearch({}, userId) {
    return await Controller.hotSearch({}, userId)
  }

  async getActors({}, userId) {
    if (TmpData.lastSearch[userId]) {
      let lastData = TmpData.lastSearch[userId];
      return Controller.getActor({ id: lastData.movie_id, name: lastData.movie_name }, userId)
    } else if (fulfillment.speech !== '') {
      return { type: 'text', text: fulfillment.speech }
    }
  }

  async goBackToSearch({fulfillment}, userId) {
    if (TmpData.lastSearch[userId]) {
      let lastData = TmpData.lastSearch[userId];
      return Controller.getMovie({id: lastData.movie_id}, userId, true)
    } else if (fulfillment.speech !== '') {
      return { type: 'text', text: fulfillment.speech }
    }
  }
}

export default new AiController()
