const data = require("../../data/cards.json");
const db = require("../../../models")

const generateCards = async (req, res, next) => {
//  try {
//     const dataArr = data

//     if(dataArr) {
//         for(let card of dataArr){
//             console.log("SERIAL", card.serial_number)
//             card.serial_number = +card.serial_number
//             card.current_supply = 0
//             card.total_supply = +card.total_supply
//             card.serial_number = +card.serial_number
//             card.chance = +card.chance

            

//             const dbCard = await db.cards.create(card);
//         }
//     }

//     const cards = await db.cards.findAll();

//     res.json(cards).status(200);
//  } catch (error) {
//      next(error)
//  }
}


module.exports = generateCards;