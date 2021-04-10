const { redrawEmptyTokens } = require('./workers/redrawDroppedMint')

require('newrelic');

const dotenv = require('dotenv')
const DEFAULT_ENV = 'development';
process.env.NODE_ENV = process.env.NODE_ENV || DEFAULT_ENV
dotenv.config({path: `${__dirname}/../config/.env.${process.env.NODE_ENV}`})

console.log(process.env.INFURA_RPC_URL)

const cron = require('node-cron')
const express = require("express");
const app = express();

cron.schedule('* * * * *', async () => {
    try {
        await redrawEmptyTokens()
    } catch(e) {
        console.error(e)
    }
});

