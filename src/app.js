require('dotenv').config();
const express  = require('express');
const {default : helmet} = require('helmet');
const compression = require('compression')
const app = express();
const morgan = require('morgan');

// init middleware
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extended: true,
}))
// init db
require('./dbs/init.mongodb')
const { checkOverload} = require('./helpers/check.connect')
checkOverload()
// init routers
app.use('',require('./routes'))
//handling errors

module.exports = app