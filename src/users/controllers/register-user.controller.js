const db = require("../../../models");

const registerUser = async (req, res, next) => {
try {
    const eth_address = req.body.address;

    let user = await db.user.findOne({
        where: {eth_address}
    })

    if(!user){
         user = await db.user.create({
            eth_address,
            total_purcahses: 0,            
        })
    }
    
    res.json(user);
    
} catch (error) {
    next(error)
}
}


module.exports = registerUser;