const Components = require("../../engine/Components/Components.js")

class TiltComponent extends Components.Component {
  constructor(obj) {
    super(obj)

    this.onCreate()
  }
  maxTiltAngle = 4

  onUpdate(dT, input) {
    let rBody = this.attachedObject.getComponent("RigidBody")

    let axis = new CANNON.Vec3(-input.getAxis("Vertical"), 0, -input.getAxis("Horizontal"))
    let angle = this.maxTiltAngle * 0.0174533
    rBody.setRotation(axis, angle)
  }
}

module.exports = TiltComponent