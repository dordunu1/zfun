import axios from 'axios';
import { NFTMetadata } from '../types/nft';

const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;
const PINATA_API = 'https://api.pinata.cloud/pinning';
const IPFS_GATEWAY = 'https://ipfs.io/ipfs/';

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

  const ipfsHash = response.data.IpfsHash;
  return `ipfs://${ipfsHash}`;
}

export async function uploadMetadataToIPFS(metadata: NFTMetadata): Promise<string> {
  const metadataCopy = { ...metadata };
  
  console.log('Uploading metadata to IPFS:', metadataCopy);

  const response = await axios.post(
    `${PINATA_API}/pinJSONToIPFS`,
    metadataCopy,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${PINATA_JWT}`,
      },
    }
  );

  console.log('IPFS upload response:', response.data);
  return `ipfs://${response.data.IpfsHash}`;
}

export function ipfsToHttp(ipfsUrl: string): string {
  if (!ipfsUrl) return '';
  if (ipfsUrl.startsWith('http')) return ipfsUrl;
  return ipfsUrl.replace('ipfs://', IPFS_GATEWAY);
} 