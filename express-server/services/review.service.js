const path = require("path");
const { ObjectId } = require('mongodb');
const {
    Product,
    Order,
    OrderStatus,
} = require(path.join(__dirname, "..", "models"));

exports.getOrdersByBuyerIdMatchWithProductIdDelivered = (buyerId, productId) => {
    return Order.find({'buyerId': buyerId, 'products.product.productId': productId, status: OrderStatus.DELIVERED});
};

exports.getProductByUserId = (buyerId, productId) => {
    return Product.aggregate([
        {$match: {_id: new ObjectId(productId)}},
        {$match: {'reviews.buyer.buyerId': buyerId}}
    ]);
}

exports.removeReview = (buyerId, productId) => {
    return Product.updateOne(
        { _id : new ObjectId(productId)},
        { $pull: {"reviews": {"buyer": {"buyerId":  new ObjectId(buyerId)}}}},
        { safe: true, multi:true }
    )
}

exports.pushReview = (buyerId, productId, newReview) => {
    return Product.updateOne({ _id : new ObjectId(productId)}, { $push: {"reviews": newReview}})
}


