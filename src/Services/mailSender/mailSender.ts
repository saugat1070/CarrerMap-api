import nodemailer from 'nodemailer';
import { mailData } from '../../globalConfig/interface';
import { envConfig } from '../../globalConfig/dotenvConfig';
const sendMail = async (data:mailData)=>{
    const transporter = nodemailer.createTransport({
        service:"gmail",
    auth:{
        user:envConfig.email,
        pass:envConfig.email_password
    }
})
try {
     await transporter.sendMail(data).then(()=>{
        console.log("email is sended");
     });
} catch (error) {
    console.log(error)
    
}

}

export default sendMail;