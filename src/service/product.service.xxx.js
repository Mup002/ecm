'use strict'
const {product,clothing,electronic, furniture} = require('../model/product.model')
const {BadRequestError,ConflictRequestError, AuthFailureError, ForbiddenError} = require("../core/error.response")
const {updateProductById,findProductById, findAllDraftsForShop, publishProductByShop,findAllProducts, findAllPublishForShop, unpublishProductByShop,searchProductByUser } = require('../model/repositories/product.repo')
const { unGetSelectData, removeUndefinedObject, updateNestedObjectParser } = require('../utils')
const { insertInventory } = require('../model/repositories/inventory.repo')

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
    }

    static async updateProduct(type,productId,payload){
        const productClass = ProductFactory.productRegistry[type]
        if(!productClass) throw new BadRequestError(`Invalid product type ${type}`)
        return new productClass(payload).updateProduct(productId)
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

    }    
    static async findAllProducts({limit = 50, sort = 'ctime', page =1, filter={isPublish: true}}){
        return await findAllProducts({limit,sort,page,filter,select:['product_name','product_price','product_thumb']})
    }

    static async findProductById({product_id}){
        return await findProductById({product_id,unGetSelectData:['__v']})

    }

 
    //end query
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
    async createProduct(productId){
        const newProduct = await product.create({
            ...this,_id:productId
        })
        if(newProduct){
            await insertInventory({
                productId:newProduct._id,
                shopId: this.shopId,
                stock: this.product_quantity,
                
            })
        }
        return newProduct;
    }

    async updateProduct(productId,bodyUpdate){
       return await updateProductById({productId, bodyUpdate,model:product})
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

    async updateProduct(productId){
        /* 
        {
            a: underfined,
            b: null
        }
        */
        //1 . remove attr has null or undefined
        console.log(`[1]::`,this)
        const objectParams = removeUndefinedObject(this)
        console.log(`[2]::`,objectParams)
        //2 . check xem updet cho nao ???
        if(objectParams.product_attributes){
            //update child
            await updateProductById({
                productId, 
                bodyUpdate:updateNestedObjectParser(objectParams.product_attributes),
                model:clothing
            })
        }
        const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams))
        return updateProduct
    
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