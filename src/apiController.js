import Api from './api'

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
}

export default new ApiController()
