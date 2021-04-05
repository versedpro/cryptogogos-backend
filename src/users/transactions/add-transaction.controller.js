const db = require("../../../models");

const addTransactions = async (req, res, next) => {

    try {
        const { eth_address, quantity, value, status, txHash, tokenId } = req.body;

        const transaction = await db.purchases.create({
            eth_address, quantity, value, status, txHash, tokenId
        })
        const updateToken = await db.tokens.update({
            minted: true,
        }, {
            where: {
                tokenId: tokenId
            }
        })
        const user = await db.user.findOne({
            where: { eth_address }

        })
        const updateUser = await db.user.update({
            total_purcahses: user.total_purcahsesn + 1,
        }, {
            where: { eth_address }
        })

        res.json(transaction).status(200);

    } catch (error) {
        next(error)
    }

}


module.exports = addTransactions;