(() => {
  const SceneController = require("./scripts/engine/SceneController.js")
  const Object = require("./scripts/engine/Object3D.js")
  let mSceneController = new SceneController()

  mSceneController.startController(document.getElementById('app-body'))
  mSceneController.startRenderLoop()
  
  let cube = new Object.Object3D(mSceneController.getScene(), new Object.Primitive.BOX(0.5, 0.5, 0.5), new Object.SimpleMaterial.NORMAL)
  let plane = new Object.Object3D(mSceneController.getScene(), new Object.Primitive.BOX(10, 0.1, 10), new Object.SimpleMaterial.NORMAL)
  plane.getMesh().position.y = -5

  mSceneController.registerBody(cube, new Object.RigidBody(cube, Object.BodyPrimitive.CUBE(0.5, 0.5, 0.5), 5))
  mSceneController.registerBody(plane, new Object.RigidBody(plane, Object.BodyPrimitive.CUBE(10, 0.1, 10), 0))
  mSceneController.setLoopCallback((dT) => {
    cube.onUpdate(dT)
    plane.onUpdate(dT)

    cube.onLateUpdate(dT)
    plane.onLateUpdate(dT)
    // cube.getMesh().rotation.x += 0.1 * dT
    // cube.getMesh().rotation.y += 0.1 * dT
  })

})()