const MAX_FILE_SIZE = 500 * 1024; // 500KB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const validateFile = (file) => {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('File must be .jpg, .png, or .webp');
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size must be less than 500KB');
  }
};

export async function uploadTokenLogo(file) {
  try {
    validateFile(file);
    
    // Convert file to FormData
    const formData = new FormData();
    formData.append('file', file);

    // Upload to Pinata
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_PINATA_JWT}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Upload failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.IpfsHash) {
      throw new Error('No IPFS hash returned from Pinata');
    }

    const ipfsUrl = `ipfs://${data.IpfsHash}`;
    const httpUrl = `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;

    return {
      ipfsUrl,
      httpUrl
    };
  } catch (error) {
    console.error('Upload Error:', error);
    if (error.message.includes('401')) {
      throw new Error('Invalid Pinata API key. Please check your configuration.');
    } else if (error.message.includes('413')) {
      throw new Error('File size too large. Please use a smaller image.');
    } else {
      throw new Error(`Upload failed: ${error.message}`);
    }
  }
}