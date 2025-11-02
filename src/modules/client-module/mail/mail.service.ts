import { Logger } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import configuration from "src/libs/configuration";
import { resetPasswordTemplate } from "./templates/reset-password";
import { SystemUsers } from "src/shared/enum/users.enum";
import { welcomeTemplate } from "./templates/welcomeTemplate";

const config = configuration()
export class MailService{
    private readonly transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
    private readonly logger = new Logger(MailService.name)

    constructor(){
        const transportOptions : SMTPTransport.Options ={
            host: config.mail.host,
            port: config.mail.port,
            secure: false,
            auth:{
                user: config.mail.user,
                pass: config.mail.pass
            },
             tls: {
    rejectUnauthorized: false,
  },
        }

        this.transporter = nodemailer.createTransport(transportOptions)
    }


    async sendResetPasswordMail(to: string, fullName: string, resetUrl: string){
try{
    const html = resetPasswordTemplate({fullName, resetUrl})
    await this.transporter.sendMail({
        from: config.mail.from,
        to,
        subject:"Reset your password - RentLink",
        html
    })

    this.logger.log(`Email sent to ${to}`)

}catch (error){
 this.logger.log(`Message failed to send to ${to}: ${error.message}`)
 throw error;
}
    };

    async sendWelcomeMail(to: string, fullName: string, role: 'landlord' | 'tenant' | 'admin'){
        try{

            const html= welcomeTemplate({fullName, role});
            
            const subjectMap= {
                landlord: 'Welcome to RentLink — Start listing your properties!',
                tenant: 'Welcome to RentLink — Find your next home easily!',
                admin: 'Your RentLink Admin Access Has Been Granted', 
            }

            await this.transporter.sendMail({
                from:config.mail.from,
                to,
                subject: subjectMap[role],
                html
            })

            this.logger.log(`Email sent to ${to}`)
        }catch(error){
             this.logger.log(`Message failed to send to ${to}: ${error.message}`)
 throw error;
        }
    }
}