import Api from './api'
import { MovieView, ActorView } from './template'

class Controller {
  async getMovie({ id }) {
    const data = await Api.getMovieData(7161)
    return MovieView({ data, id });
  }

  async getMovieSummary({ id }) {
    const data = await Api.getMovieData(id)
    return {
      type: 'text',
      text: data.summary
    }
  }

  async getActor({id}) {
    const data = await Api.getActors(id)
    console.log(data.actors)
    return ActorView({ data })
  }
}

export default new Controller();
