const express = require ('express');
const app = express()

const path = require ('path')
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose')
const flash = require ('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
//requirment user and admin route

const userRoutes = require('./routes/users') 
const adminRoutes = require('./routes/admin') 

//requiring user model

const User = require ('./models/usermodel')

dotenv.config({path : './config.env'})

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser : true,
    useUnifiedTopology: true,
    useCreateIndex : true
}).then(con =>{
    console.log('Mongodb Database connect successfully');
    
})

//middleware for session
app.use(session({
    secret: 'Just a single login/signup application',
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy({usernameField: 'email'},User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
//middleware for method override 
app.use(methodOverride('_method'))

//middleware for flash massage

app.use(flash())
//settig middleware globaly
app.use((req, res, next)=>{
     res.locals.success_msg = req.flash(('success_msg'));
     res.locals.error_msg = req.flash(('error_msg'));
     res.locals.error = req.flash(('error'));
     res.locals.cureentUser = req.user;
     next();
})
app.use(bodyParser.urlencoded({extended: true}))
app.set('views',path.join(__dirname,'views'))
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(userRoutes);
app.use(adminRoutes);

app.listen(process.env.PORT,()=>{
    console.log('Server is started');
    
})


