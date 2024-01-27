'use strict'

const _ = require('lodash')

const getInFoData = ({fileds = {}, object = {}}) => {
    return _.pick(object,fileds)
}
module.exports = {
    getInFoData 
}