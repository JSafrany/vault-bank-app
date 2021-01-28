const secretSettings = require('./secretSettings')
const { auth } = require('express-openid-connect');
const express = require('express')
const app = express()
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars');
const { User, Account, Friend, sequelize } = require('./models');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const handlebars = expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

app.use(auth(secretSettings),express.json())
app.engine('handlebars',handlebars)
app.set('view engine','handlebars')
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.get('/',(req,res)=>{
    if (!req.oidc.isAuthenticated()){
        user = User.findAll({where:{email:req.oidc.user.email}})

        res.render('landing')
    }
    res.render('dashboard')

})

app.listen(3000, () => {
    sequelize.sync().then(() => console.log("All ready for banking"))
})
