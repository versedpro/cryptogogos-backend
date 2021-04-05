const db = require("../../../../models");

const addPurchase = async (req, res, next) => {

    try {
        const { eth_address, quantity, value, status, txHash } = req.body;

        const purchase = await db.purchases.create({
            eth_address, quantity, value, status, txHash
        })

        res.json(purchase)

    } catch (error) {
        next(error)
    }

}


module.exports = addPurchase;