import mysql from 'promise-mysql'

var conn;

conn = mysql.createPool({
  host: '192.168.1.2',
  user: 'admin',
  password: '1234',
  database: 'movie_chat_bot',
  port: 3307
})

class DataApi {

  async createSearchHistory({movie_id, movie_name, user}) {
    return await conn.query(`INSERT INTO search_history(movie_name, movie_id, user) VALUES('${movie_name}', '${movie_id}', '${user}')`)
  }

}


export default new DataApi();
