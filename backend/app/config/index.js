import dotenv from "dotenv";
dotenv.config();

const config = {
  app: {
    port: process.env.PORT || 3000,
  },
  db: {
    uri: process.env.MONGO_URL || "mongodb://127.0.0.1:27017/bookmanagement",
  },
};

export default config;
