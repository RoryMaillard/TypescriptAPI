import { FastifyInstance } from 'fastify'
import * as controllers from '../controllers'

async function storeRouter(fastify: FastifyInstance) {

  fastify.route({
	method: 'GET',
	url: '/',
	handler: controllers.getCreatures,
  });
  fastify.route({
    method: 'GET',
    url: '/:id',
    handler: controllers.getCreatureById,
  });
  fastify.route({
    method: 'GET',
    url: '/creatures/:ids',
    handler: controllers.getCreaturesById,
  });
  fastify.route({
    method: 'GET',
    url: '/purchase/:userCreaturesId',
    handler: controllers.getUserPurchasableCreatures,
  });
  fastify.route({
    method: 'GET',
    url: '/purchase/:userCreaturesId/:id',
    handler: controllers.getUserPurchasableCreaturesById,
  });
}

export default storeRouter