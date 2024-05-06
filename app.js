if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
    // console.log(process.env);
}
const Listing = require("./models/listing.js");
const express= require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate = require('ejs-mate'); //ejs-mate
const ExpressError = require("./utils/ExpressError.js");      //require custom ExpressError.js class
const session=require("express-session");     //express-session for cookies
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");        //flash msg
const passport=require("passport");          //authentication
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");


const listingsRouter=require("./routes/listing.js");// for routes require
const reviewsRouter=require("./routes/review.js");  //for routes require
const userRouter=require("./routes/user.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const dbUrl=process.env.ATLASDB_URL;

async function main(){
    await mongoose.connect(dbUrl);
    // await mongoose.connect(MONGO_URL)
    console.log("connection successful");
}

main().then((res)=>{
    console.log("mongodb")
}).catch((err)=>{
    console.log(err);
})

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);     //ejs-mate
app.use(express.static(path.join(__dirname,"/public")));

const store=MongoStore.create({
    mongoUrl:dbUrl,
    // mongoUrl:MONGO_URL,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600,
});
store.on("error",()=>{
    console.log("ERROR in mongo session store", err)
})
const sessionOptions={
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,  //in milisecond used to set expires of cookies time
        maxAge:7*24*60*60*1000,              //in milisecond
        httpOnly:true
    }
};

app.use(session(sessionOptions));         //we need session for implementing passport or localStrategy
app.use(flash());

app.use(passport.initialize());            // these five line always writen when we use passport
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());      // use static serialize and deserialize
passport.deserializeUser(User.deserializeUser());   // of model for passport session support

app.use((req,res,next)=>{                         //send flash message using res.locals
    res.locals.success=req.flash("success");      //res.locals.var  variable direct access in ejs
    res.locals.error=req.flash("error");
    res.locals.curUser=req.user;
    next();
});

app.get("/",async(req,res)=>{
    let allListings= await Listing.find();
    res.render("listings/index.ejs",{allListings});
})
/////// routes use for remove common path like listings//////////////
//using routes listing.js .. for remove common path /listings
   app.use("/listings",listingsRouter);
// using routes review.js .. for remove common path /listings/:id/reviews
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);          //user register and login


//Custom ExpressError////////////////////////////////
app.all("*",(req,res,next)=>{
 next(new ExpressError(404,"page not found"));
});
// Error Handling middleware //////////////////////
app.use((err,req,res,next)=>{
    let{status=401,message="somthing went wrong"}=err;
    res.status(status).render("error.ejs",{message});
    // res.status(status).send(message);
});

app.listen(8080,()=>{
    console.log("server listining");
});

//these are unuse because of routes 
// which part of code is some blur type it means that part is not use in that file it 
// const Listing=require("./models/listing.js");
// const Review=require("./models/review.js");
// const wrapAsync=require("./utils/wrapAsync.js");
// const schemaValidate=require("./schemaerror/schema.js");
// const reviewValidate=require("./schemaerror/review.js");

