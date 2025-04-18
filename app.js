const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const Doctor = require("./models/doctor.js");
const Patient = require("./models/patient.js");
const TrackUser = require("./models/tracker.js");
const Profile = require("./models/profile.js");
const Blog = require("./models/Blog.js");
const ejsMate = require("ejs-mate");
const flash = require("connect-flash");


const MONGO_URL = "mongodb://127.0.0.1:27017/doctorDB";

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => console.log("Connection successful"))
    .catch((err) => console.log(err));

const port = 8080;



app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.static(path.join(__dirname,"public")));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie : {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); 

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currUser = req.user;
    next();
});

app.get("/Home",(req,res)=>{
    res.render("Home.ejs");
})

app.get("/Home/doctor", async (req, res) => {
    console.log("hello");
    let doctors = await Doctor.find();
    res.render("doctorDetails.ejs", {doctors});
})

app.get("/Home/signup", async (req, res) => {
    res.render("signup.ejs");
});

app.get("/Home/login", async (req, res) => {
    res.render("login.ejs");
});

app.get("/Home/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/Home");
    })
})

app.get("/Home/activitytracker", async (req, res) => {
    res.render("tracker.ejs");
})



app.post("/Home/activitytracker", async (req, res) => {
    if (!req.user) {
        return res.redirect("/Home/login");
    }
    
    let newactivity = new TrackUser(req.body);
    await newactivity.save();
    let currentUser = req.user.username;
    let user = await User.findOne({username: currentUser});
    user.trackUser.push(newactivity);
    await user.save();
    let u = await User.findOne({username: currentUser}).populate("trackUser");
    console.log(u);
    res.render("userActivity.ejs", { u });
})


app.post("/Home/signup", async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) {
                console.error("Login Error:", err);
                return next(err);
            }
            return res.redirect("/Home");
        });

    } catch (err) {
        return res.redirect("/Home/signup");
    }
});




app.post("/Home/login", 
    passport.authenticate("local", {
        failureRedirect: "/Home/login",
        failureFlash: true,
    }),
    async (req, res) => {
       res.redirect("/Home");
    }
);



app.get("/Home/profile", async (req, res) => {
    if (!req.user) {
        return res.redirect("/Home/login");
    }

    let currentUserProfile = req.user.username;
    let userProfile = await Profile.findOne({ name: currentUserProfile });

    if (userProfile) {
        res.render("dashboard.ejs", { user: userProfile });  
    } else {
        res.render("profile.ejs");  
    }
});


app.post("/Home/profile", async (req, res) => {
    if (!req.user) {
        return res.redirect("/Home/login");
    }

    let bmi1 = req.body.weight / ((req.body.height / 100) ** 2);

    let updatedProfile = await Profile.findOneAndUpdate(
        { name: req.user.username },  
        {  
            age: req.body.age,
            gender: req.body.gender,
            height: req.body.height,
            weight: req.body.weight,
            bmi: bmi1,
            issues: req.body.issues,
            fitnessLevel: req.body.fitnessLevel,
            image: req.body.img
        }
    );

    res.redirect("/Home/profile");  
});


app.get("/Home/reminder", async (req, res) => {
    res.render("reminder.ejs");
})






app.get("/Home/appointment/:id", async (req, res) => {
    let doctorChosen = await Doctor.findById(req.params.id);
    res.render("appointment.ejs", {doctorChosen});
})

app.post("/Home/appointed/:id", async (req, res) => {
    let doctorChosen = await Doctor.findById(req.params.id);
    let patientDetail =  await Patient.insertOne(req.body);
    res.render("appointed.ejs", {doctorChosen, patientDetail});
})

app.get("/Home/doctorreg", async (req, res) => {
    res.render("doctorreg.ejs");
})

app.get("/Home/medicine", (req, res) => {
    res.render("medicineSearch.ejs");
});



app.post("/Home/medicine", async (req, res) => {
    const drugName = req.body.drugName;
    const apiURL = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:${drugName}&limit=1`;

    try {
        const response = await fetch(apiURL);

        if (!response.ok) {
            throw new Error(`API returned status ${response.status}`);
        }

        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            throw new Error("No results found");
        }

        const drugInfo = data.results[0];
        res.render("medicineResult.ejs", { drugInfo, drugName, error: null });

    } catch (err) {
        console.error("Error fetching drug data: ", err.message);
        res.render("medicineResult.ejs", { error: "No results found or API error.", drugName, drugInfo: null });
    }
});


app.get("/Home/Workout",(req,res)=>{
    res.render("workout.ejs");
})


app.post("/Home/workout", async (req, res) => {
    const workoutName = req.body.workoutName; 
    try {
        const response = await fetch(`https://api.api-ninjas.com/v1/exercises?muscle=${workoutName}`, {
            headers: {
                'X-Api-Key': 'SL061my8YjhqiQzz59Bahw==TRmOmeP3u9oZyZT0'
            }
        });
        const exercises = await response.json(); 
        if (exercises && exercises.length > 0) {
            res.render("workoutDetails.ejs", { 
                exercises: exercises, 
                workoutName: workoutName,
                error: null
            });
        } else {
            res.render("workoutDetails.ejs", { 
                error: "No exercises found for this muscle group.", 
                exercises: [],
                workoutName: workoutName
            });
        }
    } catch (err) {
        console.error("Error fetching exercises data: ", err.message);
        res.render("workoutDetails.ejs", {
            error: "Failed to fetch exercises. Please try again later.",
            exercises: [],
            workoutName: workoutName
        });
    }
});




app.get("/Home/blogs", async (req, res) => {
    const blogs = await Blog.find({}).populate("author");
    res.render("blogslisting.ejs", { blogs });
});


app.get("/Home/blogs/new", (req, res) => {
    if (!req.user) {
        return res.redirect("/Home/login");
    }
    res.render("newblog.ejs");
});



app.post("/Home/blogs", async (req, res) => {
    if (!req.user) {
        return res.redirect("/Home/login");
    }
    const blog = new Blog(req.body.blog);
    blog.author = req.user._id;
    await blog.save();
    const user = await User.findById(req.user._id);
    user.blogs.push(blog);
    await user.save();
    res.redirect(`/Home/blogs/${blog._id}`);
});



app.get("/Home/blogs/:id", async (req, res) => {
    const blog = await Blog.findById(req.params.id)
        .populate("author");
    res.render("showblogs.ejs", { blog });
});



app.listen(port,()=>{
    console.log(`listening to port no ${port}`);
})