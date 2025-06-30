import jwt from 'jsonwebtoken'
import { envConfig } from '../globalConfig/dotenvConfig'
export const tokenGen = (userId:any)=>{
    const token = jwt.sign({
        userId:userId
    },envConfig.json_secret_key,{
        expiresIn:"20d"
    });
    return token;
}
