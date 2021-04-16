const db = require("../../../models");

const getLeaderboardController = async (req, res, next) => {
    try {
       const owners = await db.TokenHolder.findAll({order: [['balance', 'desc']]})

        res.json(owners);
    } catch (error) {
        next(error);
    }
};


module.exports = getLeaderboardController;
