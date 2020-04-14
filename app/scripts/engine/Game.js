(() => {
  const LevelReader = require('./scripts/engine/LevelReader.js')
  const LevelParser = require('./scripts/engine/LevelParser.js')
  const InputController = require('./scripts/engine/InputController.js')
  const mInputController = new InputController()
  mInputController.init()

  const levelReader = new JSONReader('./app/game-data/level.json')
  const levelParser = new LevelParser(levelReader)
  levelParser.startParsingLevel()
  const mSceneController = levelParser.getSceneController()
  mSceneController.startRenderLoop()

  mSceneController.setLoopCallback((dT) => {

    mSceneController.getScene().traverse((obj) => {
      const object = levelParser.getObject(obj.uuid)
      if (object !== undefined) {
        object.onEarlyUpdate(dT, mInputController)
      }
    })

    mSceneController.getScene().traverse((obj) => {
      const object = levelParser.getObject(obj.uuid)
      if (object !== undefined) {
        object.onUpdate(dT, mInputController)
      }
    })

    mSceneController.getScene().traverse((obj) => {
      const object = levelParser.getObject(obj.uuid)
      if (object !== undefined) {
        object.onLateUpdate(dT, mInputController)
      }
    })
  })
})()
