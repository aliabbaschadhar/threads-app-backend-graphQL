import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";

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
    `,
    resolvers: {
      Query: {
        hello: (_, { name }: { name: string }) => `Hor vai ${name} ki hal chal a ...`,
        sayBapaStunning: () => "No bro mai teri tara Narak mai nai jana o murshad ne mere"
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