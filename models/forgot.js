const firebase = require("../databases/firebase")
const nodemailer = require("nodemailer")
const db = firebase.firestore()

const random = require("../helpers/randomid")


var smtpTransport = nodemailer.createTransport({
    host:process.env.HOST,
    secure: process.env.SECURE,
    port: process.env.PORT,
    auth: {
        user: process.env.USER, // generated ethereal user  marketingclientsofms@gmail.com
        pass:process.env.PASS, // generated ethereal password  Bangalore@333
    },
    tls: {
        rejectUnauthorized: false
    }
});
// var smtpTransport = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: "marketingclientsofms@gmail.com", // generated ethereal user  marketingclientsofms@gmail.com
//         pass: "Bangalore@333", // generated ethereal password  Bangalore@333s
//     },
//     tls: {
//         rejectUnauthorized: false
//     }
// });

module.exports.forgotPwd = async ( email) => {
    const checkemail = await checkEmail(email)
    if (checkemail != email) return checkemail    
    const OTP = await random.randomNo()
    const sendemail = await sendEamil(OTP, checkemail)
    console.log(sendemail)
     if(sendemail==false) return sendemail
     return sendemail
}



checkEmail = async (email) => {    
    return checkEmail = new Promise(async (resolve, reject) => {
        db.collection("users").where("email","==",email).get().then((snap) => {
            const data=[]
            snap.forEach((doc)=>{              
                data.push(doc.data())
            })      
            console.log(data.length)      
            if (data.length==0) return resolve(false)            
            if (data[0].email != email) return resolve(false)
            return resolve(data[0].email)
        })
    })
}

sendEamil = async (OTP, email) => {
    return sendEamil = new Promise((resolve, reject) => {
        mailOptions = {
            from: 'notification@merchantox.com',
            to: email,
            subject: "Account Verification",
            text: "Hello world?",
            html: `Your OTP is  ${OTP}`
        }        
        smtpTransport.sendMail(mailOptions, function (error, response) {
         if(error) return resolve(false)         
         return resolve(OTP)
        });
    })

}