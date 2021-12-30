const InputController = function () {
  const fs = require('fs')

  let usingGamepad = false
  const autoUseGamepad = true
  let gamepadConnected = false
  const gamepadID = 0
  let controls = {}
  const keyStates = {}
  const buttonStates = {}
  const events = {}
  const gamepadPollFrequency = 100

  window.getInputController = () => { return this }

  const updateGamepadInputs = () => {
    if (usingGamepad && gamepadConnected) {
      const gamepad = navigator.getGamepads()[gamepadID]

      for (let b = 0; b < gamepad.buttons.length; b++) {
        // Dispatch events if necesary
        if (buttonStates[b] === false && gamepad.buttons[b].pressed === true) {
          Object.entries(controls).forEach((control) => {
            if (control[1].Type === 'Button') {
              if (control[1].Gamepad.ButtonID === b) {
                window.dispatchEvent(events[`${control[0]}-pressed`])
              }
            }
          })
        }
        if (buttonStates[b] === true && gamepad.buttons[b].pressed === false) {
          Object.entries(controls).forEach((control) => {
            if (control[1].Type === 'Button') {
              if (control[1].Gamepad.ButtonID === b) {
                window.dispatchEvent(events[`${control[0]}-released`])
              }
            }
          })
        }

        buttonStates[b] = gamepad.buttons[b].pressed
      }
    }
  }

  return {
    init: (path = './app/game-data/control-description.json') => {
      const rawdata = fs.readFileSync(path)
      controls = JSON.parse(rawdata).Controls
      // Creating events for buttons
      Object.entries(controls).forEach((control) => {
        if (control[1].Type === 'Button') {
          events[`${control[0]}-pressed`] = new Event(`${control[0]}-pressed`)
          events[`${control[0]}-released`] = new Event(`${control[0]}-released`)
        }
      })
      console.log(events)

      window.addEventListener('keydown', (e) => {
        keyStates[e.code] = true

        // dispatching events
        Object.entries(controls).forEach((control) => {
          if (control[1].Type === 'Button') {
            if (control[1].KeyMouse.Key === e.code) {
              window.dispatchEvent(events[`${control[0]}-pressed`])
            }
          }
        })
      })

      window.addEventListener('keyup', (e) => {
        keyStates[e.code] = false

        // dispatching events
        Object.entries(controls).forEach((control) => {
          if (control[1].Type === 'Button') {
            if (control[1].KeyMouse.Key === e.code) {
              window.dispatchEvent(events[`${control[0]}-released`])
            }
          }
        })
      })

      window.addEventListener('gamepadconnected', (e) => {
        if (gamepadID === e.gamepad.index) {
          console.log(`Gamepad ${e.gamepad.index} connected`, navigator.getGamepads()[e.gamepad.index])
          if (autoUseGamepad) {
            usingGamepad = true
          }
          gamepadConnected = true
        }
      })

      window.addEventListener('gamepaddisconnected', (e) => {
        if (gamepadID === e.gamepad.index) {
          console.log('Gamepad disconnected from index %d: %s', e.gamepad.index, e.gamepad.id)
          usingGamepad = false
          gamepadConnected = false
        }
      })

      setInterval(updateGamepadInputs, gamepadPollFrequency)
    },
    addEventListener: (event, callback) => {
      window.addEventListener(event, callback)
    },
    switchInputs: () => {
      usingGamepad = !usingGamepad
      if (!gamepadConnected) {
        usingGamepad = false
      }
    },
    getIsUsingGamepad: () => { return usingGamepad },
    getAxis: (name) => {
      if (usingGamepad) {
        const axis = controls[name].Gamepad.AxesID
        let value = navigator.getGamepads()[gamepadID].axes[axis]
        if (controls[name].Gamepad.Inverted !== undefined) {
          value *= -1
        }
        return value
      } else {
        const posKey = controls[name].KeyMouse.Positive
        const negKey = controls[name].KeyMouse.Negative

        let sum = 0
        if (keyStates[posKey] !== undefined) {
          if (keyStates[posKey] === true) {
            sum += 1
          }
        }
        if (keyStates[negKey] !== undefined) {
          if (keyStates[negKey] === true) {
            sum -= 1
          }
        }
        return sum
      }
    },
    getButton: (name) => {
      if (usingGamepad) {
        const button = controls[name].Gamepad.ButtonID
        const value = navigator.getGamepads()[gamepadID].buttons[button]
        return value.pressed
      }

      return false
    }
  }
}

module.exports = InputController
