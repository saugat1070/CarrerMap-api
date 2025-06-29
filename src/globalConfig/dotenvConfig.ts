import dotenv from 'dotenv';
dotenv.config();

export const envConfig = {
    portNumber : process.env.PORT_NUMBER,
    dbUrl : process.env.DB_URL as string,
    email_password: process.env.EMAIL_PASSWORD as string,
    email: process.env.USER_EMAIL as string
}