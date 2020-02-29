(() => {
  const LevelReader = require("./scripts/engine/LevelReader.js")
  const LevelParser = require("./scripts/engine/LevelParser.js")
  
  
  let levelReader = new LevelReader("./app/game-data/level.json")
  let levelParser = new LevelParser(levelReader)
  levelParser.startParsingLevel()
  let mSceneController = levelParser.getSceneController()
  mSceneController.startRenderLoop()
  mSceneController.setLoopCallback((dT) => {
  })

})()