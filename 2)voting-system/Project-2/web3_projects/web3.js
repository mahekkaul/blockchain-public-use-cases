// Ensure Web3.js is loaded and MetaMask is installed
if (typeof window.ethereum !== 'undefined') {
    console.log('✅ MetaMask detected');
    window.web3 = new Web3(window.ethereum);
} else {
    alert('⚠️ MetaMask is not installed. Please install it to use this site.');
}

// Connect to MetaMask
async function connectMetaMask() {
    if (window.ethereum) {
        try {
            console.log('🔄 Requesting MetaMask connection...');
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

            if (accounts.length > 0) {
                const userAddress = accounts[0];
                const walletAddressElement = document.getElementById('wallet-address');

                if (walletAddressElement) {  // Ensure element exists before setting innerText
                    walletAddressElement.innerText = `Connected: ${userAddress}`;
                }

                console.log('🟢 Connected to MetaMask:', userAddress);
            } else {
                console.warn('⚠️ No account found');
            }
        } catch (error) {
            console.error('❌ Connection error:', error);
            alert(`Error: ${error.message}`);
        }
    } else {
        alert('⚠️ MetaMask is not installed!');
    }
}


// Smart Contract Configuration
const contractAddress = "0x700B9acb84778fc563f17Aa0045cA007F75d9902";  // Replace with your deployed contract address
const contractABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_proposal",
				"type": "string"
			}
		],
		"name": "addCandidate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "admin",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
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
		"name": "candidates",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "proposal",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "voteCount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_to",
				"type": "address"
			}
		],
		"name": "delegateVote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "electionOngoing",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "endElection",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getWinner",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
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
				"internalType": "address",
				"name": "_voter",
				"type": "address"
			}
		],
		"name": "registerVoter",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "startElection",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_candidateId",
				"type": "uint256"
			}
		],
		"name": "vote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "voters",
		"outputs": [
			{
				"internalType": "bool",
				"name": "isRegistered",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "hasVoted",
				"type": "bool"
			},
			{
				"internalType": "address",
				"name": "delegate",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "votedCandidate",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

let votingContract;
if (window.web3) {
    const web3 = new Web3(window.ethereum);
    votingContract = new web3.eth.Contract(contractABI, contractAddress);
}

// Start Election
async function startElection() {
    if (!votingContract) return alert('❌ Smart contract not loaded!');
    
    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        await votingContract.methods.startElection().send({ from: accounts[0] });
        alert('✅ Election started successfully!');
    } catch (error) {
        console.error('❌ Error starting election:', error);
        alert(`Error: ${error.message}`);
    }
}

// End Election
async function endElection() {
    if (!votingContract) return alert('❌ Smart contract not loaded!');
    
    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        await votingContract.methods.endElection().send({ from: accounts[0] });
        alert('✅ Election ended successfully!');
    } catch (error) {
        console.error('❌ Error ending election:', error);
        alert(`Error: ${error.message}`);
    }
}

// Cast Vote Function
async function castVote(candidateId) {
    console.log("🔍 Debug: Received candidate ID =", candidateId);
    if (!votingContract) return alert('❌ Smart contract not loaded!');
    if (!candidateId || isNaN(candidateId)) return alert('❌ Invalid candidate ID! Please select a valid candidate.');

    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        await votingContract.methods.vote(candidateId).send({ from: accounts[0] });
        alert('✅ Vote successfully cast!');
    } catch (error) {
        console.error('❌ Error while voting:', error);
        alert(`Error: ${error.message}`);
    }
}

// Delegate Vote Function
async function delegateVote(delegateAddress) {
    if (!votingContract) return alert('❌ Smart contract not loaded!');
    if (!delegateAddress) return alert('❌ Invalid delegate address!');

    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        await votingContract.methods.delegateVote(delegateAddress).send({ from: accounts[0] });
        alert('✅ Vote successfully delegated!');
    } catch (error) {
        console.error('❌ Error while delegating vote:', error);
        alert(`Error: ${error.message}`);
    }
}

// Show Election Results
async function showResults() {
    if (!votingContract) return alert('❌ Smart contract not loaded!');

    try {
        const results = await votingContract.methods.getWinner().call();
        console.log('🗳 Election Results:', results);
        alert(`Election Winner: ${results[0]} with ${results[1]} votes`);
    } catch (error) {
        console.error('❌ Error fetching results:', error);
        alert(`Error: ${error.message}`);
    }
}

// Ensure connection on page load
window.onload = connectMetaMask;
