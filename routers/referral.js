const router = require('express').Router()
const firebase = require("../databases/firebase")
const db = firebase.firestore()

const randomid = require("../helpers/randomid")
const referal = require("../models/referral")

router.post("/create", async (req, res) => {
    const { userid } = req.headers
    try {
        if (!userid) throw ("Userid Not Founded")
        const refferalId = await randomid.randomId()
        db.collection("users").doc(userid).get().then(async (doc) => {
            if (doc.data().name == undefined) return res.send("Users Data Not Founded")
            if(doc.data().referralUrl !=undefined) return res.send(doc.data().referralUrl)
            const name = doc.data().name
            const referralUrl = `https://rightbrain.com/referral/${name}/${refferalId}`
            const setReferral = await referal.setReferral(userid, refferalId, referralUrl)
            if (!setReferral) return res.send(setReferral)
            return res.send(referralUrl)
        })
    } catch (error) {
        return res.send(error)
    }
})

router.get("/:referralname/:referralid", async (req, res) => {
    const { userid } = req.headers
    const { referralname, referralid } = req.params
    console.log(referralname, referralid)
    try {
        if (!userid) throw ("Userid Not Founded")
        const checkreferral = await referal.checkReferral(referralname, referralid, userid)
        return res.send(checkreferral)
    } catch (error) {
        return res.send(error)
    }
})

router.get("/show", async (req, res) => {
    const { userid } = req.headers
    try {
        if (!userid) throw ("Userid Not Founded")
        db.collection("users").doc(userid).collection("referrals").get().then((snap)=>{
            const data=[]
            snap.forEach((doc)=>{
                data.push(doc.data())
            })
            return res.send(data)
        })
    } catch (error) {
        return res.send(error)
    }
})

module.exports = router