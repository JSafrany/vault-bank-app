const { Sequelize, Model, DataTypes } = require('sequelize')
const path = require('path')

const connectionSettings = {
    test: {dialect: 'sqlite', storage: 'sqlite::memory:'},
    dev: {dialect: 'sqlite', storage: path.join(__dirname, 'data.db')},
    production: {dialect: 'postgres', protocal: 'postgres'}
}
const sequelize = process.env.NODE_ENV === 'production'
    ? new Sequelize(process.env.DATABASE_URL, connectionSettings[process.env.NODE_ENV])
    : new Sequelize(connectionSettings[process.env.NODE_ENV])

class User extends Model {}
class TransactionHistory extends Model {}

User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    balance: DataTypes.REAL,
    friends: DataTypes.ARRAY,
}, {sequelize: sequelize})

TransactionHistory.init ({
    from: DataTypes.STRING,
    to: DataTypes.STRING,
    amount: DataTypes.STRING,
}, {sequelize: sequelize})


User.hasMany(TransactionHistory, {as:"history"})
TransactionHistory.belongsTo(User)


module.exports = {User, TransactionHistory, sequelize}