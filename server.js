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
    if (req.oidc.isAuthenticated()){
        var user = User.findAll({where:{email:req.oidc.user.email}})[0]
        if (!user){
            User.create({
                firstName:req.oidc.user.given_name,
                lastName:req.oidc.user.family_name,
                friends:[],
                balance:0
            })
            var user = User.findAll({where:{email:req.oidc.user.email}})[0]
        }
        res.render('dashboard',{user})
    }
    res.render('landing')

})

app.post('/addfunds',(req,res)=>{
    if (req.oidc.isAuthenticated()){
        if (Object.keys(req.body).length == 0){
            console.log('415')
            res.status(415).send({})
            return
        }
        if(!req.body.amount){
            res.status(400).send({})
            return
        }
        const amount = req.body.amount
        const user = User.findAll({where:{email:req.oidc.user.email}})[0]
        var balance = user.balance
        balance += amount
        user.update({balance:balance})
        res.redirect('/')
        return
    }
    res.status(403).send({})
})

app.listen(3000, () => {
    sequelize.sync().then(() => console.log("All ready for banking"))
})
