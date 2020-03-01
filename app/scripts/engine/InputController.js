InputController = function () {
  const fs = require('fs')

  let usingGamepad = false
  let autoUseGamepad = true
  let gamepadConnected = false
  let gamepadID = 0
  let controls = {}
  let axes = {}
  let buttons = {}

  return {
    init: (path = "./app/game-data/control-description.json") => {
      let rawdata = fs.readFileSync(path)
      controls = JSON.parse(rawdata).Controls
      console.log(controls.Controls)



      window.addEventListener("gamepadconnected", (e) => {
        console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
          e.gamepad.index, e.gamepad.id,
          e.gamepad.buttons.length, e.gamepad.axes.length);
        console.log(navigator.getGamepads()[e.gamepad.index])
        if (autoUseGamepad) {
          usingGamepad = true
        }
        gamepadConnected = true
      })

      window.addEventListener("gamepaddisconnected", (e) => {
        console.log("Gamepad disconnected from index %d: %s",
          e.gamepad.index, e.gamepad.id);
        usingGamepad = false
        gamepadConnected = false
      })
    },
    switchInputs: () => {
      usingGamepad = !usingGamepad 
      if (!gamepadConnected)
        isingGamepad = false
    },
    getIsUsingGamepad: () => { return usingGamepad },
    getAxis: (name) => {
      if (usingGamepad) {
        let axis = controls[name].Gamepad.AxesID
        let value = navigator.getGamepads()[gamepadID].axes[axis]
        if (controls[name].Gamepad.Inverted !== undefined) {
          value *= -1
        }
        return value
      }
    }
  }
}

module.exports = InputController