const contractAddress = "0xA01eBDEDAdaf30a4DdeFe55d4fCBB7Dd3E9eB1B5";
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "completeLC",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "LCCompleted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "buyer",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "seller",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "bank",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "status",
				"type": "string"
			}
		],
		"name": "LCRequested",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_buyer",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_seller",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_bank",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "requestLC",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllLCs",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "buyer",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "seller",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "bank",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "status",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "issuer",
						"type": "address"
					}
				],
				"internalType": "struct TradeFinance.LetterOfCredit[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "lcCounter",
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
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "lcs",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "buyer",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "seller",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "bank",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "status",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "issuer",
				"type": "address"
			}
		],
		"stateMutability": "view",
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
		"name": "lcToOwner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

let web3;
let contract;
let accounts;

async function initWeb3() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        accounts = await web3.eth.getAccounts();
        contract = new web3.eth.Contract(contractABI, contractAddress);
        console.log("Connected to MetaMask:", accounts[0]);
    } else {
        alert("Please install MetaMask to use this application.");
    }
}

async function requestLC(buyer, seller, bank, amount) {
    if (!web3) {
        await initWeb3();
    }

    try {
        await contract.methods.requestLC(buyer, seller, bank, amount).send({
            from: accounts[0],
            gas: 3000000
        });
        alert("LC Requested Successfully!");
    } catch (error) {
        console.error("Transaction failed:", error);
    }
}
async function fetchLCs() {
    const accounts = await ethereum.request({ method: "eth_accounts" });
    const userAddress = accounts[0];

    const lcCount = await contract.methods.lcCounter().call();
    let allLCs = [];

    for (let i = 1; i <= lcCount; i++) {
        const lc = await contract.methods.lcs(i - 1).call();
        allLCs.push(lc);
    }

    // Filter LCs
    let pendingLCs = allLCs.filter(lc => lc.status === "Pending");
    let completedLCs = allLCs.filter(lc => lc.status === "Completed");

    // Update View LC Page
    updateViewLCPage(pendingLCs, completedLCs);

    // Update Dashboard
    updateDashboard(completedLCs);
}

function updateViewLCPage(pendingLCs, completedLCs) {
    let lcContainer = document.getElementById("viewLCContainer");
    lcContainer.innerHTML = "<h2>Pending LCs</h2>";

    pendingLCs.forEach(lc => {
        lcContainer.innerHTML += `
            <div class="lc-card">
                <p><strong>Buyer:</strong> ${lc.buyer}</p>
                <p><strong>Seller:</strong> ${lc.seller}</p>
                <p><strong>Bank:</strong> ${lc.bank}</p>
                <p><strong>Amount:</strong> ${lc.amount} ETH</p>
                <p><strong>Status:</strong> ${lc.status}</p>
                <button onclick="completeLC(${lc.id})">Mark as Completed</button>
            </div>
        `;
    });

    lcContainer.innerHTML += "<h2>Completed LCs</h2>";
    completedLCs.forEach(lc => {
        lcContainer.innerHTML += `
            <div class="lc-card">
                <p><strong>Buyer:</strong> ${lc.buyer}</p>
                <p><strong>Seller:</strong> ${lc.seller}</p>
                <p><strong>Bank:</strong> ${lc.bank}</p>
                <p><strong>Amount:</strong> ${lc.amount} ETH</p>
                <p><strong>Status:</strong> ${lc.status}</p>
            </div>
        `;
    });
}

function updateDashboard(completedLCs) {
    let dashboardContainer = document.getElementById("dashboardContainer");
    dashboardContainer.innerHTML = "<h2>Completed Transactions</h2>";

    completedLCs.forEach(lc => {
        dashboardContainer.innerHTML += `
            <div class="lc-card">
                <p><strong>Buyer:</strong> ${lc.buyer}</p>
                <p><strong>Seller:</strong> ${lc.seller}</p>
                <p><strong>Bank:</strong> ${lc.bank}</p>
                <p><strong>Amount:</strong> ${lc.amount} ETH</p>
                <p><strong>Status:</strong> ${lc.status}</p>
            </div>
        `;
    });
}

async function completeLC(id) {
    const accounts = await ethereum.request({ method: "eth_accounts" });
    await contract.methods.completeLC(id).send({ from: accounts[0] });
    alert("LC marked as completed!");
    fetchLCs();  // Refresh the page
}
window.addEventListener("load", initWeb3);