import mongoose from "mongoose";

export const connectDb = async ()=>{

try {
    const connect = await mongoose.connect(process.env.MONGOOSEDB_URL)
    console.log(`Database Connected ${ connect.connection.host}`)
} catch (error) {
    console.log(`Error while Connection DB: ${error}`)
    
}

}