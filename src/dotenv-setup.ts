import { existsSync } from "fs";
import dotenv from "dotenv";

const dotEnvPaths = [
  `.env.${process.env.NODE_ENV}`,
  `.env.${process.env.NODE_ENV}.local`,
  ".env",
  ".env.local",
].filter((file) => existsSync(file));

dotenv.config({
  path: dotEnvPaths,
});
