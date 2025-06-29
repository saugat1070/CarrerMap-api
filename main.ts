import express from 'express';
import { envConfig } from './src/globalConfig/dotenvConfig';
import { dbConnection } from './src/globalConfig/dbConnection';
import userRouth from './src/Routes/AuthRoute/userRoute';
const app = express();
app.use(express.json());

// Database Connection
dbConnection()
//router
app.use("/api/user",userRouth);


const portNumber = envConfig.portNumber || 8000
app.listen(portNumber,()=>{
    console.log(`server is running at port:${portNumber}`)
})
