const Components = require("../../scripts/engine/Components.js")

class TiltComponent extends Components.Component {
  constructor(obj){
    super(obj)

    this.onCreate()
  }
  maxTiltAngle = 4

  onUpdate(dT, input) {
    let rBody = this.attachedObject.getComponent("RigidBody")

    let axis = new CANNON.Vec3(-input.getAxis("Vertical"), 0, -input.getAxis("Horizontal"))
    let angle = this.maxTiltAngle * 0.0174533
    rBody.rotate(axis, angle)
    console.log(angle)
  }
}

module.exports = TiltComponent