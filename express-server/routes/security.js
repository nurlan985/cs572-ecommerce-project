const jwt = require('jsonwebtoken'),
    path = require('path'),
    config = require(path.join(__dirname, '..','config.json')),
    { ApiResponse } = require(path.join(__dirname, '..', 'models')),
    { userService } = require(path.join(__dirname, '..', 'services'));

exports.verifyToken = (req, res, next) => {
    const authorization = req.header('authorization');
    try {
        if (!authorization) {
            return res.status(401).json(new ApiResponse(401, "error", { message: "Token is not provided" }));
        }
        let authArr = authorization.split(' ');
        if(authArr.length < 2){
            return res.status(401).json(new ApiResponse(401, "error", { message: "Token is not provided" }));
        }
        const token = authorization.split(' ')[1];
        jwt.verify(token, config.SECRET_KEY, (err, verified)=>{
            if(err){
                return res.status(401).json(new ApiResponse(401, "error", { message: "Unauthorized User" }));
            }
            userService.getUserById(verified.userId)
                .then(user => {
                    req.user = user;
                    return next();
                })
                .catch(err => res.status(500).json(new ApiResponse(500, "error", err)));
        });
    } catch (err) {
        res.status(500).json(new ApiResponse(500, "error", err));
    }
}

exports.authorizeAdmin = (req, res, next) => {
    if (req.user.userType !== 'ADMIN') {
        return res.status(401).json(new ApiResponse(401, "error", { message: "Unauthorized ADMIN" }));
    }
    return next();
}
exports.authorizeSeller = (req, res, next) => {
    if (req.user.userType !== 'SELLER') {
        return res.status(401).json(new ApiResponse(401, "error", { message: "Unauthorized SELLER" }));
    }
    return next();
}
exports.authorizeBuyer = (req, res, next) => {
    if (req.user.userType !== 'BUYER') {
        return res.status(401).json(new ApiResponse(401, "error", { message: "Unauthorized BUYER" }));
    }
    return next();
}