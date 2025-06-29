import mongoose from 'mongoose';
import { envConfig } from './dotenvConfig';
export const dbConnection = async ()=>{
    await mongoose.connect(envConfig.dbUrl).then(()=>{
        console.log("Database Connection successfully");
    }).catch(()=>{
        console.log("Database connection failed");
    })
}