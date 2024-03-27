'use strict'

const { inventory} = require('../../model/inventory.model')
const {Types} = require('mongoose')
const insertInventory = async({
    productId, shopId, stock, location = 'uKnow'
})=>{
    return await inventory.create({
        inven_productId:productId,
        inven_shopId: shopId,
        inven_location: location,
        inven_stock : stock
    })
}

module.exports = {
    insertInventory
}