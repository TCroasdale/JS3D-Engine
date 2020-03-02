const SceneController = function () {
  let mScene

  // let canvasElem
  let mBodyElem
  let mRenderer
  let mClock
  let mCamera
  const mMouse = new THREE.Vector2(0, 0)

  let loopCallback

  let mWorld
  const fixedTimeStep = 1.0 / 60.0 // seconds
  const maxSubSteps = 3

  let ratio = 0.5

  const animate = function () {
    const delta = mClock.getDelta()
    if (loopCallback !== undefined) {
      loopCallback(delta)
    }
    mWorld.step(fixedTimeStep, delta, maxSubSteps)

    window.requestAnimationFrame(animate)
    mScene.updateMatrixWorld()
    mRenderer.render(mScene, mCamera)
  }
  return {
    getScene: () => { return mScene },
    setLoopCallback: (fn) => { loopCallback = fn },
    startController: (appBody) => {
      mClock = new THREE.Clock()

      mBodyElem = appBody
      const winWidth = appBody.clientWidth
      const winHeight = appBody.clientHeight
      ratio = winWidth / winHeight

      mScene = new THREE.Scene()

      mRenderer = new THREE.WebGLRenderer({ antialias: true })
      mRenderer.setSize(winWidth, winHeight)

      document.body.appendChild(mRenderer.domElement)

      const light = new THREE.AmbientLight(0xffffff) // soft white light
      mScene.add(light)

      mWorld = new CANNON.World()
      mWorld.gravity = new CANNON.Vec3(0, -9.81, 0)
      mWorld.solver.iterations = 5
      mWorld.defaultContactMaterial.contactEquationStiffness = 1e6
      mWorld.defaultContactMaterial.contactEquationRelaxation = 10
      mWorld.doProfiling = true
    },
    startRenderLoop: () => {
      animate()
    },
    resize: () => {
      const winWidth = mBodyElem.clientWidth
      const winHeight = mBodyElem.clientHeight

      mCamera.aspect = winWidth / winHeight
      mCamera.updateProjectionMatrix()
      mRenderer.setSize(winWidth, winHeight)
    },
    registerBody: (obj, rBody) => {
      obj.addComponent(rBody)
      mWorld.addBody(rBody.body)
      // rBody.initDebugFrame(mScene)
    },
    registerCollider: (obj, col) => {
      obj.addComponent(col)
      // col.initDebugFrame(mScene)
    },
    registerCamera: (obj, camera) => {
      obj.addComponent(camera)
      camera.camera = new THREE.PerspectiveCamera(camera.FoV, ratio, camera.near, camera.far)
      obj.getMesh().add(camera.camera)
      mCamera = camera.camera
    }
  }
}

module.exports = SceneController
