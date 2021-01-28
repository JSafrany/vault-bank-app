const { Sequelize, Model, DataTypes } = require('sequelize')
const path = require('path')

class User extends Model {}
class TransactionHistory extends Model {}
class Friend extends Model{}

User.init({
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    balance: DataTypes.FLOAT,
    friends: DataTypes.ARRAY,
}, {sequelize: sequelize})

TransactionHistory.init ({
    from: DataTypes.STRING,
    to: DataTypes.STRING,
    amount: DataTypes.STRING,

})


User.hasMany(TransactionHistory, {as:"history"})
TransactionHistory.belongsTo(User)


module.exports = {User, TransactionHistory, sequelize}