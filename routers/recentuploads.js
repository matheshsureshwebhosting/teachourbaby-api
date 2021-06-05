const firebase=require("../databases/firebase")
const router=require("express").Router()
const db=firebase.firestore()

router.get("/",async(req,res)=>{
    const {userid}=req.headers
    try {
        if(!userid) throw("Userid Not Founded")        
        db.collection("shuffled-ppt").orderBy("date", "desc").get().then((snap)=>{
            const data=[]
            snap.forEach((doc)=>{
                if(doc.data()!=undefined && doc.data().userid==userid){
                    data.push(doc.data())
                }
            })
           return res.send(data)
        })
    } catch (error) {
        return res.send(error)
    }
})

module.exports=router