const SceneController = require('./SceneController.js')
const Object = require('./Object3D.js')
const Components = require('./Components.js')

LevelParser = function (reader) {
  const levelData = reader.getLevel()
  const mSceneController = new SceneController()

  const objects = {}

  let lastRBody = null
  const parseNode = (node, parent) => {
    let object =

    parent = parent.getMesh === undefined ? parent : parent.getMesh()

    if (node.Type === 'Blank') {
      object = new Object.Object3D(parent, null, null)
    } else if (node.Type === 'Object3D') {
      const geometry = Object.parsePrimitive(node.Mesh)
      const material = Object.parseMaterial(node.Mesh.Material)
      object = new Object.Object3D(parent, geometry, material)
    }
    console.log('created ', object)

    if (node.Name !== undefined) {
      object.setName(node.Name)
    }

    if (node.Position !== undefined) {
      object.setPosition(node.Position.x, node.Position.y, node.Position.z)
    }

    // Parsing components
    if (node.Components !== undefined) {
      node.Components.forEach((component) => {
        if (component.Class === 'RigidBody') {
          const body = Components.RigidBody.fromParameters(object, component.Parameters)
          lastRBody = body
          mSceneController.registerBody(object, body)
        } else if (component.Class === 'Collider') {
          const coll = Components.Collider.fromParameters(object, component.Parameters, lastRBody, node.Position)
          console.log('Added to rbody', lastRBody, node.Position)
          mSceneController.registerCollider(object, coll)
        } else if (component.Class === 'Camera') {
          const cam = Components.Camera.fromParameters(object, component.Parameters)
          mSceneController.registerCamera(object, cam)
        } else {
          const newComp = require('../../game-data/Components/' + component.Class + '.js')
          object.addComponent(new newComp())
        }
      })
    }

    if (node.Children !== undefined) {
      node.Children.forEach((child) => {
        parseNode(child, object.getMesh())
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
