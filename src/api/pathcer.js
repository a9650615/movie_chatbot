import axios from 'axios';
import cheerio from 'cheerio';

class Pathcer {

  async patchEle(url) {
    let {data} = await axios.get('https://movies.yahoo.com.tw/'+encodeURI(url))
    // try {
    // } catch (e) {
    //   console.log(e)
    // }
    return cheerio.load(data)
  }

}

export default new Pathcer()
