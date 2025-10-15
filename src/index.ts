import express from "express";
import cors from "cors";
import { createApolloGraphqlServer } from "./graphql";
import { expressMiddleware } from "@as-integrations/express5";



async function startGraphQLServer() {
  const app = express();
  const PORT = process.env.PORT || 8000;
  // Start apollo graphQL server

  const gqlServer = await createApolloGraphqlServer();

  app.use(
    "/graphql",
    cors(),
    express.json(),
    expressMiddleware(gqlServer)
  );

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

startGraphQLServer()
  .catch((error) => {
    console.error("Failed to start the server:", error);
    process.exit(1);
  });