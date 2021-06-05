const router = require("express").Router()
const firebase = require("../databases/firebase")
const db = firebase.firestore()

router.get("/", (req, res) => {
    const { userid } = req.headers
    try {
        if (!userid) throw ("Userid Required")
        db.collection("users").doc(userid).get().then((doc) => {
            if (doc.data() != undefined && doc.data().role != "user") {
                return res.send(true)
            } else {
                return res.send(false)
            }
        })
    } catch (error) {
        return res.send(error)
    }
})

router.get("/users", async (req, res) => {
    const { userid, admin } = req.headers
    try {
        if (!userid) throw ("Userid Required")
        if (!admin) throw ("Userid Required")
        db.collection("users").get().then(async (snap) => {
            const data = []
            await snap.forEach((doc) => {
                if (doc.data() != undefined) {
                    data.push(doc.data())
                    // db.collection("users").doc(doc.data().userid).collection("payments").doc(doc.data().userid).get().then((docs) => {                     
                    //     if (docs.data() != undefined) {
                    //         console.log(docs.data())
                    //         data.push({ "data": doc.data(), "payment": docs.data() })
                    //     }else{
                    //         data.push({ data: doc.data(), payment: null })
                    //     }
                    // })
                }
            })            
            return res.send(data)
        })
    } catch (error) {
        return res.send(error)
    }
})

router.get("/shuffledppt", async (req, res) => {
    const { userid, admin } = req.headers
    try {
        if (!userid) throw ("Userid Required")
        if (!admin) throw ("Userid Required")

        db.collection("remainder-ppt").orderBy("date", "desc").get().then(async (snap) => {
            const data = []
            await snap.forEach((doc) => {
                if (doc.data() != undefined) {
                    data.push(doc.data())
                }
            })
            console.log(data.length)
            return res.send(data)
        })
    } catch (error) {
        return res.send(error)
    }
})

router.get("/uploadedppt", async (req, res) => {
    const { userid, admin } = req.headers
    try {
        if (!userid) throw ("Userid Required")
        if (!admin) throw ("Userid Required")

        db.collection("shuffled-ppt").orderBy("date", "desc").get().then(async (snap) => {
            const data = []
            await snap.forEach((doc) => {
                if (doc.data() != undefined) {
                    data.push(doc.data())
                }
            })
            console.log(data.length)
            return res.send(data)
        })
    } catch (error) {
        return res.send(error)
    }
})

module.exports = router