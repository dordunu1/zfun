import { NFTMetadata, Property } from '../types/nft';
import { uploadFileToIPFS, uploadMetadataToIPFS, ipfsToHttp } from '../utils/ipfs';

// List of trait types that should be displayed as stats
const STAT_TRAITS = ['level', 'strength', 'power', 'speed', 'health', 'mana', 'stamina'];

export async function prepareAndUploadMetadata(
  formData: any,
  artworkFile: File,
  tokenId?: string
): Promise<{ metadataUrl: string, imageHttpUrl: string, imageIpfsUrl: string }> {
  try {
    // 1. Upload artwork first
    const imageIpfsUrl = await uploadFileToIPFS(artworkFile);
    const imageHttpUrl = ipfsToHttp(imageIpfsUrl);

    // Format attributes to ensure proper structure
    const attributes = formData.attributes?.map((attr: any) => {
      const value = attr.value?.toString() || '';
      const numericValue = Number(value);
      const isNumeric = !isNaN(numericValue) && value !== '';
      const trait_type = attr.trait_type?.toLowerCase();

      // Only set display_type: "number" for specific stat traits
      return {
        trait_type: attr.trait_type,
        value: isNumeric ? numericValue : value,
        display_type: isNumeric && STAT_TRAITS.includes(trait_type) ? 'number' : undefined
      };
    }).filter(attr => attr.trait_type && attr.value !== '') || [];

    // 2. Prepare metadata exactly matching OpenSea's format
    const metadata: NFTMetadata = {
      name: formData.name + (tokenId ? ` #${tokenId}` : ''),
      description: formData.description || '',
      image: imageIpfsUrl,
      external_url: formData.website || '',
      attributes: attributes,
      background_color: formData.background_color || '000000'
    };

    // 3. Upload metadata to IPFS
    const metadataUrl = await uploadMetadataToIPFS(metadata);

    return {
      metadataUrl,
      imageHttpUrl,
      imageIpfsUrl
    };
  } catch (error) {
    throw new Error('Failed to prepare and upload metadata');
  }
} 