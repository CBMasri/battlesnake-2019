/**
 * Compare two sets of coordinates.
 *
 * @returns {Boolean} true if the same, else false
 */
exports.coordsMatch = function (x, y) {
  if (x.x === y.x && x.y === y.y) {
    return true
  }
  return false
}

/**
 * Shuffles an array in-place.
 *
 * @param {Array}
 * @returns {Array}
 */
exports.shuffle = function (array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}
