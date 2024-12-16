export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  image_url?: string;
  external_url?: string;
  attributes?: Property[];
  background_color?: string;
}

export interface Property {
  trait_type: string;
  value: string | number;
  display_type?: string;
  max_value?: number;
} 