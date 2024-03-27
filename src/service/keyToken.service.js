'use strict';

const keytokenModel = require("../model/keytoken.model");
const {Types:{ObjectId}} = require("mongoose");
class KeyTokenService{
    static createKeyToken = async ( {userId, publicKey, privateKey, refreshToken}) =>{
        try{
            //lv0
            // const tokens = await keytokenModel.create({
            //     user : userId,
            //     publicKey ,
            //     privateKey
            // })

            // return tokens ? tokens.publicKey : null

            //lv xxx
            const filter = {user: userId}, update = {
                publicKey, privateKey,refreshTokensUsed: [],refreshToken            
            },options = {upsert : true, new : true}
            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)
            return tokens ? tokens.publicKey : null
        }catch(e){
            return e;
        }
    }

    static findByUserId = async(userId) => {
        return await keytokenModel.findOne({user: new ObjectId(userId)}).lean()
    }
    static removeTokenById = async ({ id }) => {
        const result = await keytokenModel.deleteOne({
            _id:  new ObjectId(id)
        })
        return result;
    }
    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keytokenModel.findOne({refreshTokensUsed: refreshToken})
    }
    static deleteKeyById = async(userId) => {
        return await keytokenModel.deleteOne({
            user: new ObjectId(userId)
        })
    }
    static findByRefreshToken = async(refreshToken) => {
        return await keytokenModel.findOne({refreshToken})
    }
}

module.exports = KeyTokenService;