const ModelLoader = function () {
  const loader = new THREE.GLTFLoader()

  return {
    loadFromFile: (file) => {
      return new Promise((resolve, reject) => {
        console.log(`loading from ${'./game-data/assets/gltf/' + file}`)
        loader.load('./game-data/assets/gltf/' + file, data => resolve(data), null, reject)
      })
    }
  }
}

module.exports = ModelLoader
