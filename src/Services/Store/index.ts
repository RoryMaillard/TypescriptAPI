import fastify from 'fastify'
import userRouter from './routes/store.router'
import {config} from "dotenv";

const port = 5001;
//const host = '0.0.0.0';

config({path: `.env`})
const startServer = async () => {
  try {
	const server = fastify()

	const errorHandler = (error, address) => {
  	server.log.error(error, address);
	}

	server.register(userRouter, { prefix: '/api/store' })

	await server.listen({ port }, errorHandler)
  } catch (e) {
	console.error(e)
  }
}

process.on('unhandledRejection', (e) => {
  console.error(e)
  process.exit(1)
})

startServer()