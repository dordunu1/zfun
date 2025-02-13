const createToken = async () => {
  try {
    setIsCreating(true);
    setError(null);

    // Validate logo file
    if (!logoFile || !(logoFile instanceof File)) {
      throw new Error('Please select a logo file');
    }

    // Upload logo to IPFS
    const formData = new FormData();
    formData.append('file', logoFile);
    
    const ipfsRes = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    if (!ipfsRes.ok) {
      throw new Error('Failed to upload logo');
    }

    const { ipfsHash } = await ipfsRes.json();
    const logoURI = `ipfs://${ipfsHash}`;

    // Create token params
    const params = {
      name: tokenName,
      symbol: tokenSymbol,
      totalSupply: ethers.utils.parseUnits(totalSupply.toString(), 18),
      logoURI,
      addInitialLiquidity: true,
      initialLiquidityPercent: 50,
      liquidityLockPeriod: lockPeriod * 86400 // Convert days to seconds
    };

    // Get creation fee
    const fee = await factory.getChainFee();

    // Create token
    const tx = await factory.createMemeToken(params, { value: fee });
    setTxHash(tx.hash);

    const receipt = await tx.wait();
    
    // Find TokenCreated event
    const event = receipt.events.find(e => e.event === 'TokenCreated');
    const tokenAddress = event.args.tokenAddress;
    
    setCreatedToken({
      address: tokenAddress,
      name: tokenName,
      symbol: tokenSymbol,
      logoURI
    });

    setIsCreating(false);
    setShowSuccessModal(true);

  } catch (err) {
    console.error('Error creating token:', err);
    setError(`Error creating token: ${err.message}`);
    setIsCreating(false);
  }
}; 