import Api from './api'
import { MovieView } from './template'

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
}

export default new Controller();
