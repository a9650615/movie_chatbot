import mysql from 'promise-mysql'

var conn;

class Mysql {
  static conn = mysql.createPool({
    host: '192.168.1.2',
    user: 'admin',
    password: '1234',
    database: 'movie_chat_bot',
    port: 3307
  })
}

conn = Mysql.conn

class DataApi {

  async createSearchHistory({movie_id, movie_name, user}) {
    return await conn.query(`INSERT INTO search_history(movie_name, movie_id, user) VALUES('${movie_name}', '${movie_id}', '${user}')`)
  }

  async subscribe({ user }) {
    return await conn.query(`INSERT INTO subscribe_list(user) VALUES('${user}')`)
  }

  async unSubscribe({ user }) {
    return await conn.query(`DELETE FROM subscribe_list WHERE user='${user}'`)
  }

  async setFavorite({ movie_id, movie_name, user }) {
    return await conn.query(`INSERT INTO favorite_history(movie_name, movie_id, user) VALUES('${movie_name}', '${movie_id}', '${user}')`)
  }

  async unSetFavorite({ movie_id, movie_name, user }) {
    return await conn.query(`DELETE FROM favorite_history WHERE movie_id='${movie_id}' and movie_name='${movie_name}' and user='${user}'`)
  }

  async searchFavoriteList({ movie_id, movie_name, user }) {
    return await conn.query(`SELECT * FROM favorite_history WHERE user='${user}' GROUP BY movie_id order by time desc limit 5`)
  }

  async searchAllSubscribe() {
    return await conn.query(`SELECT * FROM subscribe_list`)
  }

  async hotFavoriteList() {
    return await conn.query(`SELECT COUNT(movie_id) as count,movie_id, movie_name FROM favorite_history GROUP BY movie_id ORDER BY count DESC LIMIT 500`)
  }

  async hotSearchList() {
    return await conn.query(`SELECT COUNT(movie_id) as count,movie_id, movie_name FROM search_history GROUP BY movie_id ORDER BY count DESC  LIMIT 500`)
  }

  async createUser({ account, password, lineID, name }) {
    return await conn.query(`INSERT INTO user_list(name, account, password, lineID) VALUES('${name}', '${account}', '${password}', '${lineID}')`);
  }

  async getUserByAcc(userName) {
    return await conn.query(`SELECT * FROM user_list WHERE account='${userName}'`);
  }

  async userLogin({account, password}) {
    return await conn.query(`SELECT * FROM user_list WHERE account='${account}' AND password='${password}' LIMIT 1`)
  }

  async getMovieReaction({ user, movie_id }) {
    return {
      like: await conn.query(`SELECT * FROM favorite_history WHERE movie_id='${movie_id}' and user='${user}' LIMIT 1`),
      comments: await conn.query(`SELECT * FROM comments WHERE movie_id='${movie_id}' ORDER BY ID desc`)
    }
  }

  async getFavoriteList({ user }) {
    return await conn.query(`SELECT * FROM favorite_history WHERE user='${user}' GROUP BY movie_id order by ID desc`)
  }

  async addComment({ user, comment, movie_id }) {
    return await conn.query(`INSERT INTO comments(user, comment, movie_id) VALUES('${user}', '${comment}', '${movie_id}')`);
  }
}


export default new DataApi();
