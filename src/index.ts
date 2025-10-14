import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { prismaClient } from "./db/lib";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}


async function startGraphQLServer() {
  const app = express();
  const PORT = process.env.PORT || 8000;
  // Start apollo graphQL server
  const gqlServer = new ApolloServer({
    // Schema
    typeDefs: `#graphql 
      type Query{
        hello(name: String): String!
        sayBapaStunning: String!
      }

      type Mutation {
        createUser(
          firstName: String!,
          lastName: String!,
          email: String!,
          password: String!,
        ) : Boolean
      }
    `,
    resolvers: {
      Query: {
        hello: (_, { name }: { name: string }) => `Hor vai ${name} ki hal chal a ...`,
        sayBapaStunning: () => "No bro mai teri tara Narak mai nai jana o murshad ne mere"
      },
      Mutation: {
        createUser: async (_, { firstName, lastName, email, password }: User) => {
          await prismaClient.user.create({
            data: {
              firstName, lastName, email, password, salt: "random-salt"
            }
          }
          )
          return true;
        }
      }
    }
  });


  app.get("/health", (req, res) => {
    res.status(200).send("OK");
  });


  await gqlServer.start();

  app.use("/graphql", cors(), express.json(), expressMiddleware(gqlServer));
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

startGraphQLServer()
  .catch((error) => {
    console.error("Failed to start the server:", error);
    process.exit(1);
  });