const path = require("path");
const { Buyer } = require(path.join(__dirname, "..", "models"));
const ApiResponse = require('./viewmodels/ApiResponse');

exports.getAllBillingInfo = (req, res, next) => {
    Buyer.findById(req.user._id)
      .then((buyer) => {
        res.status(200).json(new ApiResponse(200, "success", buyer.billingInfo));
      })
      .catch((err) => res.status(500).send(new ApiResponse(500, "error", err)));
  };
  
  exports.addBillingInfo = (req, res, next) => {
    Buyer.findById(req.user._id)
      .then((buyer) => {
        let address = buyer.addresses.find(a=>a._id.toString() === req.body.billingAddressId);
        buyer.billingInfo.push({
          cardNumber: req.body.cardNumber,
          cardName: req.body.cardName,
          expirationDate: req.body.expirationDate,
          securityCode: req.body.securityCode,
          billingAddress: {
            zipCode: address.zipCode,
            street: address.street,
            city: address.city,
            state: address.state,
            phoneNumber: address.phoneNumber,
            country: address.country,
          },
        });
        return buyer.save();
      })
      .then(() => {
        res.status(200).json(
          new ApiResponse(200, "success", {
            success: "billing info saved to a particular buyer",
          })
        );
      })
      .catch(next);
  };
  
  exports.deleteBillingInfo = (req, res, next) => {
    Buyer.findById(req.user._id)
      .then((buyer) => {
        buyer.billingInfo = buyer.billingInfo.filter((billingInfo) => {
          return billingInfo._id != req.params.id;
        });
        return buyer.save();
      })
      .then(() => {
        res
          .status(200)
          .json(
            new ApiResponse(200, "success", { success: "billingInfo deleted" })
          );
      })
      .catch((err) => {
        res.status(500).send(new ApiResponse(500, "error", err));
      });
  };
  
  exports.getBillingInfoDetail = async (req, res, next) => {
    try {
      const currentBuyer = await Buyer.findById(req.user._id);
      if (currentBuyer) {
        let billingInfoDetail = currentBuyer.billingInfo.filter((billingInfo) => {
          return billingInfo._id == req.params.id;
        })[0];
        res.status(200).send(new ApiResponse(200, "success", billingInfoDetail));
      } else {
        res
          .status(401)
          .send(new ApiResponse(401, "error", { err: "buyer not exist" }));
      }
    } catch (err) {
      res.status(500).send(new ApiResponse(500, "error", err));
    }
  };
  
  exports.editBillingInfo = (req, res, next) => {
    Buyer.findByIdAndUpdate(req.user._id)
      .then((buyer) => {
        let billingInfoDetail = buyer.billingInfo.find((billingInfo) => {
          return billingInfo._id.toString() === req.params.id;
        });
        billingInfoDetail.cardNumber = req.body.cardNumber;
        billingInfoDetail.cardName = req.body.cardName;
        billingInfoDetail.expirationDate = req.body.expirationDate;
        billingInfoDetail.securityCode = req.body.securityCode;
        billingInfoDetail.billingAddress = {
          zipCode: req.body.billingAddress.zipCode,
          street: req.body.billingAddress.street,
          city: req.body.billingAddress.city,
          state: req.body.billingAddress.state,
          phoneNumber: req.body.billingAddress.phoneNumber,
          country: req.body.billingAddress.country,
        };
        buyer.billingInfo.forEach((billingInfo) => {
          if (billingInfo._id.toString() === req.params.id) {
            billingInfo = billingInfoDetail;
          }
        });
        return buyer.save();
      })
      .then(() => {
        res
          .status(200)
          .json(
            new ApiResponse(200, "success", { success: "billingInfo updated" })
          );
      })
      .catch((err) => {
        res.status(500).json(new ApiResponse(500, "error", err));
      });
  };