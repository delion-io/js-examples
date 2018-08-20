const iotaCore = require('@iota/core')
const httpClient =require('@iota/http-client')
const iotaValidators = require('@iota/validators')
const transactionConverter = require('@iota/transaction-converter')
const delionCurl = require('delion-curl-remote');

// must be truly random & 81-trytes long
const seed = '...seed...'

// Array of transfers which defines transfer recipients and value transferred in IOTAs.
const transfers = [{
    address: 'FJHSSHBZTAKQNDTIKJYCZBOZDGSZANCZSWCNWUOCZXFADNOQSYAHEJPXRLOVPNOQFQXXGEGVDGICLMOXX',
    value: 0, // 1Ki
    tag: 'TESTTAG999', // optional tag of `0-27` trytes
    message: 'DELIONPOWEXAMPLE' // optional message in trytes
}]

// Depth or how far to go for tip selection entry point
const depth = 5

// Difficulty of Proof-of-Work required to attach transaction to tangle.
// Minimum value on mainnet `14`
const minWeightMagnitude = 14

//IRI Node/Provider
const provider='...http/https provider...'

//init IOTA Client
const iotaClient = httpClient.createHttpClient({
    provider: provider
})

//Delion API username(email/username)
const delionUser='...username...'

//Delion API user password
const delionPassword='...password...'

//patch attachToTagle
delionCurl(iotaClient,iotaValidators,transactionConverter, delionUser,delionPassword);

//create iota methods 
const getNodeInfo = iotaCore.createGetNodeInfo(iotaClient)
const prepareTransfers = iotaCore.createPrepareTransfers()
const getTransactionsToApprove =iotaCore.createGetTransactionsToApprove(iotaClient)
//bind overriden ATT function
const attachToTangle =iotaClient.attachToTangle
const sendTrytes =iotaCore.createSendTrytes(iotaClient,attachToTangle)

console.log("create and send simple transaction")
writeTransaction(depth,minWeightMagnitude,seed,transfers).then(() => {
	console.log("transaction was saved in the tangle")
});

/* 
//Get node info example
getNodeInfo()
    .then(info => console.log(info))
    .catch(err => {});
*/


async function writeTransaction(depth, minWeightMagnitude, seed,transfers){
	//prepare trytes
	const trytes=await prepareTransfers(seed, transfers)
	//get transactions to approve
	const trunkAndBranch= await getTransactionsToApprove(depth)
	//send trytes
	const sendTrytesResp=await sendTrytes(trytes, depth, minWeightMagnitude)
}

