let Primitive = {
  BOX: THREE.BoxGeometry,
  PLANE: THREE.PlaneGeometry,
  SPHERE: THREE.SphereGeometry
}

let BodyPrimitive = {
  CUBE: (x, y, z) => { return new CANNON.Box(new CANNON.Vec3(x, y, z)) },
  SPHERE: (r) => { return new CANNON.Sphere(r) }
}

let SimpleMaterial = {
  NORMAL: THREE.MeshNormalMaterial
}

class Object3D {
  constructor (parent, geometry, material){
    this.mesh = new THREE.Mesh(geometry, material)
    this.components = []
    parent.add(this.mesh)
  }

  getMesh () { return this.mesh }
  addComponent (comp) { this.components.push(comp) }
  onUpdate (dT) {
    this.components.forEach((comp) => {
      comp.onUpdate(dT)
    })
  }
  onLateUpdate (dT) {
    this.components.forEach((comp) => {
      comp.onLateUpdate(dT)
    })
  }
}

class Component {
  constructor(obj) {
    this.attachedObject = obj

    this.onCreate()
  }
  onCreate() {}
  onUpdate() {}
  onLateUpdate() {}
}

class RigidBody extends Component {
  constructor(obj, bodyShape, mass) {
    super(obj)
    this.bodyShape = bodyShape
    this.mass = mass
    console.log(bodyShape)

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


module.exports = { Primitive, BodyPrimitive, SimpleMaterial, Object3D, Component, RigidBody }