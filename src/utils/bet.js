/**
* Get a random integer between `min` and `max`.
*
* @param {number} number - the selected number by the user
* @param {number} random - the random integer
* @param {string} bet - bet hi or bet lo
* @return {boolean} a random integer
*/
export default function onBet (number, random, bet) {
  if (bet === 'lo') {
    if (number >= random) {
      return true
    } else {
      return false
    }
  } else if (bet === 'hi') {
    if (number <= random) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}
