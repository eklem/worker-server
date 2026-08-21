/* ### ########################################################### ### */
/* ### Fake math library for demo purposes                         ### */

let responseJson = {
  type: 'result',
  mathSymbol: null,
  answer: null
}

const add = function (num1, num2) {
  const answer = num1 + num2
  responseJson = { answer: answer, mathSymbol: '+' }
  return responseJson
}

const subtract = function (num1, num2) {
  const answer = num1 - num2
  responseJson = { answer: answer, mathSymbol: '-' }
  return responseJson
}

const multiply = function (num1, num2) {
  const answer = num1 * num2
  responseJson = { answer: answer, mathSymbol: '*' }
  return responseJson
}

const divide = function (num1, num2) {
  const answer = num1 / num2
  responseJson = { answer: answer, mathSymbol: '/' }
  return responseJson
}

export { add, subtract, multiply, divide }
