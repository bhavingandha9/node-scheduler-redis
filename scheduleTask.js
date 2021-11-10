const { redisClient } = require('./redis')

const submitTask = async (taskDetails, time) => {
  try {
    const data = await redisClient.zadd('scheduler', time, taskDetails)
    console.log({ data })
  } catch (error) {
    console.log({ error })
  }
}

const taskData = {
  taskType: 'sms',
  details: {
    to: 'Boss',
    message: 'Still working :)'
  }
}

submitTask(JSON.stringify(taskData), Math.floor(+new Date('2020-05-01 22:00:00') / 1000))

module.exports = {
  submitTask
}
