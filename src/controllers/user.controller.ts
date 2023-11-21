import { FastifyReply, FastifyRequest } from "fastify"
import { IUser } from "interfaces"

const staticUsers: IUser[] = [
  {
	id: 1,
	name: 'Joyce Byers'
  },
  {
	id: 2,
	name: 'Arnaud Parion'
  },
  {
	id: 3,
	name: 'Rory Maillard'
  },
]

export const listUsers = async (
 request: FastifyRequest, 
 reply: FastifyReply) => {

  Promise.resolve(staticUsers)
  .then((users) => {
	reply.send({ data: users })
  })
}

export const getUserById = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const userId = parseInt(request.params.id, 10); // Convertir l'ID en nombre entier
      const user = staticUsers.find((u) => u.id === userId);
  
      if (!user) {
        reply.code(404).send({ error: "Utilisateur non trouvé" });
        return;
      }
  
      reply.send({ data: user });
    } catch (error) {
      reply.code(500).send({ error: "Erreur serveur interne" });
    }
};
export const addUser = async (
    request: FastifyRequest<{ Body: { name: string } }>, // Mettez à jour cette ligne
    reply: FastifyReply
  ) => {
    try {
      const newUser: IUser = {
        id: staticUsers.length + 1,
        name: request.body.name,
      };
  
      staticUsers.push(newUser);
  
      reply.code(201).send({ data: newUser });
    } catch (error) {
      reply.code(500).send({ error: "Erreur serveur interne" });
    }
};

export const updateUserById = async (
    request: FastifyRequest<{ Params: { id: string }; Body: { score?: number } }>,
    reply: FastifyReply
  ) => {
    try {
      const userId = parseInt(request.params.id, 10);
      const userIndex = staticUsers.findIndex((u) => u.id === userId);
  
      if (userIndex === -1) {
        reply.code(404).send({ error: "Utilisateur non trouvé" });
        return;
      }
  
      // Mettez à jour l'utilisateur avec le nouveau score s'il est fourni dans le corps de la requête
      if (request.body.score !== undefined) {
        staticUsers[userIndex].score = request.body.score;
      }
  
      reply.send({ data: staticUsers[userIndex] });
    } catch (error) {
      reply.code(500).send({ error: "Erreur serveur interne" });
    }
};