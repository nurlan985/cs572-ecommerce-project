const ApiResponse = require('./viewmodels/ApiResponse');
const { productService } = require('../services');
const upload = require('../_helpers/storage');
const fs = require('fs');
const path = require('path');

exports.getProducts = function (req, res, next) {
    productService.getProducts(req.query.categoryId, req.query.pageNumber, req.query.pageSize)
        .then((pagedDto) => res.status(200).json(new ApiResponse(200, 'The products were found succesfully.', pagedDto)))
        .catch(next);
}

exports.getProduct = function (req, res, next) {
    productService.getProduct(req.params.id)
        .then((product) => res.status(200).json(new ApiResponse(200, 'The product was found succesfully.', product)))
        .catch(next);
}

exports.createProduct = [
    upload.single('myFile'),
    function (req, res, next) {
        const product = productService.createProduct(req.body.title, req.body.categoryId, req.body.price, req.filename, req.body.description, req.user.id);
        res.status(200).json(new ApiResponse(200, 'The product was created succesfully.', product));
    }
]

exports.editProduct = [
    upload.single('myFile'),
    function (req, res, next) {
        console.log("body:", req.body);
        productService.editProduct(req.params.id, req.body.title, req.body.categoryId, req.body.price, req.filename, req.body.description)
            .then((product) => res.status(200).json(new ApiResponse(200, 'The product was updated succesfully.', product)))
            .catch(next);
    }
]

exports.deleteProduct = function (req, res, next) {
    productService.deleteProduct(req.params.id)
        .then((product) => res.status(200).json(new ApiResponse(200, 'The product was deleted succesfully.', product)))
        .catch(next);
}

exports.getImage = function (req, res, next) {
    const filename = req.params.name;
    const filePath = path.join(__dirname, '..', '_uploads', filename);
    const readStream = fs.createReadStream(filePath);

    readStream.on('open', function () {
        readStream.pipe(res);
    });

    readStream.on('error', err => next(err));
}

exports.getProductsBySellerId = function (req, res, next) {
    productService.getProductsBySellerId(req.params.id)
        .then((products) => {
            res.status(200).json(new ApiResponse(200, 'seller products success', products))
        })
        .catch(next);
}