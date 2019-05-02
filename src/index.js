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
    password: Sequelize.STRING,
    driver: Sequelize.BOOLEAN,
    carMake: Sequelize.STRING,
    carModel: Sequelize.STRING,
    carYear: Sequelize.INTEGER
  });

app.get("/createTable", (req, res) => {
    emailModel.sync({
        force: true
    }).then(() => {
    res.send("Table created successfully");
  }).catch((error) => {
    res.send(error);
  })
});

//get returns email and phone number given first & last name 
app.get('/getData', function(req, res){
    emailModel.findOne({
        where:{
            //change to email
            firstName: req.params.firstName,
            lastName: req.params.lastName
        },
        attributes:{
            include:["email", "password"],
            exclude:["firstName", "lastName", "id", "createdAt", "updatedAt"]
      }
    }).then(user =>{
        res.send(user);
    })
 });
 
 //post a user to database
 app.post('/createAccount', function(req, res){
    let email = req.body.email;
    let fName =req.body.firstName;
    let lName = req.body.lastName;
    let pass = req.body.password;

    //check if any attributes are null

    if(email && fName && lName && pass){
    
        //check if valid email
        if(email.substring(email.length-9, email.length) != "@sjsu.edu"){
            res.send("Invalid email")
        }
        //check password is at least 8 long and has one lowercase, uppercase,number and special char
        let passVer= true;
        let strong = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
        if(!(strong.test(pass)))
            passVer = false;
        if(!passVer){
            res.send("Invalid password")
        }
        //if  password and email is valid create new emailModel
        else{
            email = email.substring(0, email.length-9).replace(".", "") + email.substring(email.length-9, email.length);
            for(let i=0; i< email.length-9; i++){
                if(email.charAt(i) == '+'){
                    email = email.substring(0,i) + email.substring(email.length-9, email.length);
                break;
                }
            }
            emailModel.findOrCreate({
                where:{
                    email: email
                },
                defaults:{    
                    firstName: fName,
                    lastName: lName,
                    email: email,
                    password: pass,
                    driver: false,
                    carMake: null,
                    carModel: null,
                    carYear: null
                }
            }).then((result) => {
                res.send(result);
            });
        }
    }
    else
        res.send("Error");
});

//returns boolean, true if email  exists & license is valid, false otherwise
app.post("/driverVerification", (req, res) => {
    let license = req.licenseNumber

    //see if email exists
    emailModel.findOne({
        where: {
            email: req.body.email
        }
    }).then(result => {
        if(result){
            //check if license is valid (change this later)
            let valid = true;
            if(valid){
                result.driver = true;
                result.carMake = req.body.carMake;
                result.carModel = req.body.carModel;
                result.carYear = req.body.carYear;
                res.send(true);
            }
            else
                res.send(false)
        }
            else
                res.send(false)
        })
    
})

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

//stripe 
require('dotenv').config();
const keyPublishable = process.env.STRIPE_PUBLIC;
const stripe = require('stripe')(process.env.STRIPE_SECRET);

app.post('/charge', (req, res, next) => {

  const token = req.body.stripeToken;
  
  stripe.customers.create({
      //email: req.body.email,
      source: token
  })
  .then(customer => 
  
  stripe.charges.create({
    amount: 500,
    currency: 'usd',
    customer: customer.id,
    description: 'carpool',
  }))
  .then(charge => res.send('Thank you')
  ).catch(error  => {
    res.send(error); 
  });
});

app.listen(3000);