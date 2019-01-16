//Imports Dependencies
import express from "express";
import path from "path";
import pg from "pg";
import cors from "cors";


//Set PostGres defualt options
pg.defaults.ssl = true;

//Declare application variable for express
var app = express();

try{
    console.log(require.resolve("morgan"));
    console.log("Development Mode Activated");
    app.use(require("morgan")("dev"));
}
catch(e){
}


//Enables Cross Origin Requests (CORS) support
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//app.use(require("morgan")("dev")); //Logger for Web
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

//ONLY IN DEVELOPMENT NOT TO BE IN FINAL PRODUCT
import debug from "./debug"
app.use("/debug", debug);

//Production Endpoints
import garages from "./garages";
app.use("/garages", garages);

app.get("/", (req, res) => {
    res.send("Spotme API running");
})


// catch 404 and forward to error handler
app.use((req, res, next) => {
    res.status(404);
    res.send("404 File Not Found");
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


export default app;
