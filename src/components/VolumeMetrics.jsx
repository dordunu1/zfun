const fetchPolygonData = async (address) => {
  const apiKey = import.meta.env.VITE_POLYGONSCAN_API_KEY;
  if (!apiKey) {
    throw new Error('Polygonscan API key not found in environment variables');
  }

  try {
    // First, determine if the contract is ERC721 or ERC1155
    const abiResponse = await fetch(`/polygon-api/api?module=contract&action=getabi&address=${address}&apikey=${apiKey}`);
    const abiData = await abiResponse.json();
    
    if (abiData.status !== '1') {
      throw new Error(`Failed to fetch contract ABI: ${abiData.message}`);
    }

    const abi = JSON.parse(abiData.result);
    const isERC1155 = abi.some(item => item.type === 'function' && item.name === 'balanceOfBatch');
    const action = isERC1155 ? 'tokennfttx' : 'tokentx';

    // Fetch token transfers
    const response = await fetch(
      `/polygon-api/api?module=account&action=${action}&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status === '0' && data.message === 'No transactions found') {
      return { transfers: [], volume: 0 };
    }

    if (data.status !== '1') {
      throw new Error(`API error: ${data.message}`);
    }

    const transfers = data.result;
    const volume = transfers.reduce((acc, tx) => acc + Number(tx.value), 0);

    return {
      transfers,
      volume
    };
  } catch (error) {
    if (error.message.includes('CORS')) {
      console.error('CORS error when fetching Polygon data:', error);
      throw new Error('CORS error: Unable to fetch data from Polygonscan. Please check network configuration.');
    }
    console.error('Error fetching Polygon data:', error);
    throw error;
  }
}; 