<<<<<<< HEAD
const secretSettings = require('./secretSettings')
const { auth } = require('express-openid-connect');
const express = require('express')
const app = express()
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars');
const { Sequelize } = require('sequelize/types');
if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

=======
const express = require('express')
const app = express()
const { sequelize } = require('./models')
const { auth } = require('express-openid-connect')
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
>>>>>>> 00f966ab7e0251108e4a2fafa7f1aa4ac848d93c
const handlebars = expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

<<<<<<< HEAD
app.use(auth(secretSettings),express.json())
app.engine('handlebars',handlebars)
app.set('view engine','handlebars')



app.get('/',(req,res)=>{
    if (!req.oidc.isAuthenticated()){
        res.render('landing')
    }
    res.render('dashboard')

})

app.listen(3000,()=>{
    Sequelize.sync(()=>{
    console.log('running')
    })
=======
const openIDconfig = {
    authRequired: false,
    auth0Logout: true,
    secret: 'a long, randomly-generated string stored in env',
    baseURL: 'http://localhost:3000',
    clientID: 'wQbJ6uum2S18q9oMiP04eDoIugyc0qM7',
    issuerBaseURL: 'https://dev-mh85vac0.eu.auth0.com'
  };

app.use(express.json())
app.use(auth(openIDconfig))
app.use(express.static('public'))
app.engine('handlebars', handlebars)
app.set('view engine', 'handlebars')
app.use(express.urlencoded({ extended: true }))

// app.get('/login') this is created by express-openid-connect and displays a login widget
// app.get('/callback') this is created by express-openid-connect and fetches an authenticated user their token
// app.get('/logout') this is created by express-openid-connect and will end a users token based session

app.get('/', (req, res) => {
    res.send(req.oidc.user || "No user logged in")
})

app.listen(3000, () => {
    sequelize.sync().then(() => console.log("All ready for banking"))
>>>>>>> 00f966ab7e0251108e4a2fafa7f1aa4ac848d93c
})
