LevelReader = function (path) {
  const fs = require('fs')

  let rawdata = fs.readFileSync(path)
  let level = JSON.parse(rawdata)

  console.log(level)

  return {
    getLevel: () => { return level }
  }
}

module.exports = LevelReader