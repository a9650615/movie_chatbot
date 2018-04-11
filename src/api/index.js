import Pather from './pathcer'

class Api {
  async getMovieData(id) {
    let $ = await Pather.patchEle(`movieinfo_main.html/id=${id}`)
    const data = {
      title: $('.movie_intro_info_r>h1').text(),
      upTime: $('.movie_intro_info_r>span').eq(0).text(),
      long: $('.movie_intro_info_r>span').eq(1).text(),
      director: $('.movie_intro_info_r>.movie_intro_list').eq(0).text().trim(),
      actors: $('.movie_intro_info_r>.movie_intro_list').eq(1).text().replace(/\s/g, '').split('、'),
      good: $('.evaluatebox .score_num').text(),
      summary: $('.storeinfo>.gray_infobox_inner>span').text().replace(/\s/g, '').replace('\n',''),
      cover: $('.movie_intro_foto>img').attr('src')
    }
    // console.log(data)
    return data
  }
  
  async getActors(id) {
    let $ = await Pather.patchEle(`movieinfo_main.html/id=${id}`)
    let actor = []
    $('.starlist>li').each((index, ele) => {
      actor.push({
        img: $(ele).find('img').attr('src'),
        text: $(ele).find('.actor_inner>h1').text().replace(/\s/g, ' ').split(' ').filter(text => text.length > 0)
      })
    })
    const data = {
      actors: actor
    }

    return data
  }
}

export default new Api()
