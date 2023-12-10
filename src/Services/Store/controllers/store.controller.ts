import { FastifyReply, FastifyRequest } from "fastify"
import type * as s from 'zapatos/schema'
import * as db from 'zapatos/db'
import pool from '../db/pgPool'


export const getCreatures = 
  async (request: FastifyRequest, reply: FastifyReply) => {
    return db.sql<s.creatures.SQL, s.creatures.Selectable[]>`SELECT * FROM ${"creatures"}`
    .run(pool)
    .then((creatures) => ({ data: creatures }))
    // Or .then((users) => reply.send({ data: users }))
}

export const getCreatureById = 
  async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const creatureId = request.params.id;
    return db.sql<s.creatures.SQL, s.creatures.Selectable[]>`SELECT * FROM ${"creatures"} WHERE id = ${db.param(creatureId)}`
    .run(pool)
    .then((creature) => ({ data: creature }))
}
export const getUserPurchasableCreatures = 
  async (request: FastifyRequest<{Params: { userCreaturesId: string } }>, reply: FastifyReply) => {
    if (request.params.userCreaturesId){
      const userCreaturesId = request.params.userCreaturesId.split(',').map(Number);
      return db.sql<s.creatures.SQL, s.creatures.Selectable[]>`SELECT * FROM ${"creatures"} WHERE id NOT IN (${db.vals(userCreaturesId)})`
      .run(pool)
      .then((creatures) => ({ data: creatures }))
    } 
}
export const getUserPurchasableCreaturesById = 
  async (request: FastifyRequest<{ Params: { id: string, userCreaturesId: string}}>, reply: FastifyReply) => {
    if (request.params.userCreaturesId){
      const creatureId = request.params.id;
      const userCreaturesId = request.params.userCreaturesId.split(',').map(Number);
      return db.sql<s.creatures.SQL, s.creatures.Selectable[]>`SELECT * FROM ${"creatures"} WHERE id NOT IN (${db.vals(userCreaturesId)}) AND id = ${db.param(creatureId)}`
      .run(pool)
      .then((creature) => ({ data: creature }))
    } 
}