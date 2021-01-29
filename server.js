//const secretSettings = require('./secretSettings')
const { auth } = require('express-openid-connect');
const express = require('express')
const app = express()
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars');
const { User, TransactionHistory, sequelize } = require('./models');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const handlebars = expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH_SECRET,
    baseURL: 'http://localhost:3000',
    clientID: process.env.AUTH_CLIENT_ID,
    issuerBaseURL: process.env.AUTH_BASE_URL,
  };

app.use(auth(config),express.json())
app.engine('handlebars',handlebars)
app.set('view engine','handlebars')
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.get('/',async (req,res)=>{
    if (req.oidc.isAuthenticated()){
        var user = await User.findOne({where:{email:req.oidc.user.email}})
        if (!user){
            if(req.oidc.user.given_name){
                await User.create({
                    name:req.oidc.user.given_name,
                    email:req.oidc.user.email,
                    balance:0.
                })
            }
            else{
                await User.create({
                    name:req.oidc.user.nickname,
                    email:req.oidc.user.email,
                    balance: 0.
                })
            }
            user = await User.findOne({where:{email:req.oidc.user.email}})
        }
        console.log(user)
        const friendObjects = await user.getFriends()
        console.log(friendObjects)
        res.render('dashboard',{layout: 'main', user,friendObjects})
        return
    }
    res.render('landing', {layout: 'mainlanding'})

})

app.post('/addfunds',async (req,res)=>{
    if (req.oidc.isAuthenticated()){
        if(!req.body.amount){
            res.status(400).send({})
            return
        }
        const amount = req.body.amount
        const user = await User.findOne({where:{email:req.oidc.user.email}})
        var balance = parseFloat(user.balance)
        balance += parseFloat(amount)
        await user.update({balance:balance})
        res.redirect('/')
        return
    }
    res.status(403).send({})
})

app.post('/pay',async (req,res)=>{
    if(!req.oidc.isAuthenticated()){
        res.status(403).send()
        return
    }
    if (Object.keys(req.body).length == 0){
        console.log('415')
        res.status(415).send({})
        return
    }
    if(!req.body.amount || !req.body.recipient){
        res.status(400).send({})
        return
    }
    const payer = await User.findAll({where:{email:req.oidc.user.email}})[0]
    const payee = await User.findAll({where:{email:req.body.recipient}})[0]
    if(!payer || !payee){
        res.status(404).send({})
        return
    }
    await payer.update({balance: balance - req.body.amount})
    await payee.update({balance: balance + req.body.amount})
    res.redirect('/')
})

app.post('/addfriend',async (req,res) =>{
    if(!req.oidc.isAuthenticated()){
        console.log('403')
        res.status(403).send()
        return
    }
    if (Object.keys(req.body).length == 0){
        console.log('415')
        res.status(415).send({})
        return
    }
    if(!req.body.email){
        console.log('400')
        res.status(400).send({})
        return
    }
    const user = await User.findOne({where:{email:req.oidc.user.email}})
    const friend =  await User.findOne({where:{email:req.body.email}})
    if(!friend.email){
        console.log('user not found, redirecting to /invite')
        res.redirect('invite')
        return
    }
    await user.addUser(friend)
    res.status('200').send({})
    return

})

app.get('/invite',(req,res) =>{
    res.render('invite')
})

app.post('/invite',async (req,res)=>{
    if(!req.oidc.isAuthenticated()){
        console.log('403')
        res.sendStatus(403)
        return
    }
    if(!req.body.email){
        console.log('400')
        res.sendStatus(400)
        return
    }
    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
})

app.get('/history', async (req,res) => {
    if (req.oidc.isAuthenticated()) {
        const history = await TransactionHistory.findAll({where:{from:req.oidc.user.email,to:req.oidc.user.email}})
       if (!history) {
           res.redirect('/')
           return
       }
       res.send(history)

    }
    res.status(403).send({})
})

app.get('/friends', async(req, res)=> {
    if (req.oidc.isAuthenticated()) {
        const user = await User.findOne({where:{email:req.oidc.user.email}})
        const friends = await user.getFriends()
       res.render('friends', {friends})
       return
    }
    res.status(403).send({})    
})

app.post('/addfriend',async (req,res) =>{
    if(!req.oidc.isAuthenticated()){
        console.log('403')
        res.status(403).send()
        return
    }
    if (Object.keys(req.body).length == 0){
        console.log('415')
        res.status(415).send({})
        return
    }
    if(!req.body.email){
        console.log('400')
        res.status(400).send({})
        return
    }
    const user = await User.findOne({where:{email:req.oidc.user.email}})
    const friend =  await User.findOne({where:{email:req.body.email}})
    if(!friend.email){
        console.log('404')
        res.status(404).send({})
        return
    }
    await user.addUer(friend)
    res.status('200').send({})
    return
})


app.listen(3000, () => {
    sequelize.sync().then(() => console.log("All ready for banking"))
})
