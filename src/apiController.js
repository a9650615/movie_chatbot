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
}

export default new ApiController()
