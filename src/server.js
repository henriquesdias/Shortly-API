import usersRoutes from "./routes/users.js";

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const server = express();
server.use(express.json());
server.use(cors());
server.use(usersRoutes);

server.listen(process.env.PORT, () =>
  console.log(`Listening on port ${process.env.PORT}`)
);
