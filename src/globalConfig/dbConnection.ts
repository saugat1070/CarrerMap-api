import mongoose from 'mongoose';
import { envConfig } from './dotenvConfig';
export const dbConnection = async () => {
    try {
         await mongoose.connect(envConfig.dbUrl).then(()=>{
            console.log("Database is connected successfull");
         }).catch((err:any)=>console.log("issue"+err?.message))
        
    } catch (error:any) {
        console.log("Database connection due to server");
    }
}