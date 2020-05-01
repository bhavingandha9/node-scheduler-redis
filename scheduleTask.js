const redis = require('redis')
const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379
})

redisClient.on('error', function (error) {
  console.log('Error in Redis', error)
  process.exit(1)
})

redisClient.on('connect', function () {
  console.log('redis connected')
})

const submitTask = (taskDetails, time) => {
  redisClient.zadd('scheduler', time, taskDetails, (err, data) => {
    console.log(err, data)
  })
}

const taskData = {
  taskType: 'sms',
  details: {
    to: 'Boss',
    message: 'Still working :)'
  }
}

submitTask(JSON.stringify(taskData), Math.floor(+new Date('2020-05-01 22:00:00') / 1000))
