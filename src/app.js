const express  = require('express');
const {default : helmet} = require('helmet');
const compression = require('compression')
const app = express();
const morgan = require('morgan');
// init middleware
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())

// init db

// init routers
app.get('/',(req,res, next) => {
    const strCompress = "hello !!!!"
    return res.status(200).json({
        message: 'welcome',
        metadata : strCompress.repeat(10000)
    })
})
//handling errors

module.exports = app