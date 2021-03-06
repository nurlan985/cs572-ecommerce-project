const path = require('path'),
    userService = require(path.join(__dirname, 'user.service')),
    authService = require(path.join(__dirname, 'auth.service')),
    orderService = require(path.join(__dirname, 'order.service')),
    productService = require(path.join(__dirname, 'product.service')),
    categoryService = require(path.join(__dirname, 'category.service')),
    addressService = require(path.join(__dirname, 'address.service')),
    cashbackService = require(path.join(__dirname, 'cashback.service')),
    reviewService = require(path.join(__dirname, 'review.service'));

module.exports = {
    authService,
    userService,
    orderService,
    productService,
    categoryService,
    addressService,
    reviewService,
    cashbackService
}