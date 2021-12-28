const LevelReader = function (path) {
  const fs = require('fs')

  const rawdata = fs.readFileSync(path)
  const level = JSON.parse(rawdata)

  return {
    getLevel: () => { return level }
  }
}

module.exports = LevelReader
