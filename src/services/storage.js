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
      throw new Error('Upload failed');
    }

    const data = await response.json();
    const ipfsUrl = `ipfs://${data.IpfsHash}`;
    const httpUrl = ipfsUrl.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');

    return {
      ipfsUrl,
      httpUrl
    };
  } catch (error) {
    console.error('Upload Error:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }
}