const Joi = require('joi')

module.exports = {
  body: {
    purchaseId: Joi.string().required()
  }
}
