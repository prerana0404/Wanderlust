const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const Expresserror = require("./utils/ExpressError.js");
//const listingSchema=require("./schema.js");
//const { error } = require("console");
const Review = require("./models/reviews.js");
const { listingSchema } = require("./schema.js");
const { error } = require("console");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LoaclStrategy = require("passport-local");
const User = require("./models/user.js");
const { isLoggedIn, isReviewAuthor } = require("./middleware.js");

const listings = require("./routes/listing.js");
const reviews=require("./routes/reviews.js");
const user = require("./models/user.js");
const userRouter = require("./routes/user.js");



const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});
async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() * 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};
app.get("/", (req, res) => {
    res.send("Hi,I am root");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LoaclStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    //   console.log(res.locals.success);
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"delta-student"
//     });
//     let registeredUser=  await  User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// });

//ROUTERS
app.use("/listings", listings);
app.use("/", userRouter);
app.use("/listing/:id/reviews",reviews);



app.all("*", (req, res, next) => {
    next(new Expresserror(404, "page not found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
    //res.status(statusCode).send(message);
    //res.send("sometimes went wrong");
});

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});