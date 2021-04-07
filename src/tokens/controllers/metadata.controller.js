const db = require("../../../models");

const metaDataController = async (req, res, next) => {
  try {
    const id = req.params.id;

    const token = await db.tokens.findOne({
      where: {
        token_id: id,
      },
    });
    if (!token) return res.json({}).status(200);
    console.log('token', token)
    const metadata = {
      name: token.name,
      description: "",
      image: token.image,
      attributes: [
        {
          trait_type: "Tribe",
          value: token.tribe,
        },
        {
          trait_type: "Tier",
          value: token.type,
        },
        {
          display_type: "number",
          trait_type: "Total Available",
          value: token.supply_id,
          max_value: token.total_supply,
        },
        {
          display_type: "number",
          trait_type: "Serial No.",
          value: token.serial_number,
          max_value: 60,
        },
      ],
    };

    res.json(metadata);
  } catch (error) {
    next(error);
  }
};


module.exports = metaDataController;