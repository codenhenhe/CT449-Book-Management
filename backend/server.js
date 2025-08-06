import app from "./app.js";
import mongoose from "mongoose";
import config from "./app/config/index.js";

function startServer() {
  mongoose
    .connect(config.db.uri)
    .then(() => {
      console.log("Connected to the database!");

      const PORT = config.app.port;
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}.`);
      });
    })
    .catch((error) => {
      console.log("Cannot connect to the database!", error);
      process.exit();
    });
}

startServer();
