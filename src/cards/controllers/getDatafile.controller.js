const fs = require('fs');

const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK('16c3984370294d4828c0', '3672043c01bc3257a644b78245ed973db78a7ea66cbe07bd3addc9995bcdd172');

const getURIfile = async (id) => {
    return new Promise(async (resolve, reject) => {
        const readableStreamForFile = fs.createReadStream(`src/public/meta/${id}.json`);
        // let metaFile = await fs.readFileSync(`src/public/meta/${id}.json`);
        // console.log('metaFile', metaFile)
        // let metaBuffer = new Buffer.from(metaFile);

        const options = {
            pinataMetadata: {
                name: JSON.stringify(id),
            },
            pinataOptions: {
                cidVersion: 0
            }
        };
        const file = await pinata.pinFileToIPFS(readableStreamForFile, options);
        console.log('file', file)
        try {
        

            await ipfs.files.add(metaBuffer, (err, file) => {
                if (err) {
                    console.log(err);

                }
                resolve(file)

                console.log(file)
            })
            resolve(file)
        } catch (error) {
            reject(error)
        }

    })

}


module.exports = getURIfile;