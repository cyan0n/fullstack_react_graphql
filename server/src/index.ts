import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { COOKIE_NAME, __prod__ } from "./config";
import mikroConfig from "./mikro-orm.config";
import express, { Application } from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { AppContext } from "./types";
import cors from "cors";

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): AppContext => ({ em: orm.em, req, res }),
  });

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
  initSession(app);

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(4000, () => {
    console.log("server started on http://localhost:4000");
  });
};

function initSession(app: Application) {
  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  app.use(
    session({
      name: COOKIE_NAME,
      saveUninitialized: false,
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 3600 * 24 * 365.25 * 10, // 10 years
        httpOnly: true,
        sameSite: "lax", // csrf
        secure: __prod__, // HTTPS
      },
      secret: "dubito ergo cogito",
      resave: false,
    })
  );
}

main().catch(console.error);
