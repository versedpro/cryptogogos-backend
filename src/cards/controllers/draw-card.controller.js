const db = require("../../../models")
const fs = require('fs');
const path = require("path")
const axios = require('axios');
const getURIfile = require("./getDatafile.controller");
const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

const drawCard = async (req, res, next) => {
    try {
        const cards = await db.cards.findAll({
            where: {
                released: true
            }
        });

        let quantity = 1;
        if (req.body.quantity) {
            quantity = req.body.quantity
        }
        const itemDrps = new WeightedRandomBag();
        const selectedCards = [];

        for (let i = 0; i < cards.length; i++) {
            itemDrps.addEntry(cards[i], cards[i].chance);
        }
        // let current = itemDrps.getRandom();  


        // drawing random entries from it
        for (let i = 0; i < quantity; i++) {
            let current = itemDrps.getRandom();

            if (current.current_supply === current.total_supply) {
                i--;
            } else {


                let currentCard = await db.tokens.findOne({
                    where: {
                        serial_number: current.serial_number,
                        type: current.type,
                        supply_id: current.current_supply + 1
                    },
                });
                if (currentCard) {
                    if (currentCard.minted) {
                        console.log('minted')
                        i--;
                        console.log('hit inside')
                    } else {
                        console.log('hit')
                        let updateSupply = await db.cards.update({
                            current_supply: current.current_supply + 1,
                        }, {
                            where: {
                                id: current.id
                            }
                        })
                        selectedCards.push(currentCard);
                    }
                }

            }
        }
        const finalCards = [];
        for (let cad of selectedCards) {

            const obj = {

                name: cad.name,
                description: "",
                image: cad.image,
                attributes: [
                    {
                        trait_type: "Tribe",
                        value: cad.tribe,
                    },
                    {
                        trait_type: "Tier",
                        value: cad.type,
                    },
                    {
                        display_type: "number",
                        trait_type: "Total Available",
                        value: cad.supply_id,
                        max_value: cad.total_supply
                    },
                    {
                        display_type: "number",
                        trait_type: "Serial No.",
                        value: cad.supply_id,
                        max_value: cad.total_supply
                    }
                ]
            }

            const json = JSON.stringify(obj, null, 4);
            await fs.writeFile(
                `src/public/meta/${cad.token_id}.json`,
                json, (err) => {
                    if (err) console.log(err)
                }
            );

            const uadd = await getURIfile(cad.token_id);
            const finalCard = {
                card: cad,
                image: uadd
            }
            finalCards.push(finalCard)
        }
        res.json(finalCards);

    } catch (error) {
        next(error)
    }


}


const WeightedRandomBag = function () {
    var entries = [];
    var accumulatedWeight = 0.98;

    this.addEntry = function (object, weight) {
        accumulatedWeight += weight;
        entries.push({ object: object, accumulatedWeight: accumulatedWeight });
    };
    this.entries = entries;
    this.getRandom = function () {
        var r = Math.random() * accumulatedWeight;
        return entries.find(function (entry) {
            return entry.accumulatedWeight >= r;
        }).object;
    };
};



module.exports = drawCard;