import Api from './api'
import Controller from './controller'

class AiController {
  async searchMovie({ parameters }) {
    console.log('start searching')
    console.log(parameters.movie[0])
    return Controller.searchMovie(parameters.movie[0])
  }
}

export default new AiController()
