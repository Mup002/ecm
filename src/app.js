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
app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error)
})

app.use((error,req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status : 'error',
        code : statusCode,
        message: error.message || 'internal server error'
    })
})
module.exports = app