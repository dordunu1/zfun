import axios from 'axios';
import { NFTMetadata } from '../types/nft';

const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;
const PINATA_API = 'https://api.pinata.cloud/pinning';

export async function uploadFileToIPFS(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(`${PINATA_API}/pinFileToIPFS`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${PINATA_JWT}`,
    },
    maxBodyLength: Infinity,
  });

  return `ipfs://${response.data.IpfsHash}`;
}

export async function uploadMetadataToIPFS(metadata: NFTMetadata): Promise<string> {
  const response = await axios.post(
    `${PINATA_API}/pinJSONToIPFS`,
    metadata,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${PINATA_JWT}`,
      },
    }
  );

  return `ipfs://${response.data.IpfsHash}`;
}

export function ipfsToHttp(ipfsUrl: string): string {
  if (!ipfsUrl) return '';
  return ipfsUrl.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
} 