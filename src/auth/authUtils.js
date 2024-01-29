'use strict'
const JWT = require('jsonwebtoken')
const { asyncHandler } = require('../helpers/asyncHandler')
const {AuthFailureError,NotFoundError} = require('../core/error.response')

//service
const{findByUserId} = require('../service/keyToken.service')
const HEADER = {
    API_KEY : 'x-api-key',
    CLIENT_ID : 'x-client-id',
    AUTHORIZATION : 'authorizations'
}
const createTokenPair = async(payload, publicKey, privateKey) => {
    try{
        const accessToken = await JWT.sign(payload,publicKey,{
        
            expiresIn: '2 days'
        })
        const refreshToken = await JWT.sign(payload, privateKey, {
          
            expiresIn: '7 days'
        })

        JWT.verify(accessToken, publicKey,(err, decode)=>{
            if(err){
                console.error(`error verify`, err)
            }else{
                console.log(`decode verify`, decode)
            }
        })
        return { accessToken, refreshToken }
    }catch(error){

    }
}

const authentication = asyncHandler( async (req, res, next) => {
    /* 
    1- check userId missing ??
    2- getAccessToken
    3- verify token
    4- check UserDB
    5- check keyStore with userId
    6- ok all => return next 
    */

    const userId = req.headers[HEADER.CLIENT_ID]
    if(!userId) throw new AuthFailureError('Invalid request')
    //2
    const keyStore = await findByUserId(userId)
    if(!keyStore) throw new NotFoundError('not found keystore')

    //3
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if(!accessToken) throw new AuthFailureError('Invalid request')

    try{
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        if(userId !== decodeUser.userId)  throw new AuthFailureError('Invalid userid')
        req.keyStore = keyStore

        return next()
    }catch(e){
        throw e
    }
})
module.exports = {
    createTokenPair,
    authentication
}