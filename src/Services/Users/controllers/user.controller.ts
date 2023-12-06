import { FastifyReply, FastifyRequest } from "fastify"
import type * as s from 'zapatos/schema'
import * as db from 'zapatos/db'
import pool from '../db/pgPool'


export const listUsers = 
  async (request: FastifyRequest, reply: FastifyReply) => {
    return db.sql<s.users.SQL, s.users.Selectable[]>`SELECT * FROM ${"users"}`
    .run(pool)
    .then((users) => ({ data: users }))
    // Or .then((users) => reply.send({ data: users }))
}

export const getUserById = 
  async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const userId = request.params.id;
    return db.sql<s.users.SQL, s.users.Selectable[]>`SELECT * FROM ${"users"} WHERE user_id = ${db.param(userId)}`
    .run(pool)
    .then((user) => ({ data: user }))
}

export const addUser = 
  async (request: FastifyRequest<{ Body: { name: string } }>, reply: FastifyReply) => {
    const name = request.body.name;
    return db.sql<s.users.SQL, s.users.Selectable[]>`INSERT INTO users (name) VALUES (${db.param(name)})`
    .run(pool)
}

export const updateUserById = 
  async (request: FastifyRequest<{ Params: { id: string }; Body: { score?: number } }>, reply: FastifyReply) => {
    const userId = request.params.id;
    if (request.body.score){
      return db.sql<s.users.SQL, s.users.Selectable[]>`UPDATE users SET score = ${db.param(request.body.score)} WHERE user_id = ${db.param(userId)}`
    .run(pool)
    } 
}