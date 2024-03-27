'use strict'
const {product,clothing,electronic, furniture} = require('../model/product.model')
const {BadRequestError,ConflictRequestError, AuthFailureError, ForbiddenError} = require("../core/error.response")
const { findAllDraftsForShop, publishProductByShop, findAllPublishForShop, unpublishProductByShop,searchProductByUser } = require('../model/repositories/product.repo')

//define factory class to create product
class ProductFactory {
    /*
    type : clothing,
    payload
    */
    static productRegistry = {} // key-class 
    static registerProductType(type, classRef){
        ProductFactory.productRegistry[type] = classRef
    }
    static async createProduct(type,payload){
        const productClass = ProductFactory.productRegistry[type]
        if(!productClass) throw new BadRequestError(`Invalid product type ${type}`)
        return new productClass(payload).createProduct()
        // switch(type){
        //     case 'Electronics':
        //         return new Electronic(payload).createProduct()
        //     case 'Clothing':
        //         return new Clothing(payload).createProduct()
        //     default:
        //         throw new BadRequestError(`Invalid product type: ${type}`)
        // }
    }

    
    
    //Put
    static async publishProductByShop({product_shop,product_id}){
        return await publishProductByShop({product_shop,product_id})
    }
    static async unpublishProductByShop({product_shop, product_id}){
        return await unpublishProductByShop({product_shop,product_id})
    }
    //end put

    //query
    static async findAllDraftsForShop({product_shop, limit = 50 , skip = 0}){
        const query = {product_shop, isDraft : true}
        return await findAllDraftsForShop({query,limit, skip})
    }

    static async findAllPublishForShop({product_shop, limit = 50, skip = 0}){
        const query = {product_shop, isPublish : true}
        return await findAllPublishForShop({query, limit, skip})
    }
    
    static async searchProduct({keySearch}) {
        return await searchProductByUser({keySearch})

    }    //end query


}


// define base product class
class Product{
    constructor({
        product_name, 
        product_thumb, 
        product_description,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes,
        product_slug
    }){
        this.product_name = product_name,
        this.product_thumb =  product_thumb,
        this.product_description = product_description,
        this.product_price = product_price,
        this.product_quantity = product_quantity,
        this.product_type = product_type,
        this.product_shop = product_shop,
        this.product_attributes = product_attributes,
        this.product_slug = product_slug

    }

    // create new product
    async createProduct(product_id){
        return await product.create({
            ...this,_id:product_id
        })
    }
}

//define sub-class for different product type = clothing
class Clothing extends Product{
    async createProduct(){
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop : this.product_shop
        })
        if(!newClothing) throw new BadRequestError('create new clothing error')

        const newProduct = await super.createProduct(newClothing._id)
        if(!newProduct) throw new BasRequestError('create new product error')

        return newProduct
    }
}

//define sub-class for different product type = Electronic
class Electronic extends Product{
    async createProduct(){
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop : this.product_shop
        })
        if(!newElectronic) throw new BadRequestError('create new Electronic error')

        const newProduct = await super.createProduct(newElectronic._id)
        if(!newProduct) throw new BasRequestError('create new Electronic error')
        return newProduct
        
    }
}


//define sub-class for different product type = Furniture
class Furniture extends Product{
    async createProduct(){
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop : this.product_shop
        })
        if(!newFurniture) throw new BadRequestError('create new Furniture error')

        const newProduct = await super.createProduct(newFurniture._id)
        if(!newProduct) throw new BasRequestError('create new Furniture error')
        return newProduct
        
    }
}


// regisrter product type
ProductFactory.registerProductType('Electronic', Electronic)
ProductFactory.registerProductType('Furniture',Furniture)
ProductFactory.registerProductType('Clothing',Clothing)

module.exports = ProductFactory