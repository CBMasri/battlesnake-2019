const helpers = require('./helpers.js')

class GameState {
  constructor () {
    this.id = null
    this.turn = null
    this.board = null
    this.snake = null
  }

  setId (id) {
    this.id = id
  }

  setState (turn, board, snake) {
    this.turn = turn
    this.board = board
    this.snake = snake
  }

  getHead () {
    return Object.assign({}, this.snake.body[0])
  }

  getTail () {
    return Object.assign({}, this.snake.body[this.snake.body.length - 1])
  }

  getClosestFood () {
    const head = this.getHead()

    // TODO
  }

  getBoundingX () {
    return this.board.width - 1
  }

  getBoundingY () {
    return this.board.height - 1
  }

  /**
   * Determine if the next move is valid.
   *
   * @param {String} direction - 'up', 'down', 'left', 'right'
   */
  isValidMove (direction) {
    const head = this.getHead()
    return !this.goingToHitWall(direction) && !this.goingToHitSelf(direction) && !this.goingToHitOtherSnake(direction)
  }

  /**
   * Determine if the next move will cause our
   * snake to hit the wall.
   *
   * @param {String} direction - 'up', 'down', 'left', 'right'
   * @returns {Boolean} - true if going to hit a wall, else false
   */
  goingToHitWall (direction) {
    const head = this.getHead()

    switch (direction) {
      case 'up':
        if (head.y - 1 < 0) {
          return true
        }
        return false
      case 'down':
        if (head.y + 1 === this.board.height) {
          return true
        }
        return false
      case 'left':
        if (head.x - 1 < 0) {
          return true
        }
        return false
      case 'right':
        if (head.x + 1 === this.board.width) {
          return true
        }
        return false
      default:
        throw new Error(`Unknown direction: '${direction}'`)
    }
  }

  /**
   * Determine if the next move will cause our snake to hit itself.
   *
   * @param {String} direction - 'up', 'down', 'left', 'right'
   * @returns {Boolean} - true if going to hit self, else false
   */
  goingToHitSelf (direction) {
    const head = this.getNextHeadCoords(direction)
    const body = this.snake.body

    for (let i = 0; i < body.length; i++) {
      if (helpers.coordsMatch(head, body[i])) {
        console.log('GOING TO HIT SELF')
        return true
      }
    }
    return false
  }

  /**
   * Determine if the next move will cause our snake to hit another snake.
   *
   * @param {String} direction - 'up', 'down', 'left', 'right'
   * @returns {Boolean} - true if going to hit self, else false
   */
  goingToHitOtherSnake (direction) {
    const head = this.getNextHeadCoords(direction)
    const enemies = this.getAllEnemies()

    for (let i = 0; i < enemies.length; i++) {
      if (helpers.coordsMatch(head, enemies[i])) {
        // TODO: Avoid the other snakes head (unless we're bigger)
        console.log('GOING TO HIT OTHER SNAKE')
        return true
      }
    }
    return false
  }

  /**
   * Update the head coordinates in the given direction.
   *
   * @param {String} direction - 'up', 'down', 'left', 'right'
   * @returns {Object} - updated head coordinates
   */
  getNextHeadCoords(direction) {
    const head = this.getHead()
    switch (direction) {
      case 'up':
        head.y--
        break
      case 'down':
        head.y++
        break
      case 'left':
        head.x--
        break
      case 'right':
        head.x++
        break
      default:
        throw new Error(`Unknown direction: '${direction}'`)
    }
    return head
  }

  /**
   * Return the coordinates of all board spaces currently
   * occupied by alive enemy snakes.
   */
  getAllEnemies () {
    let enemies = []

    for (let i = 0; i < this.board.snakes.length; i++) {
      const enemy = this.board.snakes[i]
      if (enemy.id !== this.snake.id && enemy.health > 0) {
        for (let j = 0; j < enemy.body.length; j++) {
          enemies.push(enemy.body[j])
        }
      }
    }

    return enemies
  }
}

module.exports = GameState
