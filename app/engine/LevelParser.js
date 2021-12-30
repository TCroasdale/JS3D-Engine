const SceneController = require('./SceneController.js')
const ModelLoader = require('./ModelLoader.js')
const Object = require('./Object3D.js')
const Components = require('./Components/Components.js')

const LevelParser = function (reader) {
  const levelData = reader.getData()
  const mSceneController = new SceneController()
  const mLoader = new ModelLoader()

  const objects = {}

  const parseNode = async (node, parent, lastRBody) => {
    let object =

    parent = parent.getMesh === undefined ? parent : parent.getMesh()

    if (node.Type === 'Blank') {
      object = new Object.Object3D({ parent })
    } else if (node.Type === 'Light') {
      object = new Object.Object3D({parent, light: node.Light })
    } else if (node.Type === 'Primitive3D') {
      const geometry = Object.parsePrimitive(node.Mesh)
      const material = Object.parseMaterial(node.Mesh.Material)
      object = new Object.Object3D({ parent, geometry, material })
    } else if (node.Type === 'Object3D') {
      console.log(node.Model)
      const gltf = await mLoader.loadFromFile(node.Model)
      object = new Object.Object3D({ parent, gltf })
    }
    console.log('created ', object)

    if (node.Name !== undefined) {
      object.setName(node.Name)
    }

    if (node.Position !== undefined) {
      object.setPosition(node.Position.x, node.Position.y, node.Position.z)
    }

    if (node.Scale !== undefined) {
      object.setScale(node.Scale.x, node.Scale.y, node.Scale.z)
    }

    // Parsing components
    let rBody = null
    if (node.Components !== undefined) {
      node.Components.forEach((component) => {
        if (component.Class === 'RigidBody') {
          const body = Components.RigidBody.fromParameters(object, component.Parameters)
          rBody = body
          mSceneController.registerBody(object, body)
        } else if (component.Class === 'Collider') {
          const coll = Components.Collider.fromParameters(object, component.Parameters, lastRBody, node.Position)
          console.log('Added to rbody for object', lastRBody, node.Position, node.Name)
          mSceneController.registerCollider(object, coll)
        } else if (component.Class === 'Camera') {
          const cam = Components.Camera.fromParameters(object, component.Parameters)
          mSceneController.registerCamera(object, cam)
        } else {
          const NewComp = require('../game-data/Components/' + component.Class + '.js')
          object.addComponent(new NewComp())
        }
      })
    }

    if (node.Children !== undefined) {
      node.Children.forEach((child) => {
        parseNode(child, object.getMesh(), rBody)
      })
    }

    objects[object.getMesh().uuid] = object
    parent.add(object.getMesh())
  }

  const parseLevel = () => {
    mSceneController.startController(document.getElementById('app-body'))
    parseNode(levelData.Scene, mSceneController.getScene())
    console.log(mSceneController.getScene())
  }

  return {
    startParsingLevel: () => {
      console.log('parsing level: ', levelData)
      parseLevel()
    },
    getSceneController: () => {
      return mSceneController
    },
    getObject: (uuid) => {
      return objects[uuid]
    }
  }
}

module.exports = LevelParser
