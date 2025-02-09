const explorers = {
  1: 'https://etherscan.io',
  11155111: 'https://sepolia.etherscan.io',
  137: 'https://polygonscan.com',
  80001: 'https://mumbai.polygonscan.com',
  1301: 'https://unichain-sepolia.blockscout.com',
  1828369849: 'https://moonwalker-blockscout.eu-north-2.gateway.fm'
};

export const getExplorerUrl = (chainId, type = 'tx', value) => {
  const baseUrl = explorers[chainId] || explorers[1];
  
  switch (type) {
    case 'tx':
      return `${baseUrl}/tx/${value}`;
    case 'address':
      return `${baseUrl}/address/${value}`;
    case 'token':
      return `${baseUrl}/token/${value}`;
    default:
      return `${baseUrl}/tx/${value}`;
  }
}; 