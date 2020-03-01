const SceneController = require("./SceneController.js")
const Object = require("./Object3D.js")
const Components = require("./Components.js")
  
LevelParser = function (reader) {
  let levelData = reader.getLevel()
  let mSceneController = new SceneController()

  let objects = {}

  let parseNode = (node, parent) => {
    let object = null
    if (node.Type === "Blank") {
      object = new Object.Object3D(parent, null, null)
    } else if (node.Type === "Object3D") {
      let geometry = Object.parsePrimitive(node.Mesh)
      let material = Object.parseMaterial(node.Mesh.Material)
      object = new Object.Object3D(parent, geometry, material)
    }
    console.log("created ", object)

    if (node.Name !== undefined) {
      object.setName(node.Name)
    }

    if (node.Position !== undefined) {
      object.setPosition(node.Position.x, node.Position.y, node.Position.z)
    }

    // Parsing components
    if (node.Components !== undefined) {
      node.Components.forEach((component) => {
        if (component.Class === "RigidBody") {
          let body = Components.RigidBody.fromParameters(object, component.Parameters)
          mSceneController.registerBody(object, body)
        } else if (component.Class === "Camera") {
          let cam = Components.Camera.fromParameters(object, component.Parameters)
          mSceneController.registerCamera(object, cam)
        }
        else {
          let newComp = require("../../game-data/Components/" + component.Class +".js")
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

  let parseLevel = (() => {
    mSceneController.startController(document.getElementById('app-body'))
    parseNode(levelData.Scene, mSceneController.getScene())
    console.log(mSceneController.getScene())
  })

  return {
    startParsingLevel: () => {
      console.log("parsing level: ", levelData)
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