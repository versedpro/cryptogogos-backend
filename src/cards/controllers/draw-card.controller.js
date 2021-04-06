const db = require("../../../models");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const getURIfile = require("./getDatafile.controller");
const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK('16c3984370294d4828c0', '3672043c01bc3257a644b78245ed973db78a7ea66cbe07bd3addc9995bcdd172');

const drawCard = async (req, res, next) => {
  try {
    const cards = await db.cards.findAll({
      where: {
        released: true,
      },
    });
    let quantity = 1;
    if (req.body.quantity) {
      quantity = req.body.quantity;
    }
    const itemDrps = new WeightedRandomBag();
    const selectedCards = [];
    console.log('length', cards.length)

    // for (let i = 0; i < cards.length; i++) {
    //     itemDrps.addEntry(cards[i], cards[i].chance);
    // }
    // let current = itemDrps.getRandom();

    // drawing random entries from it
    for (let i = 0; i < quantity; i++) {
      let current = pick(cards);
        // console.log('current', current)
      if (current.current_supply === current.total_supply) {
          console.log('hit')
        i--;
      } else {
        let currentCard = await db.tokens.findOne({
          where: {
            serial_number: current.serial_number,
            type: current.type,
            supply_id: current.current_supply + 1,
          },
        });
        if(currentCard === null) {
            i--;
        }

        if (currentCard) {
          if (currentCard.minted) {
            console.log("minted");
            i--;
          } else {
     
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
            max_value: cad.total_supply,
          },
          {
            display_type: "number",
            trait_type: "Serial No.",
            value: cad.serial_number,
            max_value: 60,
          },
        ],
      };

      const json = JSON.stringify(obj, null, 4);
      const options = {
        pinataMetadata: {
            name: 'meta',
        },
        pinataOptions: {
            cidVersion: 0
        }
    };
    const file = await pinata.pinJSONToIPFS(obj, options);
      const finalCard = {
        card: cad,
        meta: `https://gateway.pinata.cloud/ipfs/${file.IpfsHash}` 
      };
      finalCards.push(finalCard);
    }
    res.json(finalCards);
  } catch (error) {
    next(error);
  }
};

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

const weight = (arr) => {
  return [].concat(
    ...arr.map((obj) => Array(Math.ceil(obj.chance * 100)).fill(obj))
  );
};
const pick = (arr) => {
    console.log(arr.length)
  let weighted = weight(arr);
  console.log(weighted.length)
  return weighted[Math.floor(Math.random() * weighted.length)];
};
module.exports = drawCard;
