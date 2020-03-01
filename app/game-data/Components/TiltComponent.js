const Components = require("../../scripts/engine/Components.js")
// const InputController = require("../../scripts/engine/InputController.js")
class TiltComponent extends Components.Component {
  maxTiltAngle = 4;

  onUpdate(dT, input) {
    let rBody = this.attachedObject.getComponent("RigidBody")
    let axis = new CANNON.Vec3(0, 0, 1);
    // let angle = Math.PI / 3;
    let angle = this.maxTiltAngle * input.getAxis("Horizontal") * 0.0174533
    rBody.rotate(axis, angle)

    axis = new CANNON.Vec3(1, 0, 0)
    angle = this.maxTiltAngle * input.getAxis("Vertical") * 0.0174533
    rBody.rotate(axis, angle)
  }
}

module.exports = TiltComponent