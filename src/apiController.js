import Api from './api'
import DataApi from './api/dataApi'

class ApiController {
  async getRecommandList(ctx) {
    ctx.body = await Api.getRecommandList()
  }

  async getMovieList(ctx) {
    ctx.body = await Api.getMovieList()
  }

  async searchMovie(ctx, movie_name) {
    ctx.body = await Api.searchMovie(movie_name)
  }

  async getMovieDetail(ctx, movie_id) {
    ctx.body = await Api.getMovieData(movie_id)
  }

  async register(ctx) {
    const has_user = (await DataApi.getUserByAcc(ctx.request.body.account)).length;
    if (has_user === 0) {
      ctx.body = {
        status: 'success',
        data: (await DataApi.createUser(ctx.request.body))['insertId']
      }
    } else {
      ctx.body = {
        status: 'failure',
        data: '已有重複帳號'
      }
    }
  }

  async login(ctx) {
    const user = await DataApi.userLogin(ctx.request.body)
    if (user.length > 0) {
      ctx.body = {
        status: 'success',
        data: user[0]
      }
    } else {
      ctx.body = {
        status: 'failure',
        data: '登入失敗，是否尚未註冊?'
      }
    }
  }

  async getPhoto(ctx, movie_id) {
    const photos = await Api.searchPhoto(movie_id)
    ctx.body = photos
  }

  async starMovie(ctx) {
    const data = ctx.request.body
    const sendData = {
      movie_id: decodeURI(data.movieID),
      movie_name: data.movieName,
      user: data.lineID
    }
    try {
      await DataApi.setFavorite(sendData)
      ctx.body = {
        status: 'success'
      }
    } catch (e) {
      ctx.body = {
        status: 'failure'
      }
    }
  }

  async unStarMovie(ctx) {
    const data = ctx.request.body
    const sendData = {
      movie_id: decodeURI(data.movieID),
      movie_name: data.movieName,
      user: data.lineID
    }
    try {
      await DataApi.unSetFavorite(sendData)
      ctx.body = {
        status: 'success'
      }
    } catch (e) {
      ctx.body = {
        status: 'failure'
      }
    }
  }

  async getMovieReaction(ctx) {
    const data = ctx.request.body
    const res = await DataApi.getMovieReaction({ user: data.lineID, movie_id: decodeURI(data.movieID)})
    ctx.body = {
      like: res.like.length > 0,
      comments: res.comments
    }
  }

  async getFavorite(ctx, user) {
    const data = await DataApi.getFavoriteList({ user })
    ctx.body = data
  }

  async addComment(ctx) {
    const data = ctx.request.body
    const res = await DataApi.addComment({ user: data.lineID, comment: data.comment, movie_id: decodeURI(data.movieID) })
    ctx.body = {}
  }
}

export default new ApiController()
