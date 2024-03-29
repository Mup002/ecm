'use strict'

const apikeyModel = require("../model/apikey.model")
const crypto = require('crypto')
const findById = async ( key ) => {
    // const newKey = await apikeyModel.create({key: crypto.randomBytes(64).toString('hex'),permissions:['0000']})
    // console.log(newKey)
    const objectKey = await apikeyModel.findOne({key, status : true}).lean()
    return objectKey
}

module.exports = {
    findById
}