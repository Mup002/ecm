'use strict';

const keytokenModel = require("../model/keytoken.model");

class KeyTokenService{
    static createKeyToken = async ( {userId, publicKey, privateKey}) =>{
        try{
            // const publicKeyString = publicKey.toString();
            const tokens = await keytokenModel.create({
                user : userId,
                publicKey ,
                privateKey
            })

            return tokens ? tokens.publicKey : null
        }catch(e){
            return e;
        }
    }
}

module.exports = KeyTokenService;