const db = require('../../../models');
const data = require('../../data/tokens_data.json')
const generateTokens =  async (req, res, next) => {

try {
    const dataArr = JSON.parse(JSON.stringify(data));

    if(dataArr) {
        for(let token of dataArr){
            token.serial_number = Number(token.serial_number);
            token.current_supply = Number(token.current_supply);
            token.total_supply = Number(token.total_supply);
            token.serial_number = Number(token.serial_number);

            const dbToken = await db.tokens.create(token);
        }
    }



    const tokens = await db.tokens.findAll();
    res.json(tokens).status(200)
    
} catch (error) {
    next(error)
}

}


module.exports = generateTokens;