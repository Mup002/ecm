'use strict'

const {findById} = require('../service/apikey.service')
const HEADER = {
    API_KEY : 'x-api-key',
    AUTHORIZATION : 'authorizations'
}
const apiKey = async (req, res, next) => {
    try{
        const key = req.headers[HEADER.API_KEY]?.toString()
        if(!key){
            return res.status(403).json({
                message : ' FORBIDDEN ERROR'
            })
        } 
        //check objKey
        const objKey = await findById(key)
        if(!objKey){
            return res.status(403).json({
                message : 'FORBIDDEN ERROR'
            })
        }
        req.objKey = objKey
        return next()
    }catch(error){

    }
}
const permission = (permission) => {
    return (req,res,next) => {
        if(!req.objKey.permissions){
            return res.status(403).json({
                message : 'PERMISSION DENIED'
            })
        }
        console.log(`req.objKey.permissions::`, req.objKey.permissions)
        const validPermissions = req.objKey.permissions.includes(permission)
        if(!validPermissions){
            return res.status(403).json({
                message: 'permission denied'
            })
        }
        return next()
    }
}
module.exports = {
    apiKey,
    permission
}