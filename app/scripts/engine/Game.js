(() => {
  const SceneController = require("./scripts/engine/SceneController.js")
  const Object = require("./scripts/engine/Object3D.js")
  const Components = require("./scripts/engine/Components.js")
  let mSceneController = new SceneController()

  mSceneController.startController(document.getElementById('app-body'))
  mSceneController.startRenderLoop()
  
  let cube = new Object.Object3D(mSceneController.getScene(), new Object.Primitive.BOX(0.5, 0.5, 0.5), new Object.SimpleMaterial.NORMAL)
  let sphere = new Object.Object3D(mSceneController.getScene(), new Object.Primitive.SPHERE(0.5, 16, 8), new Object.SimpleMaterial.NORMAL)
  let plane = new Object.Object3D(mSceneController.getScene(), new Object.Primitive.BOX(10, 0.1, 10), new Object.SimpleMaterial.NORMAL)
  plane.getMesh().position.y = -5
  sphere.getMesh().position.x = 0.5
  sphere.getMesh().position.z = 0

  mSceneController.registerBody(cube, new Components.RigidBody(cube, Object.BodyPrimitive.CUBE(0.25, 0.25, 0.25), 5))
  mSceneController.registerBody(plane, new Components.RigidBody(plane, Object.BodyPrimitive.CUBE(5, 0.1, 5), 0))
  mSceneController.registerBody(sphere, new Components.RigidBody(sphere, Object.BodyPrimitive.SPHERE(0.5), 5))
  
  mSceneController.setLoopCallback((dT) => {
    cube.onUpdate(dT)
    plane.onUpdate(dT)
    sphere.onUpdate(dT)

    cube.onLateUpdate(dT)
    plane.onLateUpdate(dT)
    sphere.onLateUpdate(dT)
  })

})()