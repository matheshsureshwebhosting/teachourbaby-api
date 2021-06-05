const firebase = require("../databases/firebase")
const db = firebase.firestore()
module.exports.setReferral = async (userid, refferalId, referralUrl) => {
    return setReferral = new Promise(async (resolve, reject) => {
        await db.collection("users").doc(userid).update({
            refferalId: refferalId,
            referralUrl: referralUrl
        }).then(() => {
            return resolve(true)
        }).catch((error) => {
            return resolve("Can't Set Referral in DB")
        })
    })
}

module.exports.checkReferral = async (referralname, referralid, userid) => {
    const check = await checkreferral(referralname, referralid)
    if (!check) return checks = "Referral Id In-valid"
    const createreferralacc = await createReferralacc(userid, check)
    return createreferralacc
}

checkreferral = async (referralname, referralid) => {
    return checkreferral = new Promise(async (resolve, reject) => {
        db.collection("users").where("refferalId", "==", referralid).get().then((snap) => {
            const data = []
            snap.forEach((doc) => {
                data.push(doc.data())
            })
            if (data.length == 0) return resolve(false)
            return resolve(data[0].userid)
        })
    })
}

createReferralacc = async (userid, refUserid) => {
    return createReferralacc = new Promise(async (resolve, reject) => {
        var date = new Date();
        var cdate = date.toLocaleString('en-US', { hour12: true })
        const getname = await getName(userid)
        if (!getname) return resolve("Client Data Not Founded")
        db.collection("users").doc(refUserid).collection("referrals").doc(userid).set({
            userid: userid,
            name: getname,
            date: cdate
        }).then(() => {
            return resolve("Referral Updated")
        }).catch(() => {
            return resolve("Referral Can't Updated")
        })
    })
}

getName = (userid) => {
    return getName = new Promise((resolve, reject) => {
        db.collection("users").doc(userid).get().then((doc) => {
            if (doc.data() == undefined) return resolve(false)
            return resolve(doc.data().name)
        })
    })
}