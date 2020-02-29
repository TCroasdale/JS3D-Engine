let SceneController = function () {
  let mScene

  // let canvasElem
  let mBodyElem
  let mRenderer
  let mClock
  let mCamera
  let mMouse = new THREE.Vector2(0, 0)

  let loopCallback = undefined


  let animate = function () {
    const delta = mClock.getDelta()
    if (loopCallback !== undefined) {
      loopCallback(delta)
    }
    window.requestAnimationFrame(animate)
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

      mScene = new THREE.Scene()
      mCamera = new THREE.PerspectiveCamera(45, winWidth / winHeight, 0.1, 1000)
      mCamera.position.z = 1;

      mRenderer = new THREE.WebGLRenderer({ antialias: true })
      mRenderer.setSize(winWidth, winHeight)

      document.body.appendChild(mRenderer.domElement)

      // let geometry = new THREE.BoxGeometry(1, 1, 1)
      // let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
      // let cube = new THREE.Mesh(geometry, material)
      // mScene.add(cube)

      let light = new THREE.AmbientLight(0xffffff) // soft white light
      mScene.add(light)
    },
    startRenderLoop: () => {
      animate()
    },
    resize: () => {
      const winWidth = mBodyElem.clientWidth
      const winHeight = mBodyElem.clientHeight
      // mCameraController.onResize(winWidth / winHeight)
      mCamera.aspect = winWidth / winHeight
      mCamera.updateProjectionMatrix()
      mRenderer.setSize(winWidth, winHeight)
    }
  }
}

module.exports = SceneController