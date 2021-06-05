const firebase = require("../databases/firebase")
const db = firebase.firestore()

module.exports.wallet = async (userid, data) => {
    console.log(userid, data)
    const getamount = await getAmount(userid)
    if (getamount == false) {
        console.log("create")
        const newacc = await newAcc(userid, data)
        if (newacc == false) return msg = "Payment Acc doesn't Created"
        return newacc
    } else {
        console.log("update")
        const updateacc = await updateAcc(userid, data, getamount)
        if (updateacc == false) return msg = "Payment Acc doesn't Updated"
        return updateacc
    }
}

getAmount = (userid) => {
    return getAmount = new Promise((resolve, reject) => {
        db.collection("users").doc(userid).collection("payments").doc(userid).get().then((doc) => {
            if (doc.data() == undefined) return resolve(false)
            return resolve(doc.data().amount)
        })
    })
}

newAcc = async (userid, data) => {
    return newAcc = new Promise(async(resolve, reject) => {
        db.collection("users").doc(userid).collection("payments").doc(userid).set(data).then(async() => {
            const acchistory=await accHistory(userid, data)
            if(!acchistory) return resolve("History Not Created")
            return resolve("New Payment Acc Created")
        }).catch((error) => {
            return resolve(false)
        })
    })
}

updateAcc = async (userid, data, getamount) => {
    const { razorpay_order_id, razorpay_signature, razorpay_payment_id, amount, plan, date } = data
    const finalamount = await Number(amount) + Number(getamount)
    return updateAcc = new Promise(async(resolve, reject) => {
        db.collection("users").doc(userid).collection("payments").doc(userid).update({
            razorpay_order_id: razorpay_order_id,
            razorpay_signature: razorpay_signature,
            razorpay_payment_id: razorpay_payment_id,
            plan: plan,
            userid: userid,
            amount: finalamount,
            date: date
        }).then(async() => {
            const acchistory=await accHistory(userid, data)
            if(!acchistory) return resolve("History Not Created")
            return resolve("New Payment Acc Updated")
        }).catch((error) => {
            return resolve(false)
        })
    })
}

accHistory = async (userid, data) => {
    const { amount, date, razorpay_payment_id } = data
    return accHistory = new Promise((resolve, reject) => {
        db.collection("users").doc(userid).collection("history").doc().set({
            razorpay_payment_id: razorpay_payment_id,
            amount: amount,
            date: date,
            userid: userid,
            status: "Success"
        }).then(() => {
            return resolve(true)
        }).catch((error) => {
            return resolve(false)
        })
    })
}