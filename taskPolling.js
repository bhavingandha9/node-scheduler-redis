const { redisClient } = require('./redis')

const pollScheduler = async () => {
  try {
    await redisClient.watch('scheduler')

    let data = await redisClient.zrangebyscore(["scheduler", Math.floor(+new Date() / 1000), 0, "WITHSCORES", "LIMIT", 0, 1])
    data = data[0]

    if (data) {
      const parsedData = JSON.parse(data)
      const updated = await redisClient
        .multi()
        .zrem('scheduler', data)
        .rpush(parsedData.taskType, JSON.stringify(parsedData.details))
        .exec()

      if (updated) { // success
        pollScheduler()
      } else { // error try again
        pollScheduler()
      }
    } else { // no data poll again after delay
      await redisClient.unwatch()
      setTimeout(() => { pollScheduler() }, 1000)
    }
  } catch (error) {
    console.log({ error })
  }
}

pollScheduler()
