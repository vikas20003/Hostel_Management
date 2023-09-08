const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const _= require("lodash");
const flash = require('express-flash');
const session = require('express-session');
mongoose.connect('mongodb://127.0.0.1:27017/projectDB').then(function(){console.log("connected")});



const signupSchema=new mongoose.Schema({
  studentid:{
    type:Number,
    required:true
  },
  studentname:{
    type:String,
    required:true
  },
  contact:{
    type:Number,
    required:true
  },
  block:{
    type:String,
    required:true
  },
  room:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },email:{
    type:String,
    required:true
  }
});

const feesSchema=new mongoose.Schema({
    studentid:{
        type:Number,
        required:true
    },
    transactionid:{
        type:String,
        required:true
    },
    Note:{
        type:String,
    }
});

const newSchema=new mongoose.Schema({
    studentid:{
        type:Number,
        required:true
    },
    lostorfound:{
        type:String,
        required:true
    },
    Description:{
        type:String,
        required:true
    }
});

const registerSchema=new mongoose.Schema({
    studentid:{
        type:Number,
        required:true
    },
    contact:{
        type:Number,
        required:true
    },
    Room:{
        type:String,
        required:true
    },
    Date:{
        type:String,
        required:true
    },
    Reason:{
        type:String,
        required:true
    },
    OutTime:{
        type:String,
        required:true
    }

})

const registerSchema1=new mongoose.Schema({
    studentid:{
        type:Number,
        required:true
    },
    contact:{
        type:Number,
        required:true
    },
    Room:{
        type:String,
        required:true
    },
    Date:{
        type:String,
        required:true
    },
    InTime:{
        type:String,
        required:true
    }

});

const IssueSchema1=new mongoose.Schema({
    Studentid:{
        type:String,
        required:true
    },
    Room:{
        type:String,
        required:true
    },
     IssueType:{
        type:String,
        required:true
     },
     issue:{
        type:String,
        required:true
     },
     Note:{
        type:String,
        required:true
     },
     contact:{
        type:Number,
        required:true
     }
});



const signup=mongoose.model("signup",signupSchema);
const feesstatus=mongoose.model("fee",feesSchema);
const lot=mongoose.model("lot",newSchema);
const reg=mongoose.model("register",registerSchema);
const regin=mongoose.model("regin",registerSchema1);
const iss1=mongoose.model("iss12",IssueSchema1);

const app=express();

var Name='';
var std='';
var block='';
var room='';
var batch='';
var email1='';
var contact='';
var entry=false;
var issue='';

var currentDate = new Date();
var day = currentDate.getDate();
var month = currentDate.getMonth() + 1;
var year = currentDate.getFullYear();

var hours = currentDate.getHours();
var minutes = currentDate.getMinutes();
var seconds = currentDate.getSeconds();


var formattedDate = `${day}-${month}-${year}`;


var currentDateValue = formattedDate;
var currentTimeValue = `${hours}:${minutes}`;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
  }));
app.use(flash());

app.get('/',function(req,res){
  res.render('index');
});

app.get("/hostelsignup",function(req,res){
   res.render("HostelSignUp");
});

app.post('/login', function(req, res) {
    const email = req.body.email;
    const pass = req.body.password;
    if (email === "admin@gmail.com" && pass === "admin123") {
        res.redirect('/AdminDashboard');
    } else {
        signup.findOne({ email: email, password: pass }).then(function(founditems) {
            if (founditems) {
                 Name = _.startCase(_.camelCase(founditems.studentname));
                 std = founditems.studentid;
                 block = founditems.block;
                 room = founditems.room;
                 email1 = email;
                contact = founditems.contact;
                res.redirect("/Dashboard");
            } else {
                res.status(401).send("Invalid email or password");
            }
        }).catch(function(error) {
            
            console.error(error);
            res.redirect('/HostelSignUp');
        });
    }
});


app.get('/login',function(req,res){
    res.render('index');
})
app.get('/dashboard',function(req,res){
    res.render('Dashboard',{Name:Name});
})

app.get('/elec',function(req,res){
    res.render('Elec');
});
app.get('/fees',function(req,res){
    res.render('Fees');
});
app.get('/wat',function(req,res){
    res.render('WatIss');
});
app.get("/AdminDashboard",function(req,res){
     res.render("AdminDashboard");
});
app.get('/register',function(req,res){
    if(!entry){
   const room1=block+"-"+room;
    res.render('Register',{Name:Name,Contact:contact,Room:room1,Date1:currentDateValue,Time:currentTimeValue});
    entry=true;
    }else{
        res.render('RegisterIn',{Name:Name,Contact:contact,Room:room,Date1:currentDateValue,Time:currentTimeValue});
        entry=false;
    }
});
app.get('/lost',function(req,res){
    res.render('Lostfound');
});
app.get('/profile',function(req,res){

    res.render('profile',{Name:Name,Email:email1,Block:block,Std:std,Room:room,Contact:contact});
});

app.post("/signup",function(req,res){
    var stid=req.body.stid;
    signup.findOne({studentid:stid}).then(function(founditems){
     if(!founditems){
        const item=new signup({
            studentid:stid,
            studentname:req.body.stname,
            contact:req.body.contact,
            block:req.body.blockno,
            room:req.body.roomno,
            password:req.body.pass,
            email:req.body.email
           });
           item.save();
           res.redirect('/');
     }else{
       res.redirect('/');
     }
    });
   
});

app.post('/fees',function(req,res){
    const newitem=new feesstatus({
        studentid:std,
        transactionid:req.body.tid,
        Note:req.body.note
    });
    newitem.save();
    res.redirect("/dashboard");
});

app.post("/lost",function(req,res){
   const newitem=new lot({
    studentid:std,
    lostorfound:req.body.lot,
    Description:req.body.des
   });
   newitem.save();
   res.redirect("/dashboard");
});

app.post("/register",function(req,res){
    const newitem=new reg({
        studentid:std,
        contact:contact,
        Room:room,
        Date:currentDateValue,
        Reason:req.body.reason,
        OutTime:currentTimeValue,
        
    });
    newitem.save();
    res.redirect("/dashboard");
});

app.post("/registerin",function(req,res){
    const newitem=new regin({
        studentid:std,
        contact:contact,
        Room:block+" "+room,
        Date:currentDateValue,
        InTime:currentTimeValue
    }) 
    newitem.save();
    res.redirect("/dashboard");
});

app.post('/elec',function(req,res){
    issue='Electrical Issue'
    const newitem=new iss1({
        Studentid:std,
        Room:block+"-"+room,
       IssueType:issue,
       issue:req.body.issue,
       Note:req.body.note,
       contact:contact
    });
    newitem.save();
    res.redirect("/dashboard");
});


app.post('/water',function(req,res){
    issue='Water Issue'
    const newitem=new iss1({
        Studentid:std,
        Room:room,
       IssueType:issue,
       issue:req.body.issue,
       Note:req.body.note,
       contact:contact
    });
    newitem.save();
    res.redirect("/dashboard");
});

app.get('/profile1', function(req, res) {
    
    signup.find({}).then(function(students){
        res.render('profile1', { students: students });
    }).catch(function(err){
        console.log(err);
    })
});

app.get('/elec1', function(req, res) {
    iss1.find({  IssueType :'Electrical Issue' }).then(function(students) {
        res.render('elec1', { students: students });
    }).catch(function(err) {
        console.log(err);
    });
});

app.get('/wat1',function(req,res){
    iss1.find({ IssueType:"Water Issue"}).then(function(students){
       res.render('wat1',{students:students});
    }).catch(function(err){
        console.log(err);
    });
});

app.get("/lofo1",function(req,res){
  lot.find({}).then(function(students){
    res.render("lofo1",{students:students});
  }).catch(function(err){
    console.log(err);
  });
});


app.get('/fees1',function(req,res){
    feesstatus.find({}).then(function(students){
        res.render('fees1',{students:students});
    }).catch(function(err){
        console.log(err);
    });
});

app.get("/register1",function(req,res){
    reg.find({}).then(function(students){
        res.render("register1",{students:students});
    }).catch(function(err){
        console.log(err);
    });
});


app.listen(3000,function(){
    console.log("Server Connected at 3000");
});
