const db = require("../../../models");

const addTransactions = async (req, res, next) => {
  try {
    const { eth_address, quantity, value, status, txHash, tokenIds } = req.body;

    const transaction = await db.transactions.create({
      eth_address,
      quantity,
      value,
      status,
      txHash,
      tokenIds,
    });

    for (let tid of tokenIds) {
      const currentToken = await db.tokens.findOne({
        where: {
          token_id: tid,
        },
      });
      console.log("tokenId", currentToken);
      const updateToken = await db.tokens.update(
        {
          minted: true,
          owner_address: eth_address,
        },
        {
          where: {
            token_id: tid,
          },
        }
      );

      console.log("update".updateToken);

      // const token = await db.tokens.findOne({
      //   where: {
      //     token_id: tokenId,
      //   },
      // });
      // console.log("token", token);

      const card = await db.cards.findOne({
        where: {
          serial_number: currentToken.serial_number,
        },
      });

      let updateSupply = await db.cards.update(
        {
          current_supply: card.current_supply + 1,
        },
        {
          where: {
            id: card.id,
          },
        }
      );

      const user = await db.user.findOne({
        where: { eth_address },
      });
      const updateUser = await db.user.update(
        {
          total_purcahses: user.total_purcahses + 1,
        },
        {
          where: { eth_address },
        }
      );
    }

    res.json(transaction).status(200);
  } catch (error) {
    next(error);
  }
};

module.exports = addTransactions;
