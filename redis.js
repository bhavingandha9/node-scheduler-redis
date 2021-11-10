const Redis = require('ioredis')
const redisClient = new Redis()

redisClient.on('error', function (error) {
  console.log('Error in Redis', error)
  process.exit(1)
})

redisClient.on('connect', function () {
  console.log('redis connected')
})

module.exports = {
  redisClient
}
