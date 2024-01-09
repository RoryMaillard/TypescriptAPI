import { FastifyReply, FastifyRequest } from "fastify"
import type * as s from 'zapatos/schema'
import * as db from 'zapatos/db'
import pool from '../../Store/db/pgPool'


export const getUsers = 
  async (request: FastifyRequest, reply: FastifyReply) => {
    return db.sql<s.users.SQL, s.users.Selectable[]>`SELECT * FROM ${"users"}`
    .run(pool)
    .then((users) => ({ data: users }))
    // Or .then((users) => reply.send({ data: users }))
}

export const getUserById = 
  async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const userId = request.params.id;
    return db.sql<s.users.SQL, s.users.Selectable[]>`SELECT * FROM ${"users"} WHERE id = ${db.param(userId)}`
    .run(pool)
    .then((user) => ({ data: user }))
}

export const getUsernameById = 
  async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const userId = request.params.id;
    return db.sql<s.users.SQL, s.users.Selectable[]>`SELECT username FROM ${"users"} WHERE id = ${db.param(userId)}`
    .run(pool)
    .then((username) => ({ data: username }))
}

export const addUser = 
  async (request: FastifyRequest<{ Body: { username: string, password: string, email: string } }>, reply: FastifyReply) => {
    return db.sql<s.users.SQL, s.users.Selectable[]>`INSERT INTO users (username, password, email) VALUES (${db.param(request.body.username)}, ${db.param(request.body.password)}, ${db.param(request.body.email)})`
    .run(pool)
}

export const updateUserById = 
  async (request: FastifyRequest<{ Params: { id: string }; Body: { username?: string, password?: string, email?: string } }>, reply: FastifyReply) => {
    const userId = request.params.id;
    if (request.body.username){
      db.sql<s.users.SQL, s.users.Selectable[]>`UPDATE users SET username = ${db.param(request.body.username)} WHERE id = ${db.param(userId)}`
    .run(pool)
    }
    if (request.body.password){
      db.sql<s.users.SQL, s.users.Selectable[]>`UPDATE users SET password = ${db.param(request.body.password)} WHERE id = ${db.param(userId)}`
    .run(pool)
    }
    if (request.body.email){
      db.sql<s.users.SQL, s.users.Selectable[]>`UPDATE users SET email = ${db.param(request.body.email)} WHERE id = ${db.param(userId)}`
    .run(pool)
    }
}