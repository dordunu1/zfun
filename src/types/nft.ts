export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  category?: string;
  properties: Array<{
    trait_type: string;
    value: string;
  }>;
  socials?: {
    twitter?: string;
    discord?: string;
    telegram?: string;
    zos?: string;
  };
}

export interface Property {
  trait_type: string;
  value: string;
} 