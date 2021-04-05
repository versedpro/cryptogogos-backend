const data = require("../../data/cards.json");
const db = require("../../../models")

const generateCards = async (req, res, next) => {
 try {
    const dataArr = JSON.parse(JSON.stringify(data));

    if(dataArr) {
        for(let card of dataArr){
            card.serial_number = Number(card.serial_number);
            card.current_supply = Number(card.current_supply);
            card.total_supply = Number(card.total_supply);
            card.serial_number = Number(card.serial_number);
            card.chance = Number(card.chance);

            const dbCard = await db.cards.create(card);
        }
    }

    const cards = await db.cards.findAll();

    res.json(cards).status(200);
 } catch (error) {
     next(error)
 }
}


module.exports = generateCards;