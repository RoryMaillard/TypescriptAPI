import { FastifyReply, FastifyRequest } from "fastify"
import type * as s from 'zapatos/schema'
import * as db from 'zapatos/db'
import pool from '../../Match/db/pgPool'
import axios from 'axios'

export const getRoundById =
    async (request: FastifyRequest<{ Params: { id: string }}>, reply: FastifyReply) => {
        const roundId = request.params.id;
        return db.sql<s.rounds.SQL, s.rounds.Selectable[]>`SELECT * FROM ${"rounds"} WHERE id = ${db.param(roundId)}`
            .run(pool)
            .then((round) => ({ data: round }))
    }
export const createRound =
    async (request: FastifyRequest<{ Body: { status: string }}>, reply: FastifyReply) => {
        return db.sql<s.rounds.SQL, s.rounds.Selectable[]>`INSERT INTO ${"rounds"} (status) VALUES (${db.param("Choosing")}) RETURNING *`
            .run(pool)
            .then((round) => ({ data: round }))
    }
export const calculateOutcome =
    async (request: FastifyRequest<{ Params: { id: string, player1 : string, player2 : string }}>, reply: FastifyReply) => {
        const roundId = request.params.id;
        const player1Id = request.params.player1;
        const player2Id = request.params.player2;
        const round = await axios.get(`http://match:5002/api/match/rounds/${roundId}`)
        if (!round.data.data[0]['creaturePlayer1'] || !round.data.data[0]['creaturePlayer2']){
            throw new Error('Not every player has chosen their pokemon')
        }
        const creature1 = await axios.get(`http://store:5001/api/store/${round.data.data[0]['creaturePlayer1']}`)
        const creature2 = await axios.get(`http://store:5001/api/store/${round.data.data[0]['creaturePlayer2']}`)
        let winnerId = player2Id;
        if (creature1.data.data[0]['hp'] + creature1.data.data[0]['attack'] >  creature2.data.data[0]['hp'] + creature2.data.data[0]['attack'] ){
            winnerId = player1Id
        }
        await db.sql<s.rounds.SQL, s.rounds.Selectable[]>`UPDATE ${"rounds"} SET ${"winner"} = ${db.param(winnerId)} WHERE id = ${db.param(roundId)}`.run(pool)
        await db.sql<s.rounds.SQL, s.rounds.Selectable[]>`UPDATE ${"rounds"} SET ${"status"} = ${db.param("Finished")}WHERE id = ${db.param(roundId)}`.run(pool)
    }
export const chooseCreaturePlayer1 =
    async (request: FastifyRequest<{ Params: { id: string , creatureId : string}}>, reply: FastifyReply) => {
        const roundId = request.params.id;
        const creatureId = request.params.creatureId
        db.sql<s.rounds.SQL, s.rounds.Selectable[]>`UPDATE ${"rounds"} SET ${"creatureplayer1"} = ${db.param(creatureId)} WHERE id = ${db.param(roundId)}`.run(pool)
    }
export const chooseCreaturePlayer2 =
    async (request: FastifyRequest<{ Params: { id: string , creatureId : string}}>, reply: FastifyReply) => {
        const roundId = request.params.id;
        const creatureId = request.params.creatureId
        db.sql<s.rounds.SQL, s.rounds.Selectable[]>`UPDATE ${"rounds"} SET ${"creatureplayer2"} = ${db.param(creatureId)} WHERE id = ${db.param(roundId)}`.run(pool)
    }