const Components = require("../../engine/Components/Components.js")

class AutoSpinComponent extends Components.Component {
  constructor(obj) {
    super(obj)

    this.onCreate()
  }
  rotateSpeed = 1

  onUpdate(dT) {
    let Axis = new THREE.Vector3(0, 1, 0)
    let Angle = this.rotateSpeed * dT
    this.attachedObject.rotate({ Axis, Angle })
  }
}

module.exports = AutoSpinComponent