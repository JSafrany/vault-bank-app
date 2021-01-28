const { Sequelize, Model, DataTypes } = require('sequelize')
const path = require('path')

class User extends Model {}
class Account extends Model {}
class Friend extends Model{}

User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
}, {sequelize: sequelize})

Account.init({
    balance: DataTypes.FLOAT,
}, {sequelize: sequelize})

Friend.init({
    email: DataTypes.STRING,
}, {sequelize: sequelize})

User.hasMany(Friend, {as:"friend"})
User.hasMany(Account, {as:"account"})
Friend.belongsTo(User)
Account.belongsTo(User)

