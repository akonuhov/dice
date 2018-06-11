/**
* Get a hash string.
*
* @param {number} random - random number
* @return {string} hash string
*/
import md5 from 'md5'
export default function getHesh (random) {
  return md5(random)
}
