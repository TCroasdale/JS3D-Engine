const Components = require("../../scripts/engine/Components.js")

class TiltComponent extends Components.Component {
  constructor(obj){
    super(obj)

    this.onCreate()
  }
  maxTiltAngle = 4

  onCreate() {
    window.addEventListener("Jump-pressed", (e) => {
      console.log("Jump pressed")
    })

    window.addEventListener("Jump-released", (e) => {
      console.log("Jump released")
    })
  }

  onUpdate(dT, input) {
    let rBody = this.attachedObject.getComponent("RigidBody")

    let axis = new CANNON.Vec3(-input.getAxis("Vertical"), 0, -input.getAxis("Horizontal"))
    let angle = this.maxTiltAngle * 0.0174533
    rBody.rotate(axis, angle)
  }
}

module.exports = TiltComponent