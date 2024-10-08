if (process.env.NODE_ENV != "production") {
   require("dotenv").config();
}




const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./Models/user.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");





const dburl = process.env.ATLASDB_URL;

main().then(() => {
   console.log("Connected to DB");
}).catch((err) => {
   console.log(err);
});

async function main() {
   await mongoose.connect(dburl);

}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const store = MongoStore.create({ // This code is for  session information is not reset instant time we can limit the time 24 hours
   mongoUrl:  dburl,
   crypto : {
      secret : process.env.SECRET,

   },
   touchAfter: 24 * 3600, // pass the time in seconds
});
store.on("error" , () =>{
   console.log("ERROR in MONGO SESSION  STORE" , err);
});
const sessionOptions = { store, // our session information is store on atlas database : 
   secret: process.env.SECRET,
   resave: false,
   saveUninitialized: true,
   cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, // prevent from cross script attack
   },
};




app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
   res.locals.success = req.flash("success");
   res.locals.error = req.flash("error");
   res.locals.currUser = req.user;
   next();
});

// app.get("/demouser", async (req, res) => {
//    let fakeUser = new User({
//       email: "ravijaiswal047@gmail.com",
//       username: "delta-student",

//    });
//    let registerUser = await User.register(fakeUser, "helloworld");
//    res.send(registerUser);
// })

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);



app.all("*", (req, res, next) => {
   next(new ExpressError(404, "Page not Found!"));
});

app.use((err, req, res, next) => {
   let { status = 400, message = "PAGE NOT FOUND!" } = err;
   // res.status(status).send(message);
   res.status(status).render("./listings/error.ejs", { message });

});

app.listen(8080, (req, res) => {
   console.log(`port is listening at port ${8080}`);
});
