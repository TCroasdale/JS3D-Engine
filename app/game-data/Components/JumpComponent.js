const Components = require("../../scripts/engine/Components.js")

class JumpComponent extends Components.Component {
  constructor(obj){
    super(obj)

    this.onCreate()
  }

  onCreate() {
    window.addEventListener("Jump-pressed", (e) => {
      console.log("Jump pressed")
      let rBody = this.attachedObject.getComponent("RigidBody")
      rBody.addForce({ x: 0, y: 1, z: 0 })
    })

    window.addEventListener("Jump-released", (e) => {
      console.log("Jump released")
    })
  }
}

module.exports = JumpComponent