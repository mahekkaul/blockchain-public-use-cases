const contractAddress = "0x2346025c4660Fdc90EbE62b0c9A1Ec6a7EA1FDB0"; // Replace with your actual contract address
const contractABI = [[
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "skills",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "experience",
				"type": "uint256"
			}
		],
		"name": "registerApplicant",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "applicants",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "skills",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "experience",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getApplicantCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getApplicants",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "skills",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "experience",
						"type": "uint256"
					}
				],
				"internalType": "struct ApplicantRegistry.Applicant[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]];

const web3 = new Web3(window.ethereum);
const contract = new web3.eth.Contract(contractABI, contractAddress);

async function getAccount() {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return accounts[0];

}

async function addApplicant() {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    await contract.methods.addApplicant("John Doe", "Plumbing").send({ from: accounts[0] });
    alert("Applicant added!");
}

async function addJob() {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    await contract.methods.addJob("Electrician", "Fix home wiring", 5000).send({ from: accounts[0] });
    alert("Job posted!");
}

window.addEventListener('load', async () => {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log("MetaMask connected.");
        } catch (err) {
            alert("Please connect MetaMask.");
        }
    }
});
