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

const handlebars = expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

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
})
