import mongoose from "mongoose";

const connection = {};

async function connect() {
   if (connection.isConnected) {
      return;
   }
   mongoose.set("strictQuery", false);
   const db = await mongoose.connect(process.env.MONGODB_URI)

   connection.isConnected = db.connections[0].readyState;
}

export default connect;