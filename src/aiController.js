import Api from './api'
import Controller from './controller'

class AiController {
  async searchMovie({ parameters, fulfillment }) {
    console.log('start searching')
    //console.log(parameters.movie[0])
    console.log(fulfillment.speech)
    if (fulfillment.speech == '')
      return Controller.searchMovie(parameters.movie[0])
    else return { type: 'text', text: fulfillment.speech }
  }
}

export default new AiController()
