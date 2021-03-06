var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
LocalStrategy   = require("passport-local"),
    User        = require("./models/user"),
methodOverride  = require("method-override"),
    flash       = require("connect-flash");
    
    
// Calling routes

var indexRoutes      =require("./routes/index"),
    campgroundRoutes =require("./routes/campground"),
    commentRoutes    =require("./routes/comment");
    
    

    var url=process.env.DATABASEURL || "mongodb://localhost/yelp_camp";

mongoose.connect(url);
// "mongodb://piyushamola:avengerway@ds241489.mlab.com:41489/yelpcamp"
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.use(express.static(__dirname +"/public"));
app.use(methodOverride("_method"));
app.use(flash());

// seedDb();

//Passport Configuration

app.use(require("express-session")({
    secret:"piyush",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next)
{
   res.locals.currentUser=req.user;
   res.locals.error=req.flash("error");
   res.locals.success=req.flash("success");
   next();
});


 app.use("/",indexRoutes);
app.use("/campground",campgroundRoutes);
app.use("/campground/:id/comment",commentRoutes);



app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started!");
});