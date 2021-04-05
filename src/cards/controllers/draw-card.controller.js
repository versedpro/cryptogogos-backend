const db = require("../../../models")
const fs = require('fs');
const path = require("path")
const axios = require('axios')
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
                        trait_type: "Total Supply",
                        value: cad.total_supply,
                    },
                    {
                        trait_type: "Token#",
                        value: cad.supply_id,
                    }
                ]
            }

            const json = JSON.stringify(obj, null, 4);
            fs.writeFile(
                `src/public/meta/${cad.token_id}.json`,
                json, (err) => {
                    if (err) console.log(err)
                }
            );

            // let uploadData = new FormData();

            // const options = {
            //     pinataMetadata: {
            //         name: cad.token_id,
            //     },
            //     pinataOptions: {
            //         cidVersion: 0
            //     }
            // };

            // uploadData.append('pinataMetadata', JSON.stringify(options));

            // const file = fs.createReadStream(`metadatas/${cad.token_id}.json`);
            // uploadData.append('file', file)


            // const pinataOptions = JSON.stringify({
            //     cidVersion: 0,
            //     customPinPolicy: {
            //         regions: [
            //             {
            //                 id: 'FRA1',
            //                 desiredReplicationCount: 1
            //             },
            //             {
            //                 id: 'NYC1',
            //                 desiredReplicationCount: 2
            //             }
            //         ]
            //     }
            // });
            // uploadData.append('pinataOptions', pinataOptions);

            // const fd =  await axios.post(url, uploadData, {
            //     headers: {
            //         'Content-Type': `multipart/form-data; boundary=${uploadData._boundary}`,
            //         pinata_api_key: '16c3984370294d4828c0',
            //         pinata_secret_api_key: '3672043c01bc3257a644b78245ed973db78a7ea66cbe07bd3addc9995bcdd172'
            //     }
            // });

            finalCards.push(cad)
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