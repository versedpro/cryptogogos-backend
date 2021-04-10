const db = require('../../models')

process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const dotenv = require('dotenv')
dotenv.config({
    path: `${__dirname}/../../config/.env.${process.env.NODE_ENV}`
})
const { Op } = require('sequelize')

const Web3 = require('web3')
const gogoABI = require('../data/CryptoGogoABI.json')

console.log('Running script in ENV: ' + process.env.NODE_ENV)
console.log('infura: ' + process.env.INFURA_RPC_URL)
console.log('database: ' + db.config)
console.log('contract: ' + process.env.CONTRACT_ADDRESS)

const web3 = new Web3(process.env.INFURA_RPC_URL)
const gogoContract = new web3.eth.Contract(gogoABI, process.env.CONTRACT_ADDRESS)

const whenWasTokenMinted = async tokenId => {
    const transfers = await gogoContract.getPastEvents('Transfer', {
        fromBlock: 0,
        toBlock: 'latest',
        filter: { tokenId: '' + tokenId },
        topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef']
    })

    const transferEv = transfers.filter(t => t.returnValues['tokenId'] === tokenId + '')[0]
    console.log(transferEv)
    const tx = await web3.eth.getTransaction(transferEv.transactionHash)
    console.log(tx)
    const time = await web3.eth.getBlock(tx.blockNumber)
    const diff = new Date().getTime() - time.timestamp * 1000

    const minutes = diff / 1000 / 60
    return { minutesAgo: minutes, ownerAddress: tx.from }
}

const draw = async () => {
    const availableTokens = await db.tokens.findAll({
        attributes: ['id'],
        where: {
            minted: false,
            token_id: {
                [Op.is]: null
            }
        }
    })
    const rand = parseInt(Math.random() * 10000000000) % availableTokens.length
    return db.tokens.findByPk(availableTokens[rand].dataValues.id)
}



const redrawEmptyTokens = async () => {
    const mintedTokens = await db.tokens.findAll({
        attributes: ['id'],
        where: {
            minted: true,
            token_id: {
                [Op.not]: null
            }
        }
    })

    const totalSupply = await gogoContract.methods.totalSupply().call()

    console.log('[*] Metadata tokens: ' + mintedTokens.length)
    console.log('[*] totalSupply: ' + totalSupply)

    if (mintedTokens.length > totalSupply)
        throw new Error(
          'Tokens with metadata are more than minted tokens. ANOMALY! SOMETHING FISHY'
        )

    if (totalSupply > mintedTokens.length) {
        for (let i = 0; i < totalSupply; i++) {
            const tokenId = await gogoContract.methods.tokenByIndex(i).call()
            const hasMeta = await db.tokens.count({
                where: {
                    token_id: tokenId + ''
                }
            })
            if (!hasMeta) {
                const { minutesAgo, ownerAddress } = await whenWasTokenMinted(tokenId)

                console.log('[*] Found token without metadata. Id = ' + tokenId + ` address: ${ownerAddress} (${minutesAgo.toFixed()} minutes ago)`)
                console.log('[*] Getting token transaction from contract...')
                console.log(`[*] token was minted ${minutesAgo} minutes ago...`)
                console.log(`[*] Redrawing for token: ${tokenId}`)
                let drawnGogo = await draw()
                console.log(`[*] confirming that gogo is available...`)
                while (drawnGogo.token_id || drawnGogo.minted || drawnGogo.owner_address) {
                    console.log(`[*] Gogo not available, moving to next`)
                    drawnGogo = await draw()
                }
                console.log(`[*] Gogo is available...`)
                console.log(`[*] Drawed Gogo: ${JSON.stringify(drawnGogo.name)}`)

                if (minutesAgo > 5) {

                    console.log(`[*] Setting Gogo (id=${drawnGogo.id}) owner to minter with address ${ownerAddress}`)
                    await db.tokens.update({
                        minted: true,
                        token_id: tokenId + '',
                        owner_address: ownerAddress
                    }, { where: { id: drawnGogo.id } })
                } else {
                    console.log(`[*] Token with id ${tokenId} was minuted less than 5 minutes ago..Skipping`)
                }

            }

        }

        console.log(`[*] Done`)
    }
}

module.exports = { redrawEmptyTokens }
