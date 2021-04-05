const db = require("../../../models")

const getPackPrice = async (req, res, next) => {
try {
    const txs = await db.transactions.findAll();
    let price;
    if (txs.length < 150){
        price = 0.05;
    } else if( txs.length > 150 && txs.length < 300) {
        price = 0.07;
    } else if(txs.length > 300 && txs.length < 1150){
        price = 0.1;

    } else if(txs.length > 1150 && txs.length < 3150){
        price = 0.15;

    }else if(txs.length > 3175 && txs.length < 7150){
        price = 0.15;

    }else if(txs.length > 7150 && txs.length < 7777){
        price = 1;

    }

    res.json(price)
} catch (error) {
    next(error)
}

}

module.exports = getPackPrice;