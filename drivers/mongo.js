const MongoClient = require('mongodb').MongoClient

const { DB_URL, DB_NAME, DB_USER, DB_PASSWORD, DB_COL_BILLS } = process.env

const url = (() => {
  let url = DB_URL.replace(/dbuser/i, DB_USER)
  url = url.replace(/dbpassword/, DB_PASSWORD)
  return url
})()

function driver(col = DB_COL_BILLS) {
  return new Promise(resolve => {
    MongoClient.connect(
      url,
      { useNewUrlParser: true },
      function(err, client) {
        if (err) throw err
        const collection = client.db(DB_NAME).collection(col)
        // BSON != JSON
        resolve(collection)
        collection.find({}).toArray(function(err, items) {
          client.close()
        })
      }
    )
  })
}

async function write(data, collection) {
  const column = await mongo(collection || DB_COL_BILLS)
  const result = await column.insert(data, { fullResult: true })
  return result
}

driver.write = write
module.exports = driver
