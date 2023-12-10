import { FastifyReply, FastifyRequest } from "fastify"
import type * as s from 'zapatos/schema'
import * as db from 'zapatos/db'
import pool from '../../Store/db/pgPool'
import http from 'http'
import axios from 'axios'


export const getPlayers = 
  async (request: FastifyRequest, reply: FastifyReply) => {
    return db.sql<s.players.SQL, s.players.Selectable[]>`SELECT * FROM ${"players"}`
    .run(pool)
    .then((players) => ({ data: players }))
    // Or .then((players) => reply.send({ data: players }))
}

export const getPlayerById = 
  async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const userId = request.params.id;
    return db.sql<s.players.SQL, s.players.Selectable[]>`SELECT * FROM ${"players"} WHERE id = ${db.param(userId)}`
    .run(pool)
    .then((user) => ({ data: user }))
}

// Erreur car base de données ElephantSQL n'accepte pas beacoup de requetes en même temps.
//export const getPlayerCreatures = 
//  async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
//    const userId = request.params.id;
//    const creaturesId =  await db.sql<s.players.SQL, s.players.Selectable[]>`SELECT creatures FROM ${"players"} WHERE id = ${db.param(userId)}`.run(pool).then((creaturesId) => ({ data: creaturesId }))
//    const apiResponse = await Promise.all(creaturesId.data[0]['creatures'].split(',').map(id => axios.get(`http://0.0.0.0:5001/api/store/${id}`).then(response => response.data.data[0])))
//    return apiResponse
//}
export const getPlayerCreatures = 
  async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const userId = request.params.id;
    const creaturesId =  await db.sql<s.players.SQL, s.players.Selectable[]>`SELECT creatures FROM ${"players"} WHERE id = ${db.param(userId)}`.run(pool).then((creaturesId) => ({ data: creaturesId }))
    const apiResponse = await axios.get(`http://0.0.0.0:5001/api/store/creatures/${creaturesId.data[0]['creatures']}`)
    return apiResponse.data
}

export const getPlayerPurchasableCreatures = 
  async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const userId = request.params.id;
    const creaturesId =  await db.sql<s.players.SQL, s.players.Selectable[]>`SELECT creatures FROM ${"players"} WHERE id = ${db.param(userId)}`.run(pool).then((creaturesId) => ({ data: creaturesId }))
    const apiResponse = await axios.get(`http://0.0.0.0:5001/api/store/purchase/${creaturesId.data[0]['creatures']}`)
    return apiResponse.data
}
export const purchaseCreature = 
  async (request: FastifyRequest<{ Params: { id: string, creatureId: string } }>, reply: FastifyReply) => {
    const userId = request.params.id;
    const creatureId = request.params.creatureId;
    const response =  await db.sql<s.players.SQL, s.players.Selectable[]>`SELECT creatures, credits FROM ${"players"} WHERE id = ${db.param(userId)}`.run(pool).then((creaturesId) => ({ data: creaturesId }))
    const storeResponse = await axios.get(`http://0.0.0.0:5001/api/store/purchase/${response.data[0]['creatures']}/${creatureId}`)
    const creature = storeResponse.data.data[0]
    console.log(creature['price'])
    console.log(response.data[0]['credits'])
    if (creature.price <= response.data[0]['credits']){
      db.sql<s.players.SQL, s.players.Selectable[]>`UPDATE ${"players"} SET ${"creatures"} = ${db.param(response.data[0]['creatures'] + ',' + creature.id)}, ${"credits"} = ${db.param(response.data[0]['credits'] - creature.price)} WHERE id = ${db.param(userId)}`.run(pool)
    }else{
      throw new Error('Not enough credits')
    }
}