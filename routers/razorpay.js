const router = require("express").Router()
const Razorpay = require('razorpay')
const firebase = require("../databases/firebase")
const db = firebase.firestore()

const razorpay = require("../models/razorpay")

let instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID_TEST,
    key_secret: process.env.RAZORPAY_SECRET_TEST
})

router.post("/pay", async (req, res) => {
    const { amount, plan } = req.body
    const { userid } = req.headers
    try {
        const amounts = [50, 150, 250]
        if (!userid) throw ("Userid Not Founded")
        const amountCheck = await amounts.includes(amount)
        if (!amountCheck) throw ("Invalid Amount")
        var params = await {
            amount: amount * 100,
            currency: "INR",
            receipt: "su001",
            payment_capture: '1'
        };
        await instance.orders.create(params).then((data) => {
            res.send({ "sub": data, "status": "success" });
        }).catch((error) => {
            res.send({ "sub": error, "status": "failed" });
        })
    } catch (error) {
        return res.status(401).send(error)
    }

})

router.post("/send", async (req, res) => {
    const { userid } = req.headers
    try {
        if (!userid) throw ("Userid Not Founded")
        const wallet = await razorpay.wallet(userid, req.body)
        return res.send(wallet)
    } catch (error) {
        return res.status(401).send(error)
    }

})

router.get("/", (req, res) => {
    const { userid } = req.headers
    console.log(userid)
    try {
        if (!userid) throw ("Userid Not Founded")
        db.collection("users").doc(userid).collection("payments").doc(userid).get().then((doc) => {
            if (doc.data() == undefined) return res.send(false)
            return res.send(doc.data())
        })
    } catch (error) {
        return res.status(401).send(error)
    }
})

module.exports = router
