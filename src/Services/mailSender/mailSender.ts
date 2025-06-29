import nodemailer from 'nodemailer';
import { mailData } from '../../globalConfig/interface';

const sendMail = async (data:mailData)=>{
    const transporter = nodemailer.createTransport({
        service:"gmail",
    auth:{
        user:"saugatgiri1070@gmail.com",
        pass:"ntzookwzoutlzkrj"
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