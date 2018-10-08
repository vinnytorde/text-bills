const MongoClient = require('mongodb').MongoClient

const { DB_URL, DB_NAME, DB_USER, DB_PASSWORD, DB_COL_BILLS } = process.env

const url = (() => {
  let url = DB_URL.replace(/dbuser/i, DB_USER)
  url = url.replace(/dbpassword/, DB_PASSWORD)
  return url
})()

function read(col = DB_COL_BILLS) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(
      url,
      { useNewUrlParser: true },
      function(err, client) {
        const collection = client.db(DB_NAME).collection(col)
        // BSON != JSON
        collection.find({}).toArray(function(err, items) {
          if (err) reject(err)
          resolve(items)
          client.close()
        })
      }
    )
  })
}

async function write(data, col = DB_COL_BILLS) {
  const column = await new Promise(resolve => {
    MongoClient.connect(
      url,
      { useNewUrlParser: true },
      function(err, client) {
        const collection = client.db(DB_NAME).collection(col)
        resolve(collection)
      }
    )
  })
  const result = await column.insertMany(data, { fullResult: true })
  return result
}

module.exports = { read, write }
