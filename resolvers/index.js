const { authResolver } = require('./auth') 
const { eventResolver } = require('./event') 
const { bookingResolver } = require('./booking') 
const { merge } = require('lodash')

const resolvers = merge(authResolver, eventResolver, bookingResolver)
module.exports = { resolvers }