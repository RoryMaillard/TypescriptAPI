import { FastifyReply, FastifyRequest } from "fastify"
import type * as s from 'zapatos/schema'
import * as db from 'zapatos/db'
import pool from '../../Match/db/pgPool'
import {matches} from "zapatos/schema";
import axios from "axios";


export const getMatches =
  async (request: FastifyRequest, reply: FastifyReply) => {
    return db.sql<s.matches.SQL, s.matches.Selectable[]>`SELECT * FROM ${"matches"}`
    .run(pool)
    .then((matches) => ({ data: matches }))
}

export const getMatchById =
  async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const matchId = request.params.id;
    return db.sql<s.matches.SQL, s.matches.Selectable[]>`SELECT * FROM ${"matches"} WHERE id = ${db.param(matchId)}`
    .run(pool)
    .then((match) => ({ data: match }))
}

export const createMatch =
    async (request: FastifyRequest<{Body: { player1: string, player2?:string } }>, reply: FastifyReply) => {
        let player2 = null;
        if (request.body.player2) {
            player2 = request.body.player2
        }
        return db.sql<s.matches.SQL, s.matches.Selectable[]>`INSERT INTO matches (player1, player2, winner) VALUES (${db.param(request.body.player1)}, ${db.param(player2)}, ${db.param(null)})`
            .run(pool)
    }
export const deleteMatch =
    async (request: FastifyRequest<{Params: { id:string } }>, reply: FastifyReply) => {
        const matchId= request.params.id
        return db.sql<s.matches.SQL, s.matches.Selectable[]>`DELETE FROM matches WHERE id = ${db.param(matchId)}`
            .run(pool)
    }

export const getMatchesByUserId =
  async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const userId = request.params.id;
    return db.sql<s.matches.SQL, s.matches.Selectable[]>`SELECT username FROM ${"matches"} WHERE player1 = ${db.param(userId)} OR player2 = ${db.param(userId)}`
    .run(pool)
    .then((matches) => ({ data: matches }))
}

export const getRoundsByMatchId =
  async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const matchId = request.params.id;
    return db.sql<s.matches.SQL, s.matches.Selectable[]>`SELECT round1,round2,round3,round4,round5 FROM ${"matches"} WHERE id =  ${db.param(matchId)}`
    .run(pool)
    .then((rounds) => ({data: rounds}))
}

export const nextRound =
  async (request: FastifyRequest<{ Params: { id: string }}>, reply: FastifyReply) => {
    const matchId = request.params.id;
    const match = await axios.get(`http://0.0.0.0:5002/api/match/${db.param(matchId)}`)
    let winsPlayer1 = 0
    let winsPlayer2 = 0
    if (!match.data[0]["round1"]) {
        const round = await axios.post(`http://0.0.0.0:5002/api/match/createround`, "{'status' : 'Choosing' }")
        db.sql<s.matches.SQL, s.matches.Selectable[]>`UPDATE ${"matches"}
                                                      SET ${"round1"} = ${db.param(round.data[0]['id'])}`
    }else{
        const round = await axios.get(`http://0.0.0.0:5002/api/match/rounds/${match.data[0]["round1"]}`)
        if (round.data[0]["status"] != "Finished"){
            await axios.get(`http://0.0.0.0:5002/api/match/rounds/${match.data[0]["round1"]}/outcome/${match.data[0]["player1"]}/${match.data[0]["player2"]}`)
        }else{
            if (round.data[0]["winner"] == match.data[0]["player1"]){
                winsPlayer1 += 1
            }else {
                winsPlayer2 +=1
            }
            if (!match.data[0]["round2"]) {
                const round = await axios.post(`http://0.0.0.0:5002/api/match/createround`, "{'status' : 'Choosing' }")
                db.sql<s.matches.SQL, s.matches.Selectable[]>`UPDATE ${"matches"}
                                                      SET ${"round2"} = ${db.param(round.data[0]['id'])}`
            }else {
                const round = await axios.get(`http://0.0.0.0:5002/api/match/rounds/${match.data[0]["round2"]}`)
                if (round.data[0]["status"] != "Finished") {
                    await axios.get(`http://0.0.0.0:5002/api/match/rounds/${match.data[0]["round2"]}/outcome/${match.data[0]["player1"]}/${match.data[0]["player2"]}`)
                }else{
                    if (round.data[0]["winner"] == match.data[0]["player1"]){
                        winsPlayer1 += 1
                    }else {
                        winsPlayer2 +=1
                    }
                    if (!match.data[0]["round3"]) {
                        const round = await axios.post(`http://0.0.0.0:5002/api/match/createround`, "{'status' : 'Choosing' }")
                        db.sql<s.matches.SQL, s.matches.Selectable[]>`UPDATE ${"matches"}
                                                      SET ${"round3"} = ${db.param(round.data[0]['id'])}`
                    }else
                    {
                        const round = await axios.get(`http://0.0.0.0:5002/api/match/rounds/${match.data[0]["round3"]}`)
                        if (round.data[0]["status"] != "Finished") {
                            await axios.get(`http://0.0.0.0:5002/api/match/rounds/${match.data[0]["round3"]}/outcome/${match.data[0]["player1"]}/${match.data[0]["player2"]}`)
                        }else{
                            if (round.data[0]["winner"] == match.data[0]["player1"]){
                                winsPlayer1 += 1
                            }else {
                                winsPlayer2 +=1
                            }
                            if (!match.data[0]["round4"]) {
                                const round = await axios.post(`http://0.0.0.0:5002/api/match/createround`, "{'status' : 'Choosing' }")
                                db.sql<s.matches.SQL, s.matches.Selectable[]>`UPDATE ${"matches"}
                                                      SET ${"round4"} = ${db.param(round.data[0]['id'])}`
                            }else {
                                const round = await axios.get(`http://0.0.0.0:5002/api/match/rounds/${match.data[0]["round4"]}`)
                                if (round.data[0]["status"] != "Finished") {
                                    await axios.get(`http://0.0.0.0:5002/api/match/rounds/${match.data[0]["round4"]}/outcome/${match.data[0]["player1"]}/${match.data[0]["player2"]}`)
                                }else {
                                    if (round.data[0]["winner"] == match.data[0]["player1"]){
                                        winsPlayer1 += 1
                                    }else {
                                        winsPlayer2 +=1
                                    }
                                    if (!match.data[0]["round5"]) {
                                        const round = await axios.post(`http://0.0.0.0:5002/api/match/createround`, "{'status' : 'Choosing' }")
                                        db.sql<s.matches.SQL, s.matches.Selectable[]>`UPDATE ${"matches"}
                                                      SET ${"round5"} = ${db.param(round.data[0]['id'])}`
                                    }else {
                                        const round = await axios.get(`http://0.0.0.0:5002/api/match/rounds/${match.data[0]["round5"]}`)
                                        if (round.data[0]["status"] != "Finished") {
                                            await axios.get(`http://0.0.0.0:5002/api/match/rounds/${match.data[0]["round5"]}/outcome/${match.data[0]["player1"]}/${match.data[0]["player2"]}`)
                                            const round = await axios.get(`http://0.0.0.0:5002/api/match/rounds/${match.data[0]["round5"]}`)
                                            if (round.data[0]["winner"] == match.data[0]["player1"]){
                                                winsPlayer1 += 1
                                            }else {
                                                winsPlayer2 +=1
                                            }
                                            if (winsPlayer1>winsPlayer2) {
                                                await axios.put(`http://0.0.0.0:5002/api/match/${match.data[0]['id']}`, `{'winner': ${match.data[0]['player1']}}`)
                                            }else{
                                                await axios.put(`http://0.0.0.0:5002/api/match/${match.data[0]['id']}`, `{'winner': ${match.data[0]['player2']}}`)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
export const updateMatch =
    async (request: FastifyRequest<{ Params: { id: string }; Body: { winner?: string, player2?: string } }>, reply: FastifyReply) => {
        const matchId = request.params.id;
        if (request.body.winner){
            await db.sql<s.matches.SQL, s.matches.Selectable[]>`UPDATE matches SET winner = ${db.param(request.body.winner)} WHERE id = ${db.param(matchId)}`
                .run(pool)
        }
        if (request.body.player2){
            await db.sql<s.matches.SQL, s.matches.Selectable[]>`UPDATE matches SET player2 = ${db.param(request.body.player2)} WHERE id = ${db.param(matchId)} AND player2 = NULL`
                .run(pool)
        }
    }