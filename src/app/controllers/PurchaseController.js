const Ad = require('../models/Ad')
const User = require('../models/User')
const Purchase = require('../models/Purchase')
const PurchaseMail = require('../jobs/PurchaseMail')
const Queue = require('../services/Queue')

class PurchaseController {
  async store (req, res) {
    const { ad, content } = req.body
    const purchaseAd = await Ad.findById(ad).populate('author')
    const user = await User.findById(req.userId)

    Queue.create(PurchaseMail.key, {
      ad: purchaseAd,
      user,
      content
    }).save()

    const { _id } = user

    const purchase = await Purchase.create({ ad, content, user: _id })

    return res.json(purchase)
  }

  async purchased (req, res) {
    const { purchaseId } = req.body
    const { ad } = await Purchase.findById(purchaseId)

    const purchased = await Ad.findByIdAndUpdate(ad, {
      purchasedBy: purchaseId
    })

    const newAd = await Ad.findById(ad)

    return res.json(newAd)
  }
}

module.exports = new PurchaseController()
