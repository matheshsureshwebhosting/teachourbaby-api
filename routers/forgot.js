const router = require('express').Router()
const firebase = require("../databases/firebase")
const db = firebase.firestore()

const forgot = require("../models/forgot")
var LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage('./scratch')

router.get("/", (req, res) => {
    return res.send("Forgot Page")
})


router.post("/", async (req, res) => {
    const { email } = req.body
    try {
        if (!email) throw ("Forgot Email ID Must")
        const forgotpwd = await forgot.forgotPwd(email)
        if (forgotpwd == false) throw ("OTP Not Send Try Again or Check email Id")
        localStorage.setItem("serverOTP", forgotpwd)
        localStorage.setItem("reqemail", email)
        console.log(forgotpwd)
        return res.send(true)
    } catch (error) {
        return res.send(error)
    }
})

router.post("/verify", async (req, res) => {
    const { email, OTP } = req.body    
    try {
        if (!email) throw ("Forgot Email ID Must")
        const serverOTP = localStorage.getItem("serverOTP")
        const reqemail = localStorage.getItem("reqemail")                
        if (Number(serverOTP) === Number(OTP) && reqemail === email) return res.send(true)
        return res.send("Incorrect OTP")
    } catch (error) {
        return res.send(error)
    }
})

module.exports = router