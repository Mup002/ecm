'use strict'
const{ product, electronic, furniture, clothing } = require('../../model/product.model')
const {Types:{ObjectId}, model} = require('mongoose')
const {selectData, unGetSelectData} = require('../../utils')
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

const findAllProducts = async ({limit, sort , page, filter, select}) => {
    const skip = (page - 1) *limit;
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id : 1}
    const products = await product.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(selectData(select))
    .lean()

    return products
}

const findProductById = async ({product_id, unSelect}) => {
    return await product.findById(product_id)
    .select(unGetSelectData(unSelect))
}

const updateProductById = async({productId,bodyUpdate,model,isNew = true}) =>{
    return await model.findByIdAndUpdate(productId, bodyUpdate,{new:isNew})
}
module.exports = {
    findAllDraftsForShop,
    publishProductByShop,
    findAllPublishForShop,
    unpublishProductByShop,
    searchProductByUser,
    findAllProducts,
    findProductById,
    updateProductById
}