var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    cookieParser = require("cookie-parser"),
    LocalStrategy = require("passport-local"),
    flash        = require("connect-flash")
    session = require("express-session"),
	User        = require("./models/user"),
    methodOverride = require("method-override");
	router = express.Router(),
	MongoClient = require("mongodb").MongoClient;


require('dotenv').load();
    
// assign mongoose promise library and connect to database
mongoose.Promise = global.Promise;

const databaseUri = 'mongodb+srv://rajshubam820:10december@cluster0.5npfidt.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(databaseUri,{ useFindAndModify: false, useNewUrlParser: true ,useUnifiedTopology: true },function(err){
	if(err){
		console.log(err);
	}
	else{
		console.log("Successfully connected to database");
	}
});
app.set('trust proxy', 1);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));
//require moment
app.locals.moment = require('moment');


//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Hello, welcome to ynamic Stock Management",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.use(session({
// cookie:{
//     secure: true,
//     maxAge:60000
//        },
// // store: new RedisStore(),
// secret: 'secret',
// saveUninitialized: true,
// resave: false
// }));


app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});


app.get("/", function(req, res){
    res.render("landing");
});

app.get("/login", function(req,res){
	res.render('login',{page:'login'});
})

app.post("/login", passport.authenticate("local", 
    {
        successRedirect: ("/"),
        failureRedirect: "/login" 
    }), function(req, res){
});

app.get("/signup",function(req,res){
	res.render("signup");
})

app.post("/signup",function(req,res){
	 var newUser = new User({username: req.body.username, email:req.body.email});
     User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
			// req.flash("error",err);
            return res.render("signup");
        }
		 res.redirect("/login");
        // passport.authenticate("local")(req, res, function(){
        //    res.redirect("/login");
        // });
    });
})

app.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "See you later!");
   res.redirect("/");
});

app.get("*",function(req,res){
	res.send("The page you are looking for does not exist!")})

function isLoggedIn(req, res, next){
        if(req.isAuthenticated())
		{
            return 1;
        }
        // req.flash("error", "You must be signed in to do that!");
        res.redirect("/login");
    };

// app.listen(process.env.PORT, function(){
//    console.log("The Server Has Started!");
// });




app.listen(3000,function(){
   console.log("The Server Has Started!");
});