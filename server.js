const express = require('express')
const app = express()
const { sequelize } = require('./models')
const { auth } = require('express-openid-connect')
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const handlebars = expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

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
})
