export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  image_data?: string;
  external_url?: string;
  background_color?: string;
  animation_url?: string;
  youtube_url?: string;
  category?: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
    display_type?: string;
    max_value?: number;
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
  value: string | number;
  display_type?: string;
  max_value?: number;
} 