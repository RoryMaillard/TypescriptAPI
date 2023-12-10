import { FastifyInstance } from 'fastify'
import * as controllers from '../controllers'

async function userRouter(fastify: FastifyInstance) {

  fastify.route({
	method: 'GET',
	url: '/',
	handler: controllers.getUsers,
  });
  fastify.route({
    method: 'GET',
    url: '/:id',
    handler: controllers.getUserById,
  });
  fastify.route({
    method: 'GET',
    url: '/:id/username',
    handler: controllers.getUsernameById,
  })
  fastify.route({
    method: 'POST',
    url: '/',
    handler: controllers.addUser,
  });
  fastify.route({
    method: 'PUT',
    url: '/:id',
    handler: controllers.updateUserById,
  });

  fastify.route({
    method: 'GET',
    url: '/player',
    handler: controllers.getPlayers,
  });
  fastify.route({
    method: 'GET',
    url: '/player/:id',
    handler: controllers.getPlayerById,
  });
  fastify.route({
    method: 'GET',
    url: '/player/:id/creatures',
    handler: controllers.getPlayerCreatures,
  });
  fastify.route({
    method: 'GET',
    url: '/player/:id/purchasableCreatures',
    handler: controllers.getPlayerPurchasableCreatures,
  });
  fastify.route({
    method: 'PUT',
    url: '/player/:id/purchaseCreature/:creatureId',
    handler: controllers.purchaseCreature,
  });
}

export default userRouter