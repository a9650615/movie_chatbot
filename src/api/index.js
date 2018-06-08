import Pather from './pathcer'

class Api {
  async getMovieData(id) {
    let $ = await Pather.patchEle(`movieinfo_main/${id}`)
    const data = {
      title: $('.movie_intro_info_r>h1').text(),
      eng_title: $('.movie_intro_info_r>h3').text(),
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
    let $ = await Pather.patchEle(`movieinfo_main/${id}`)
    let actor = []
    $('.starlist>li').each((index, ele) => {
      actor.push({
        img: $(ele).find('img').attr('src') || 'https://movies.yahoo.com.tw/build/images/noavatar.jpg',
        text: $(ele).find('.actor_inner>h1').text().replace(/\s/g, ' ').split(' ').filter(text => text.length > 0)
      })
    })
    const data = {
      actors: actor
    }
    
    return data
  }
  
  async searchMovie(name) {
    let $ = await Pather.patchEle(`moviesearch_result.html?keyword=${name}&type=movie`)
    let list = []
    // console.log($('.searchpage ul.release_list').text())
    $('.release_list>li').each((index, ele) => {
      const data = {
        img: $(ele).find('.foto>img').attr('src'),
        title: $(ele).find('.release_movie_name>a').text(),
        time: $(ele).find('.release_movie_name .time').text(),
        id: $(ele).find('.release_movie_name>a').attr('href').replace('https://movies.yahoo.com.tw/movieinfo_main/', '')
      }
      list.push(data)
    })

    return list;
  }

  async searchPhoto(id) {
    let $ = await Pather.patchEle(`movieinfo_main/${id}`)
    let list = []
    $('.l_box:nth-child(3) .trailer_list a').each((index, ele) => {
      list.push({src: $(ele).find('img').attr('src'), href: $(ele).attr('href').replace('https://movies.yahoo.com.tw/movieinfo_photos.html/id=', '').replace('?movie_photo_id=', ',')})
    })
    return list
  }

  // async bigPhoto({ href }) {
  //   let data = href.split(',')
  //   let $ = await Pather.patchEle(`movieinfo_photos.html/id=${data[0]}?movie_photo_id=${data[1]}`)
  // }

  async getScore(id) {
    let $ = await Pather.patchEle(`movieinfo_main.html/id=${id}`)
    return Number($('.score_num.count').text()||$('.count').text()) 
  }
  
  async getRecommandList(id) {
    let $ = await Pather.patchEle(`chart.html?cate=rating`)
    let list = []

    $('.rank_list.table > .tr:not(.top)').each((i, ele) => {
      list.push({
        id: $(ele).find('.td:nth-child(2) > a').attr('href').replace('https://movies.yahoo.com.tw/movieinfo_main/', ''),
        title: $(ele).find('.td:nth-child(2) > a').text().replace(/\s/g,'').replace('詳全文', '')
      })
    })

    return list;
  }

  async getMovieList() {
    let $ = await Pather.patchEle('/index.html')
    let list = []

    $('.movie_ind_list > li').each((i, ele) => {
      list.push({
        id: $(ele).find('h1 > a.gabtn').attr('href').replace('https://movies.yahoo.com.tw/movieinfo_main/', ''),
        title: $(ele).find('h1 > a.gabtn').text(),
        release_date: $(ele).find('h3').text(),
        rank: $(ele).find('.movielist_info .starbox .star_num').attr('data-num'),
        img: $(ele).find('.movie_foto > img').attr('src')
      })
    })

    return list
  }
}

export default new Api()
