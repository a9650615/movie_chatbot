import Api from './api'
import { MovieView, ActorView, SearchView, ImagesList } from './template'

class Controller {
  async getMovie({ id }) {
    const data = await Api.getMovieData(id)
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
    if (data.actors.length)
      return ActorView({ data })
    else 
      return { type: 'text', text: '沒有演員清單資訊' }
  }

  async searchMovie(name) {
    const data = await Api.searchMovie(name)
    return SearchView({ data })
  }

  async getStagePhoto({ id }) {
    const data = await Api.searchPhoto(id)
    return ImagesList({ data, id })
  }
  
  image ({ src, href }) {
    return {
      type: 'image',
      originalContentUrl: src,
      previewImageUrl: src
    }
  }
}

export default new Controller();
