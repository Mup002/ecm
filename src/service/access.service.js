'use strict'
const shopModel = require("../model/shop.model")
const bcrypt = require('bcrypt')
const crypto =  require('crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair} = require("../auth/authUtils")
const { getInFoData } = require("../utils")
const RoleShop = {
    SHOP : 'SHOP',
    WRITE : 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN : 'ADMIN'
}
class AccessService {
    static signUp = async ({name, email, password}) => {
        try{
            // step 1 : check email exists??
            const holderShop = await shopModel.findOne({email}).lean()
            if(holderShop){
                return {
                    code : 'xxx',
                    message : 'Shop already registered',
                }
            }
            const passwordHash = await bcrypt.hash(password,10)
            const newShop = await shopModel.create({
                name,email,password : passwordHash ,roles : [RoleShop.SHOP]
            })

            if(newShop){
                // created privateKey , publicKey
                // const { privateKey , publicKey} = crypto.generateKeyPairSync('rsa', {
                //     modulusLength : 4096,
                //     publicKeyEncoding : {
                //         type : 'pkcs1',
                //         format : 'pem'
                //     },
                //     privateKeyEncoding : {
                //         type : 'pkcs1',
                //         format : 'pem'
                //     }
                // })
                const privateKey = crypto.randomBytes(64).toString('hex');
                const publicKey = crypto.randomBytes(64).toString('hex');
              
                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                })
                if(!keyStore){
                    return {
                        code: 'xxxx',
                        message : 'publicKeyString error'
                    }
                }
               
                //created token pair
                const tokens = await createTokenPair({userId: newShop._id, email},publicKey, privateKey)
                console.log(`Created token success: `,tokens)

                return{
                    code : 201,
                    metadata: {
                        shop : getInFoData(
                            {fileds : ['_id','name','email'],object: newShop}
                        ),
                        tokens
                    }
                }
            }

            return{
                code : 200,
                metadata : null
            }
        }catch(e){
            return {
                code: 'xxx',
                message : e.message,
                status : 'error'
            }
        }
    }
}

module.exports = AccessService