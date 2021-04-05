const fs = require('fs');
const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK('16c3984370294d4828c0', '3672043c01bc3257a644b78245ed973db78a7ea66cbe07bd3addc9995bcdd172');

const getURIfile = (req, res, next) => {
    try {
        const {id} = req.body;
        console.log('hit', id)
        const readableStreamForFile = fs.createReadStream(`src/public/meta/${id}.json`);
const options = {
    pinataMetadata: {
        name: id,
    },
    pinataOptions: {
        cidVersion: 0
    }
};
pinata.pinFileToIPFS(readableStreamForFile, options).then((result) => {
    //handle results here
    console.log(result);
    res.json(result)
}).catch((err) => {
    //handle error here
    console.log(err);
});
    } catch (error) {
        next(error)
    }

    
}


module.exports = getURIfile;