const fs = require('fs');
// const pinataSDK = require('@pinata/sdk');
// const pinata = pinataSDK('16c3984370294d4828c0', '3672043c01bc3257a644b78245ed973db78a7ea66cbe07bd3addc9995bcdd172');
//Connceting to the ipfs network via infura gateway
const ipfsAPI = require('ipfs-api');

const ipfs = ipfsAPI('ipfs.infura.io', '5001', { protocol: 'https' })

const getURIfile = async (id) => {
    return new Promise((resolve => {

          fs.readFile(`src/public/meta/${id}.json`, async (err, data) => {
            let ipfs_url;
            if (err) {
              console.log(err)

            }
            if (data) {
              console.log('data', data)
              const image = await ipfs.add(data);
              console.log("image::::", image)
              ipfs_url = `https://ipfs.io/ipfs/${image[0].hash}`;
              console.log("Ipfs_url :::", ipfs_url);

            }
            return resolve(ipfs_url) 

          })
        
      }))


    // return new Promise(async (resolve, reject) => {
    //     // const readableStreamForFile = fs.createReadStream(`src/public/meta/${id}.json`);
    //     let metaFile = await fs.readFileSync(`src/public/meta/${id}.json`);
    //     console.log('metaFile', metaFile)
    //     let metaBuffer = new Buffer.from(metaFile);
    //     console.log('metaFile', metaBuffer)

    //     // const options = {
    //     //     pinataMetadata: {
    //     //         name: JSON.stringify(id),
    //     //     },
    //     //     pinataOptions: {
    //     //         cidVersion: 0
    //     //     }
    //     // };
    //     try {
    //         // const file = await pinata.pinFileToIPFS(readableStreamForFile, options);
    //         // console.log('file', file)

    //         await ipfs.files.add(metaBuffer, (err, file) => {
    //             if (err) {
    //                 console.log(err);

    //             }
    //             // console.log('file', file)
    //             resolve(file)

    //             console.log(file)
    //         })
    //         resolve(file)
    //     } catch (error) {
    //         reject(error)
    //     }

    // })

}


module.exports = getURIfile;