const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const validateFile = (file) => {
  // Check if file exists and is a File or Blob object
  if (!file || !(file instanceof File || file instanceof Blob)) {
    throw new Error('Invalid file object');
  }

  // Get file type from either type property or name extension
  let fileType = file.type;
  if (!fileType && file.name) {
    const extension = file.name.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        fileType = 'image/jpeg';
        break;
      case 'png':
        fileType = 'image/png';
        break;
      case 'webp':
        fileType = 'image/webp';
        break;
      default:
        throw new Error('Unsupported file type. Please use .jpg, .jpeg, .png, or .webp');
    }
  }

  // Validate file type
  if (!fileType || !ACCEPTED_IMAGE_TYPES.includes(fileType.toLowerCase())) {
    throw new Error('File must be .jpg, .jpeg, .png, or .webp');
  }

  // Check file size
  if (!file.size || file.size > MAX_FILE_SIZE) {
    throw new Error('File size must be less than 5MB');
  }

  // Additional check for empty files
  if (file.size === 0) {
    throw new Error('File is empty');
  }
};

export async function uploadTokenLogo(file) {
  try {
    // Validate file first
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
      throw error;
    }
  }
}