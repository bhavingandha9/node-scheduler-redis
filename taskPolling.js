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

const pollScheduler = () => {
  redisClient.zrevrangebyscore([
    "scheduler",
    Math.floor(+new Date() / 1000),
    0,
    "WITHSCORES",
    "LIMIT",
    0,
    1
  ], (err, data) => {
    data = data[0]
    if (!data) {
      setTimeout(() => { pollScheduler() }, 1000)
      return
    }
    data = JSON.parse(data)

    // here i have used simple switch case, we can submit it to a queue, stream, pub/sub etc
    switch (data.taskType) {
      case 'sms':
        sendSms(data.details.to, data.details.message)
    }

    redisClient.zrem('scheduler', JSON.stringify(data), (err, data) => { // remove the task from scheduler
      pollScheduler() // poll next task
    })
  })
}


const sendSms = (to, text) => {
  console.log({ to, text })
  // send sms logic 
}

pollScheduler()
