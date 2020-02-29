(() => {
  const SceneController = require("./scripts/engine/SceneController.js")
  let mSceneController = new SceneController()

  mSceneController.startController(document.getElementById('app-body'))
  mSceneController.startRenderLoop()
  
  
  let geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
  let material = new THREE.MeshNormalMaterial();

  let mesh = new THREE.Mesh( geometry, material );
  console.log(mSceneController)
  mSceneController.getScene().add( mesh );
  mSceneController.setLoopCallback((dT) => {
    mesh.rotation.x += 0.1 * dT
    mesh.rotation.y += 0.1 * dT
  })

})()