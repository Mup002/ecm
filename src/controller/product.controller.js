'use strict'

const ProductService = require("../service/product.service")
const ProductServiceV2 = require("../service/product.service.xxx")
const {OK,CREATED, SuccessResponse} = require("../core/success.response")

class ProductController {
    // createProduct = async (req,res, next) => {
    //     new SuccessResponse({
    //         message: 'Create new product successfully',
    //         metadata: await ProductService.createProduct
    //         (req.body.product_type, {
    //             ...req.body,
    //             product_shop :req.user.userId
    //         })
    //     } ).send(res)
    // }
    createProduct = async (req,res, next) => {
        new SuccessResponse({
            message: 'Create new product successfully',
            metadata: await ProductServiceV2.createProduct
            (req.body.product_type, {
                ...req.body,
                product_shop :req.user.userId
            })
        } ).send(res)
    }

    publishProductByShop = async(req,res,next) => {
        new SuccessResponse({
            message: 'Published',
            metadata: await ProductServiceV2.publishProductByShop({
                product_id : req.params.id,
                product_shop : req.user.userId
            })
        }).send(res)
    }
    unpublishProductByShop = async(req,res,next) =>{
        new SuccessResponse({
            message: 'Unpublished',
            metadata: await ProductServiceV2.unpublishProductByShop({
                product_id: req.params.id,
                product_shop : req.user.userId
            })
        })
    }
    
    //query
    /**
     * @desc getAllDraft for shop
     * @param{Number} limit
     * @param{Number} skip
     * @return {Json}
     **/
    getAllDraftsForShop = async(req, res, next) => {
        new SuccessResponse({
            message:'Get list draft success',
            metadata: await ProductServiceV2.findAllDraftsForShop({
                product_shop : req.user.userId
            })
        }).send(res)
    }
    //end query

    getAllPublishForShop = async(req,res,next) => {
        new SuccessResponse({
            message: 'Get all published product',
            metadata:  await ProductServiceV2.findAllPublishForShop({
                product_shop : req.user.userId
            })
        }).send(res)
    }

    getListSearchProduct = async(req,res,next) => {
        new SuccessResponse({
            message: 'Get all product by search',
            metadata:  await ProductServiceV2.searchProduct(req.params)
        }).send(res)
    }
}

module.exports = new ProductController()
