'use strict'
const shopModel = require("../model/shop.model")
const bcrypt = require('bcrypt')
const crypto =  require('crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair} = require("../auth/authUtils")
const { getInFoData } = require("../utils")
const {BadRequestError,ConflictRequestError, AuthFailureError} = require("../core/error.response")
const { findByEmail } = require("./shop.service")
const RoleShop = {
    SHOP : 'SHOP',
    WRITE : 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN : 'ADMIN'
}
class AccessService {
    /*
    1 : check email in dbs
    2 : match password 
    3 : created at vs rt
    4 : get data return login
    */ 
    static login = async ( {email,password,refreshToken = null}) => {
        //1.
        const foundShop = await findByEmail({email})
        if(!foundShop) throw new BadRequestError('Error : Shop not register')
        //2.
        const match = bcrypt.compare(password,foundShop.password)

        if(!match) throw new AuthFailureError('Authen error')

        //3.
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')
        //4.
        const tokens = await createTokenPair({userId: foundShop._id, email},publicKey, privateKey)
        await KeyTokenService.createKeyToken({
            refreshToken : tokens.refreshToken,
            privateKey,publicKey,userId: foundShop._id
        })
        return {
           shop : getInFoData({fileds : ['_id','name','email'],object: foundShop}),
           tokens
        }
    }
    static signUp = async ({name, email, password}) => {
        try{
            // step 1 : check email exists??
            
            const holderShop = await shopModel.findOne({email}).lean()
            if(holderShop){
                throw new BadRequestError('Error: Shop already exists')
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
                    throw new BadRequestError('Error : KeyStore error')
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
    static logout = async( keyStore) => {
        const delKey = await KeyTokenService.removeTokenById({id : keyStore._id})
        console.log(delKey)
        return delKey
    }
}

module.exports = AccessService