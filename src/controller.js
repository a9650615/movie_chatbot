import Api from './api'
import TmpData from './TmpData'
import { MovieView, ActorView, SearchView, ImagesList } from './template'

class Controller {
  async getMovie({ id }, userId) {
    const data = await Api.getMovieData(id)
    TmpData.lastSearch[userId] = {
      movie_id: id,
      movie_name: data.title
    }
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
    if (data.length)
      return SearchView({ data })
    else 
      return {type: 'text', text: `沒有找到 ${name} 相關電影`}
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

  async isRecommend({ id }) {
    const data = await Api.getScore(id)
    return {
      type: 'text',
      text: `我覺得${data>3.5?'可以':'不行'}`
    }
  }
}

export default new Controller();
