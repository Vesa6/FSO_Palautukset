const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  // All these next() calls move control to next middleware.
  // It basically says "Okay, this middleware is done, the next can go."
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

const tokenWare = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.replace(/bearer /i, '')
  }
  logger.info('Token:', request.token)
  next()
}


const userWare = async (request, response, next) => {

  //Get the token...
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    //Regex for case insensitive
    request.token = authorization.replace(/bearer /i, '')
  }

  // We basically need to open the token to get the user info
  let decodedToken
  try {
    // request.token is given by the tokenWare middleware.
    // tokenWare needs to be before this
    decodedToken = jwt.verify(request.token, process.env.SECRET)
    logger.info('Decoded Token:', decodedToken)
  } catch (error) {
    logger.error('Error decoding token:', error)
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)

  if (!user) {
    return response.status(401).json({ error: 'token invalid' })
  }
  request.user = user
  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenWare, userWare
}