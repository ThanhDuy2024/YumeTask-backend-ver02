import { createClient } from 'redis';

export const client = createClient({
    username: String(process.env.REDIS_NAME),
    password: String(process.env.REDIS_PASSWORD),
    socket: {
        host: 'redis-18428.c11.us-east-1-2.ec2.cloud.redislabs.com',
        port: 18428
    }
});


export const connectRedis = async () => {
  try {
    await client.connect();
    console.log("Redis has been conntected!!")
  } catch (error) {
    console.log(error)
    console.log("Redis has been disconneted!!")
  }
}
