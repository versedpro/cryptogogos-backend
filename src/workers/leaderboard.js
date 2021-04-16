const fetchHolders = async ({ contract, db, web3 }) => {
    console.log('[*] Running leaderboard worker')
    const totalSupply = await contract.methods.totalSupply().call()
    const owners = {}
    for(let i =0;i<totalSupply;i++){
        const tokenId = await contract.methods.tokenByIndex(i).call()
        const owner = await contract.methods.ownerOf(tokenId).call()
        owners[owner] = owners[owner] ?  owners[owner] + 1 : 1
    }

    await db.TokenHolder.destroy({truncate: true, cascade: false})

    for(let [k,v] of Object.entries(owners))
        await db.TokenHolder.create({
            owner_address: k,
            balance: v
        })

    console.log('[*] Done leaderboard worker')
}

module.exports = { fetchHolders }
