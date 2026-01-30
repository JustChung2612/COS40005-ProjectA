import 'dotenv/config';
import mongoose from "mongoose";


// Local
export const connectDB_local = async () => {
    try{

        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch(error) {
        console.log("Error connecting to MONGODB", error.message);
    }
}

// Cloud

// Use Try-Catch

// export const connectDB_atlas = async () => {
//     try {
//         // Connect to the MongoDB cluster/ server
//         const conn =  await mongoose.connect(process.env.MONGO_URI);
//         console.log("Mongo DB Atlas connect sucessfully!")
        
//     } catch (e) {
//         console.error(e);
//     } finally {
//         await client.close(); // finally() is option but not if push to internet -> remove finally
//     }
// }


// Use Then() Catch()
export const connectDB_atlas  = () => {
    const conn = mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log("Mongo DB Atlas connect sucessfully!")
        })
        .catch((error) => {
            console.error("❌ Error connecting to MongoDB:", error.message);
        })
}