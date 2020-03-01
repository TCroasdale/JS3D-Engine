(() => {
  const LevelReader = require("./scripts/engine/LevelReader.js")
  const LevelParser = require("./scripts/engine/LevelParser.js")
  const InputController = require("./scripts/engine/InputController.js")
  let mInputController = new InputController()
  mInputController.init()
  
  let levelReader = new LevelReader("./app/game-data/level.json")
  let levelParser = new LevelParser(levelReader)
  levelParser.startParsingLevel()
  let mSceneController = levelParser.getSceneController()
  mSceneController.startRenderLoop()


  mSceneController.setLoopCallback((dT) => {
    console.log(mInputController.getButton("Jump"))

    mSceneController.getScene().traverse((obj) => {
      let object = levelParser.getObject(obj.uuid) 
      if (object !== undefined) {
        object.onEarlyUpdate(dT, mInputController)
      }
    })

    mSceneController.getScene().traverse((obj) => {
      let object = levelParser.getObject(obj.uuid) 
      if (object !== undefined) {
        object.onUpdate(dT, mInputController)
      }
    })

    mSceneController.getScene().traverse((obj) => {
      let object = levelParser.getObject(obj.uuid) 
      if (object !== undefined) {
        object.onLateUpdate(dT, mInputController)
      }
    })
  })

})()