export function getExplorerUrl(chainId, hash, type = 'tx') {
  const explorers = {
    1: 'https://etherscan.io',
    11155111: 'https://sepolia.etherscan.io',
    137: 'https://polygonscan.com',
    80001: 'https://mumbai.polygonscan.com',
    1301: 'https://unichain-sepolia.blockscout.com'
  };

  const baseUrl = explorers[chainId] || explorers[1];
  
  switch (type) {
    case 'tx':
      return `${baseUrl}/tx/${hash}`;
    case 'address':
      return `${baseUrl}/address/${hash}`;
    case 'token':
      return `${baseUrl}/token/${hash}`;
    default:
      return `${baseUrl}/tx/${hash}`;
  }
} 