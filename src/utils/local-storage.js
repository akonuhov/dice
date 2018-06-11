/**
* Set in localStorage data.
*
* @param {data} daiceObject - set data
*/
export function setLocalStorage (data) {
  localStorage.setItem('dice', JSON.stringify(data))
}
/**
* Get data from the localStorage
*
* @return {object} daiceObject
*/
export function getLocalStorage () {
  return JSON.parse(localStorage.getItem('dice'))
}
