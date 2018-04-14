import Api from './api'
import TmpData from './TmpData'
import { MovieView, ActorView, SearchView, ImagesList } from './template'
import DataApi from './api/dataApi'

class Controller {
  async getMovie({ id }, userId, notRecord = false) {
    const data = await Api.getMovieData(id)
    TmpData.lastSearch[userId] = {
      movie_id: id,
      movie_name: data.title
    }
    if (!notRecord)
    DataApi.createSearchHistory({
      movie_id: id,
      movie_name: data.title,
      user: userId
    })
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

  async subscribe({ }, userId) {
    await DataApi.subscribe({ user: userId })
  }

  async unSubscribe({ }, userId) {
    await DataApi.unSubscribe({ user: userId })
  }

  async randomRecommand({}, userId) {
    let list = await Api.getRecommandList();
    let i = Math.floor(Math.random() * (list.length))
    return await this.getMovie({id: list[i].id}, userId, true)
  }

  async setFavorite({ id, name } , userId) {
    await DataApi.setFavorite({movie_id: id, movie_name: name, user: userId})
    return {type: 'text', text: `已幫你收藏${name}`}
  }

  async removeFavorite({ id, name } , userId) {
    await DataApi.unSetFavorite({movie_id: id, movie_name: name, user: userId})
    return {type: 'text', text: `已幫你移除${name}`}
  }
}

export default new Controller();
