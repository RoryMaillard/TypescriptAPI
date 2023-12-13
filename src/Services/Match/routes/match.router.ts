import { FastifyInstance } from 'fastify'
import * as controllers from '../controllers'
import {getMatchesByUserId} from "../controllers";

async function matchRouter(fastify: FastifyInstance) {

  fastify.route({
	method: 'GET',
	url: '/',
	handler: controllers.getMatches,
  });
  fastify.route({
    method: 'GET',
    url: '/:id',
    handler: controllers.getMatchById,
  });
  fastify.route({
    method: 'GET',
    url: '/:id/rounds',
    handler: controllers.getRoundsByMatchId,
  })
  fastify.route({
    method: 'POST',
    url: '/createMatch',
    handler: controllers.createMatch,
  });
  fastify.route({
    method: 'DELETE',
    url: '/delete/:id',
    handler: controllers.deleteMatch,
  });
  fastify.route({
    method: 'POST',
    url: '/createround',
    handler: controllers.createRound,
  });
  fastify.route({
    method: 'GET',
    url: '/rounds/:id/',
    handler: controllers.getRoundById,
  });
  fastify.route({
    method: 'GET',
    url: '/rounds/:id/outcome/:player1/:player2',
    handler: controllers.calculateOutcome,
  });
  fastify.route({
    method: 'GET',
    url: '/player/:id',
    handler: controllers.getMatchesByUserId,
  });
  fastify.route({
    method: 'put',
    url: '/:id/nextround',
    handler: controllers.nextRound,
  });
  fastify.route({
    method: 'put',
    url: '/:id',
    handler: controllers.updateMatch,
  });
}

export default matchRouter