const bodyParser = require('body-parser')
const express = require('express')
const logger = require('morgan')
const app = express()
const {
  fallbackHandler,
  notFoundHandler,
  genericErrorHandler,
  poweredByHandler
} = require('./handlers.js')

const Game = require('./state.js')
const helpers = require('./helpers.js')

// For deployment to Heroku, the port needs to be set using ENV, so
// we check for the port number in process.env
app.set('port', (process.env.PORT || 9001))

app.enable('verbose errors')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(poweredByHandler)

// --- SNAKE LOGIC GOES BELOW THIS LINE ---

const game = new Game()

// Handle POST request to '/start'
app.post('/start', (request, response) => {
  game.setId(request.body.game.id)
  game.setState(request.body.turn, request.body.board, request.body.you)

  const data = {
    color: '#06d66e',
    headType: 'pixel',
    tailType: 'regular'
  }

  return response.json(data)
})

// Handle POST request to '/move'
app.post('/move', (request, response) => {
  game.setState(request.body.turn, request.body.board, request.body.you)

  const data = {}
  let foundValidMove = false

  for (const move of helpers.shuffle(['up', 'down', 'left', 'right'])) {
    try {
      if (game.isValidMove(move)) {
        data.move = move
        foundValidMove = true
        break
      }
    } catch (err) {
      console.log(err)
    }
  }

  if (!foundValidMove) {
    console.log('NO VALID MOVES FOUND')
    data.move = 'up'
  }

  return response.json(data)
})

app.post('/end', (request, response) => {
  // NOTE: Any cleanup when a game is complete.
  return response.json({})
})

app.post('/ping', (request, response) => {
  // Used for checking if this snake is still alive.
  return response.json({});
})

// --- SNAKE LOGIC GOES ABOVE THIS LINE ---

app.use('*', fallbackHandler)
app.use(notFoundHandler)
app.use(genericErrorHandler)

app.listen(app.get('port'), () => {
  console.log('Server listening on port %s', app.get('port'))
})
