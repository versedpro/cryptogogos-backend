const db = require("../../../models");
const Web3 = require('web3');
const gogoABI = require("../../data/CryptoGogoABI.json");
const gogoAddress = "0xadcEf2c8fA1E93C97C0B5718d590cD5112b93bf7";

const singleMint = async (req, res, next) => {
  try {
    
    const {user_address, token_id, signature} = req.body;
    if (!user_address || !token_id || !signature) {
      return res.status(400).json({status: false, err: 'Invalid request'});
    }

    const request = await db.drawrequests.findAll({
      where: {
        user_address: user_address,
        signature: signature
      },
    });

    if(!request.length) return res.status(400).json({status: false, err: 'Invalid request'});

    const web3 = new Web3(process.env.INFURA_RPC_URL);
    const gogoContract = new web3.eth.Contract(gogoABI, gogoAddress);
    const owner = await gogoContract.methods.ownerOf(token_id).call();

    if(owner != user_address)  return res.status(400).json({status: false, err: 'Invalid request'});

    const tokens = await db.tokens.findAll({
      where: {
        minted: false,
      },
    });
    const rand = parseInt(Math.random() * 10000000000) % tokens.length;

    await db.tokens.update({minted: true, token_id: token_id, owner_address: user_address}, {
        where: {
        id: tokens[rand].id
      }
    });
    res.json(rand).status(200);
  } catch (error) {
    next(error);
  }
};

const packMint = async (req, res, next) => {
  try {
    
    const {user_address, token_id, signature} = req.body;
    if (!user_address || !token_id || !signature) {
      return res.status(400).json({status: false, err: 'Invalid request'});
    }

    const request = await db.drawrequests.findAll({
      where: {
        user_address: user_address,
        signature: signature
      },
    });

    if(!request.length) return res.status(400).json({status: false, err: 'Invalid request'});

    const web3 = new Web3(process.env.INFURA_RPC_URL);
    const gogoContract = new web3.eth.Contract(gogoABI, gogoAddress);
    const owner = await gogoContract.methods.ownerOf(token_id).call();

    if(owner != user_address)  return res.status(400).json({status: false, err: 'Invalid request'});

    const tokens = await db.tokens.findAll({
      where: {
        minted: false,
      },
    });
    const rand = parseInt(Math.random() * 10000000000) % tokens.length;

    await db.tokens.update({minted: true, token_id: token_id, owner_address: user_address}, {
        where: {
        id: tokens[rand].id
      }
    });
    res.json(rand).status(200);
  } catch (error) {
    next(error);
  }
};

const startMint = async (req, res, next) => {
  try {
    console.log(req.body.user_address)
    const {user_address, token_id} = req.body;
    const signature = parseInt(Math.random()*10000000000)%999999999;
    await db.drawrequests.create({user_address, token_id, signature});

    return res.json({signature}).status(200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  startMint,
  singleMint,
  packMint
};
