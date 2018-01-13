var mysql = require('mysql')
var config = require('../config/database')
var pool = null

function connect() {
  pool = mysql.createPool(config)

  return new Promise((resolve, reject) => {
    execute("Select version()", [])
      .then((data) => { resolve(data) })
      .catch((error) => { reject(error) })
  })
}

function execute(sql, param) {
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject({
          message: 'There is error connecting in the database.',
          body: error
        })
      } else {
        connection.query(sql, param, function (err, rows) {
          connection.release()
          if (!err) {
            resolve(rows)
          }
          else {
            reject({
              message: 'There is error in querying in the database.',
              body: error
            })
          }
        })

        connection.on('error', function (err) {
          connection.release()
          reject({
            message: 'There is error in connecting in the database pool.',
            body: error
          })
        })
      }
    })
  })
}

module.exports = {
  connect: connect,
  execute: execute
}