const nodemailer = require('nodemailer')
if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

class Mailer {
    constructor(name,email){
        this.name = name
        this.email = email
        this.transport = nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:'vaultbankingapp@gmail.com',
                pass:process.env.GMAIL_PASSWORD
            }
        })
    }
    static sent = []
    sendInvite(to){
        const email = {
            from: this.email,
            to: to,
            subject: `${this.name} would like you to join us on vault`,
            html:`<div style='background: linear-gradient(to top, #FAD0C4 0%, #FFD1FF 100%);'><div style ='width: 75%;margin:auto;padding: 30px;' >hey there, <br/><br/> ${this.name} would like you to join us at vault! vault is a revolutionary new banking app wherre you can easily send money to your friends at the click of a button! Just create an account and you'll be ready to go in no time!<br/><br/> we look forward to meeting your banking needs<br/><br/><a  href="${process.env.BASE_URL}/login">sign up</a><br/><br/>the vault team</div></div>`,
            replyTo: "no-reply@vault-bank.com",
        }
        this.transport.sendMail(email,(err,result)=>{
            Mailer.sent.push(err||result)
        })
    }
}

module.exports=Mailer
