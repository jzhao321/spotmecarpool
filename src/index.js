import http from "http";
import express from "express";
import Sequelize from "sequelize"
import pg from "pg";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
pg.defaults.ssl = true;


const seq = new Sequelize("postgres://bmsnyakizhvtiv:9ca4b6e65fd79862767d73971fdbf0da9d1de25422281b63e8a7ca8214e72c9b@ec2-54-163-234-88.compute-1.amazonaws.com:5432/delahu46rivvsb",{
    ssl:true
});

const emailModel = seq.define("registrations", {
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    phoneNumber: Sequelize.BIGINT,
    password: Sequelize.STRING,
  });

app.get("/createTable", (req, res) => {
    emailModel.sync().then(() => {
    res.send("Table created successfully");
  }).catch((error) => {
    res.send(error);
  })
});

//get returns email and phone number given first & last name 
app.get('/getData', function(req, res){
    emailModel.findOne({
        where:{
            firstName: req.params.firstName,
            lastName: req.params.lastName
        },
        attributes:{
            include:["email", "phoneNumber", "password"],
            exclude:["firstName", "lastName", "id", "createdAt", "updatedAt"]
      }
    }).then(user =>{
        res.send(user);
    })
 });
 
 //post a user to database
 app.post('/createAccount', function(req, res){
    let email = req.body.email;
    let phone = req.body.phoneNumber;
    let fName =req.body.firstName;
    let lName = req.body.lastName;
    let pass = req.body.password;

    //check if any attributes are null

    if(email && fName && lName && phone && pass){
    //check if valid phone number
        if(phone.length != 10  || (!typeof phone === 'bigint')){
            res.send("Invalid phone number")
        }
        //check if valid email
        else if(email.substring(email.length-9, email.length) != "@sjsu.edu"){
            res.send("Invalid email")
        }
        //if both phone number and email are valid create new emailModel
        else{
            emailModel.findOrCreate({
                where:{
                    email: email
                },
                defaults:{    
                    firstName: fName,
                    lastName: lName,
                    email: email,
                    phoneNumber: phone,
                    password: pass,
                }
            }).then((result) => {
                res.send(result);
            });
        }
    }
    else
        res.send("Error");
});


app.post("/loginValidation", (req, res) => {
	emailModel.findOne({
    where: {
      email: req.body.email
    }
  }).then(result => {
    if(result){
      
      if(req.body.password === result.password){
        res.send("Successfully logged in");
      }
      
      else{
        res.send("Error Logging In");
      }
      
    }
    else{
      res.send("Error Logging In")
    }
    
  })
})

app.listen(3000);