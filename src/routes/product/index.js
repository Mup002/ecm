'use strict'
const express = require('express')
const productController = require('../../controller/product.controller')
const router = express.Router()
const {asyncHandler} = require('../../auth/checkAuth')
const {authentication} = require('../../auth/authUtils')

router.get('/search/:keySearch',asyncHandler(productController.getListSearchProduct))
router.get('/getAllProduct',asyncHandler(productController.findAllProducts))
router.get('/getProductById/:product_id',asyncHandler(productController.findProduct))
//authen
router.use(authentication)
///////
router.post('',asyncHandler(productController.createProduct))
router.post('/publish/:id',asyncHandler(productController.publishProductByShop))
router.post('/unpublish/:id',asyncHandler(productController.unpublishProductByShop))
router.patch('/:productId',asyncHandler(productController.updateProduct))
//query
router.get('/drafts/all',asyncHandler(productController.getAllDraftsForShop))
router.get('/published/all',asyncHandler(productController.getAllPublishForShop))


module.exports = router