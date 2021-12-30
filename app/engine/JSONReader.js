const JSONReader = function (path) {
  const fs = require('fs')

  const rawdata = fs.readFileSync(path)
  const data = JSON.parse(rawdata)

  return {
    getData: () => { return data }
  }
}

module.exports = JSONReader
