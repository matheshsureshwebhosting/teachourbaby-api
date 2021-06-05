const express = require("express")
const dotenv = require('dotenv').config()
// const fileUpload = require("express-fileupload")
const morgan = require("morgan")
const cookie = require("cookie-parser")
const cors = require('cors')
const fs = require("fs")
var app = express()
var nodemailer = require('nodemailer');
const port = 4500 || process.env.PORT

var transporter = nodemailer.createTransport({
    host: "smtp.zoho.in",    
    secure: true,
    port: 465,
    auth: {
        user: "apply@flyfarcareers.com", 
        pass: "Bangalore@333", 
    },
    tls: {
        rejectUnauthorized: false
    }

  });



app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(morgan('dev'));

app.use(cookie())

app.use(cors({ origin: 'http://168.119.159.183:3000' })) //http://localhost:3000

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/test.html")
})

app.post("/images", async (req, res) => {
    const { images } = req.files
    images.forEach(async (data) => {
        console.log(data)
    })
    res.send(req.files)
})


const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + ".pptx")
    }
});


var upload = multer({ storage: storage });

app.post('/shuffle-ppt/uploadfile', upload.single('myFile'), async (req, res) => {
    const { shuffle } = req.body
    const file = req.file
    if (!file) {
        return res.send("Please upload a file")
    }

    //final 
    var numberofslides = 0;
    var getDocumentProperties = require('office-document-properties');
    var d3 = require('d3-array');
    await getDocumentProperties.fromFilePath(req.file.path, function (err, data) {
        if (err) throw err;
        numberofslides = data["slides"];

    });
    //final
    //checking presentation
    const PPTX = require('nodejs-pptx');
    let pptx = new PPTX.Composer();
    var getSlides = [];
    var getSlidesNumber = [];
    await pptx.load(req.file.path); // load a pre-existing PPTX  

    var finalspptxs = []
    const shuffleppt = new Promise(async (resolve, reject) => {
        for (var i = 0; i < Number(shuffle); i++) {
            await pptx.compose(async pres => {
                for (let i = 1; i <= numberofslides; i++) {

                    getSlidesNumber.push(i);
                }
                d3.shuffle(getSlidesNumber);
                console.log("True");

                for (let i = 1; i <= numberofslides; i++) {
                    let slide = pres.getSlide(i);
                    slide.moveTo(getSlidesNumber[i - 1]);
                }
            });
            const filenames = `${i}-${Date.now()}.pptx`
            const finalpath = `./download/${filenames}`

            await pptx.save(finalpath);
            // var finalpptx = fs.readFileSync(finalpath);
            // var encode_finalpptx = finalpptx.toString('base64');
            // var finalspptx = await {
            //     contentType: req.file.mimetype,
            //     name: filenames,
            //     pptx: new Buffer.from(encode_finalpptx, 'base64')
            // };
            // finalspptxs.push(encode_finalpptx)

            //    await fs.readFile(finalpath,'base64',(err,base64file)=>{               
            //      const dataUrl = `data:@file/vnd.ms-powerpoint;base64,${base64file}`              
            //      finalspptxs.push(dataUrl)
            //     })
            const base64file = await fs.readFileSync(finalpath, { encoding: 'base64' })
            const contentType = "data:@file/octet-stream;base64,"
            finalspptxs.push({
                file: contentType + base64file,
                filename: filenames
            })
        }
        await resolve(finalspptxs)
    })

    const shuffleppts = await shuffleppt
    res.send(shuffleppts)
});

app.post('/contact/send', async (req, res) => {
    const subject = req.body.subject
    const description = req.body.description
    
    console.log(subject);
    console.log(description);

    var mailOptions = {
        from: 'apply@flyfarcareers.com',
        to: 'matheshsureshofficial@gmail.com',
        subject: subject,
        text: description
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    });






app.use("/razorpay", require("./routers/razorpay"))
app.use("/profile", require("./routers/profile"))
app.use("/referral", require("./routers/referral"))
app.use("/forgot", require("./routers/forgot"))
app.use("/shuffle", require("./routers/shuffle"))
app.use("/recentuploads", require("./routers/recentuploads"))
app.use("/admin",require("./routers/admin"))

app.listen(port, () => { console.log(`App Running on http://localhost:${port}`) })