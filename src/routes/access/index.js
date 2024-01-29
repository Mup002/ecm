'use strict'

const express = require('express')
const accessController = require('../../controller/access.controller')
const router = express.Router()
const {asyncHandler} = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/authUtils')
//sign Up
router.post('/shop/signup', asyncHandler(accessController.signUp))
router.post('/shop/login', asyncHandler(accessController.login))
///authentiction
router.use(authentication)
router.post('/shop/logout', asyncHandler(accessController.logout))
module.exports = router