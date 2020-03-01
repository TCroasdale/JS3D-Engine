InputController = function () {
  const fs = require('fs')

  let usingGamepad = false
  let autoUseGamepad = true
  let gamepadConnected = false
  let gamepadID = 0
  let controls = {}
  let keyStates = {}

  window._InputController = this

  return {
    init: (path = "./app/game-data/control-description.json") => {
      let rawdata = fs.readFileSync(path)
      controls = JSON.parse(rawdata).Controls
      console.log(controls.Controls)

      window.addEventListener("keydown", (e) => {
        keyStates[e.code] = true
      })

      window.addEventListener("keyup", (e) => {
        keyStates[e.code] = false
      })

      window.addEventListener("gamepadconnected", (e) => {
        console.log(`Gamepad ${e.gamepad.index} connected`, navigator.getGamepads()[e.gamepad.index])
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
      } else {
        let posKey = controls[name].KeyMouse.Positive
        let negKey = controls[name].KeyMouse.Negative

        let sum = 0
        if (keyStates[posKey] !== undefined) {
          if (keyStates[posKey] === true) {
            sum += 1
          }
        }
        if (keyStates[negKey] !== undefined) {
          if (keyStates[negKey] === true) {
            sum -=1
          }
        }
        return sum
      }
    },
    getButton: (name) => {
      if (usingGamepad) {
        let button = controls[name].Gamepad.ButtonID
        let value = navigator.getGamepads()[gamepadID].buttons[button]
        return value.pressed
      }

      return false
    }
  }
}

module.exports = InputController