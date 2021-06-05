const router = require("express").Router()
const firebase = require("../databases/firebase")
const db = firebase.firestore()
router.get("/",async (req, res) => {
    const { userid } = req.headers
    try {
        if (!userid) throw ("Userid Not Founded")
      await  db.collection("users").doc(userid).collection("profile").doc(userid).get().then((doc) => {
            if (doc.data() == undefined) return res.send("Data Not Founded")
            return res.send(doc.data())
        })
    } catch (error) {
        res.status(410).send(error)
    }
})

router.post("/create",async (req,res)=>{
    const { userid } = req.headers
    try {
        if (!userid) throw ("Userid Not Founded")
       await db.collection("users").doc(userid).collection("profile").doc(userid).set(req.body).then(()=>{
            return res.send("Profile Created")
        }).catch((error)=>{
            return res.send("Can't Create Profile Please Try Again!")
        })
    } catch (error) {
        res.status(410).send(error)
    }
})


module.exports = router