'use strict';

const mongoose = require('mongoose')
const os = require('os');
const process = require('process')
const _SECONDS = 5000
//count connect 
const countConnect = () => {
    const numConnection = mongoose.connections.length
    console.log(`number of connections:: ${numConnection} `)
}

// check over load 
const checkOverload = () => {
    setInterval( () => {
        const numConnection = mongoose.connections.length
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;

        const maxConnectios = numCores * 5;
        console.log(`Memory usage : ${memoryUsage / 1024 / 1024} MB`)
        console.log(`Active connections : ${numConnection}`)
        if(numConnection > maxConnectios){
            console.log(`Connection overload detected!`)
        }
    },_SECONDS) // monitor every 5 seconds 
}
module.exports = {
    countConnect ,
    checkOverload
}