const router = require("express").Router()
const firebase = require("../databases/firebase")
const db = firebase.firestore()



const randomId = require("../helpers/randomid")

router.get("/", (req, res) => {
    return res.send("Shuffled PPTS")
})
router.post("/send", async (req, res) => {
    const { userid } = req.headers
    const { category, description, shuffle, shuffled_ppt,original_ppt } = req.body.pptdatas    
    try {
        if (!userid) throw ("Userid Not Founded")
        var date = new Date();
        var cdate = date.toLocaleString('en-US', { hour12: true })
        const docid = await randomId.Uuids()
        const pptdatas = await {
            category: category,
            description: description,
            shuffle: shuffle,
            shuffled_ppt: shuffled_ppt,
            original_ppt:original_ppt,
            date: cdate,
            userid: userid,
            docid: docid
        }
        await db.collection("shuffled-ppt").doc(docid).set(pptdatas).then(async () => {
            var date = new Date();
            for (var i = 0; i < shuffled_ppt.length; i++) {
                const shuffled_ppts = shuffled_ppt[i]
                const months = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
                const remainder = (date.getDate() + i) + "-" + (months[date.getMonth() + 1]) + "-" + date.getFullYear()
                const remainderpptdatas = await {
                    category: category,
                    description: description,
                    shuffle: shuffle,
                    shuffled_ppt: shuffled_ppts,
                    original_ppt:original_ppt,
                    date: cdate,
                    remainder: remainder,
                    userid: userid,
                    docid: docid
                }
                db.collection("remainder-ppt").doc().set(remainderpptdatas).then(() => {
                    console.log("remainder ppts")
                })
            }
            return res.send(docid)
        }).catch((error) => {
            console.log(error)
            return res.send("PPT Not Upload")
        })
    } catch (error) {
        return res.send(error)
    }
})
module.exports = router