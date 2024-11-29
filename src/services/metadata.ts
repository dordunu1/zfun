import { NFTMetadata, Property } from '../types/nft';
import { uploadFileToIPFS, uploadMetadataToIPFS, ipfsToHttp } from '../utils/ipfs';

export async function prepareAndUploadMetadata(
  formData: any,
  artworkFile: File
): Promise<{ metadataUrl: string, imageHttpUrl: string }> {
  try {
    // 1. Upload artwork first
    const imageIpfsUrl = await uploadFileToIPFS(artworkFile);
    const imageHttpUrl = ipfsToHttp(imageIpfsUrl); // Convert IPFS URL to HTTP URL

    // 2. Prepare metadata
    const metadata: NFTMetadata = {
      name: formData.name,
      description: formData.description || '',
      image: imageIpfsUrl, // Store the IPFS URL in metadata
      external_url: formData.website || '',
      category: formData.category || '',
      properties: formData.properties || [],
      socials: {
        twitter: formData.socials?.twitter || '',
        discord: formData.socials?.discord || '',
        telegram: formData.socials?.telegram || '',
        zos: formData.socials?.zos || ''
      }
    };

    // 3. Upload metadata to IPFS
    const metadataUrl = await uploadMetadataToIPFS(metadata);
    
    return {
      metadataUrl,
      imageHttpUrl // Return the HTTP URL for immediate display
    };
  } catch (error) {
    console.error('Error preparing metadata:', error);
    throw new Error('Failed to prepare and upload metadata');
  }
} 