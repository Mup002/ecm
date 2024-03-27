'use strict'
const{ product, electronic, furniture, clothing } = require('../../model/product.model')
const {Types:{ObjectId}} = require('mongoose')
const findAllDraftsForShop = async({query,limit,skip}) =>{
    return await queryProduct({query,limit,skip})
}
const findAllPublishForShop = async({query,limit,skip}) =>{
   return await queryProduct({query,limit,skip})
}
const publishProductByShop = async({product_shop,product_id }) => {
    const foundShop = await product.findOne({
        product_shop : new ObjectId(product_shop),
        _id : new ObjectId(product_id)
    })
    if(!foundShop) return null

    foundShop.isDraft = false
    foundShop.isPublish = true
    const {modifiedCount} = await foundShop.updateOne(foundShop)
    
    return modifiedCount
}
const unpublishProductByShop = async({product_shop,product_id}) =>{
    const foundShop = await product.findOne({
        product_shop : new ObjectId(product_shop),
        _id : new ObjectId(product_id)
    })
    if(!foundShop) return null

    foundShop.isDraft = true
    foundShop.isPublish = false
    const {modifiedCount} = await foundShop.updateOne(foundShop)
    
    return modifiedCount
}
const queryProduct = async ({query, limit, skip}) => {
    return await product.find(query)
    .populate('product_shop','name email -_id')
    .sort({updateAt:-1})
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()

}
const searchProductByUser = async ({keySearch})=>{
    const regexSearch = new RegExp(keySearch)
    const results = await product.find({
        isPublish: true,
        $text:{$search:regexSearch}
    },{score: {$meta:'textScore'}})
    .sort({score: {$meta:'textScore'}})
    .lean()
    return results
}
module.exports = {
    findAllDraftsForShop,
    publishProductByShop,
    findAllPublishForShop,
    unpublishProductByShop,
    searchProductByUser
}