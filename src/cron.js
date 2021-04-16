require('newrelic');

const { redrawEmptyTokens } = require('./workers/redrawDroppedMint')
const { fetchHolders } = require('./workers/leaderboard')


const dotenv = require('dotenv')
const DEFAULT_ENV = 'development';
process.env.NODE_ENV = process.env.NODE_ENV || DEFAULT_ENV
dotenv.config({path: `${__dirname}/../config/.env.${process.env.NODE_ENV}`})

const db = require('../models')
const Web3 = require('web3')
const web3 = new Web3(process.env.INFURA_RPC_URL)
const gogoABI = require('./data/CryptoGogoABI.json')
const contract = new web3.eth.Contract(gogoABI, process.env.CONTRACT_ADDRESS)


console.log(process.env.INFURA_RPC_URL)
console.log('Running script in ENV: ' + process.env.NODE_ENV)
console.log('infura: ' + process.env.INFURA_RPC_URL)
console.log('database: ' + db.sequelize.config.host, db.sequelize.config.database)
console.log('contract: ' + process.env.CONTRACT_ADDRESS)



const cron = require('node-cron')

cron.schedule('*/5 * * * *', async () => {
    try {
        await redrawEmptyTokens({db, contract, web3})
    } catch(e) {
        console.error(e)
    }
});


cron.schedule('0/5 0 * * *', async () => {
    try {
        await fetchHolders({db, contract, web3})
    } catch(e) {
        console.error(e)
    }
});
