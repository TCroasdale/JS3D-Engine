
class Component {
  constructor(obj) {
    this.attachedObject = obj
  }
  onCreate() {}
  onUpdate() {}
  onLateUpdate() {}
  static fromParameters(p) {}
}

class RigidBody extends Component {
  constructor(obj, bodyShape, mass) {
    super(obj)
    this.bodyShape = bodyShape
    this.mass = mass

    this.onCreate()
  }
  onCreate() {
    // this.attachedObject.mesh.useQuaternion = true
    this.body = new CANNON.Body({
      mass: this.mass, // kg
      position: new CANNON.Vec3(this.attachedObject.mesh.position.x,
                                this.attachedObject.mesh.position.y,
                                this.attachedObject.mesh.position.z), // m
      shape: this.bodyShape
   })
  }

  onLateUpdate() {
    this.attachedObject.mesh.position.x = this.body.position.x
    this.attachedObject.mesh.position.y = this.body.position.y
    this.attachedObject.mesh.position.z = this.body.position.z
    
    this.attachedObject.mesh.quaternion.x = this.body.quaternion.x
    this.attachedObject.mesh.quaternion.y = this.body.quaternion.y
    this.attachedObject.mesh.quaternion.z = this.body.quaternion.z
    this.attachedObject.mesh.quaternion.w = this.body.quaternion.w
    // console.log(this.attachedObject.mesh.quaternion)
  }
}

class Camera extends Component {
  constructor(obj, FoV, near, far) {
    super(obj)
    this.FoV = FoV
    this.near = near
    this.far = far
  }

  setCamera(camera) {
    this.camera = camera
  } 

  onCreate() {}
  onEarlyUpdate(dT) {
    this.camera.position.x = this.attachedObject.position.x
    this.camera.position.y = this.attachedObject.position.y
    this.camera.position.z = this.attachedObject.position.z
  }
  onUpdate() {}
  onLateUpdate() {}
}

module.exports = { Component, RigidBody, Camera }