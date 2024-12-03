import React from 'react';
import { BiX } from 'react-icons/bi';
import { createPortal } from 'react-dom';

const metadataExample = `{
  "nfts": [
    {
      "id": "CM-1",
      "name": "Common Rabbit #1",
      "description": "A curious white rabbit with exceptional hearing abilities",
      "image": "ipfs://[your-images-folder-hash]/CM-1.png",
      "attributes": [
        {
          "trait_type": "Species",
          "value": "Rabbit"
        },
        {
          "trait_type": "Rarity",
          "value": "Common"
        },
        {
          "trait_type": "Color",
          "value": "White"
        },
        {
          "trait_type": "Special Ability",
          "value": "Enhanced Hearing"
        }
      ]
    },
    {
      "id": "RM-1",
      "name": "Rare Fox Video #1",
      "description": "A mystical arctic fox with glowing blue eyes",
      "image": "ipfs://[your-images-folder-hash]/RM-1-thumbnail.png",
      "animation_url": "ipfs://[your-videos-folder-hash]/RM-1.mp4",
      "attributes": [
        {
          "trait_type": "Species",
          "value": "Arctic Fox"
        },
        {
          "trait_type": "Rarity",
          "value": "Rare"
        },
        {
          "trait_type": "Color",
          "value": "Snow White"
        },
        {
          "trait_type": "Special Ability",
          "value": "Night Vision"
        },
        {
          "trait_type": "Media Type",
          "value": "Video"
        }
      ]
    },
    {
      "id": "LG-1",
      "name": "Legendary Dragon Tiger #1",
      "description": "A mythical tiger with dragon-like features and golden stripes",
      "image": "ipfs://[your-images-folder-hash]/LG-1.png",
      "animation_url": "ipfs://[your-videos-folder-hash]/LG-1.mp4",
      "attributes": [
        {
          "trait_type": "Species",
          "value": "Tiger"
        },
        {
          "trait_type": "Rarity",
          "value": "Legendary"
        },
        {
          "trait_type": "Color",
          "value": "Golden Striped"
        },
        {
          "trait_type": "Special Ability",
          "value": "Fire Breathing"
        },
        {
          "trait_type": "Media Type",
          "value": "Video"
        }
      ]
    }
  ],
  "metadata": {
    "name": "Mystical Animals Collection",
    "description": "A collection of 100 unique animals with varying rarities and special abilities, featuring both images and videos",
    "prefix_counts": {
      "CM": 50,
      "RM": 30,
      "LG": 20
    },
    "traits": {
      "Species": [
        "Rabbit", "Arctic Fox", "Tiger", "Wolf", "Owl", 
        "Deer", "Bear", "Dragon", "Phoenix", "Unicorn", "Griffin"
      ],
      "Rarity": ["Common", "Rare", "Legendary"],
      "Color": [
        "White", "Snow White", "Golden Striped", "Silver", "Black",
        "Blue", "Red", "Rainbow", "Crystal", "Shadow"
      ],
      "Special Ability": [
        "Enhanced Hearing", "Night Vision", "Fire Breathing",
        "Ice Magic", "Lightning Strike", "Nature Control",
        "Shadow Walk", "Time Freeze", "Healing Touch"
      ],
      "Media Type": ["Image", "Video"]
    },
    "media_info": {
      "supported_image_formats": ["png", "jpg", "gif"],
      "supported_video_formats": ["mp4", "webm"],
      "max_video_size": "20MB",
      "recommended_video_duration": "10-30 seconds",
      "video_thumbnail": "required"
    }
  }
}`;

const MetadataExampleModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70" />
      
      {/* Modal Container */}
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          {/* Modal Content */}
          <div 
            className="relative w-full max-w-3xl bg-white dark:bg-[#0a0b0f] p-6 rounded-lg"
            onClick={e => e.stopPropagation()}
          >
            {/* L-shaped corners */}
            <div className="absolute -top-[2px] -left-[2px] w-8 h-8">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00ffbd]" />
              <div className="absolute top-0 left-0 w-[2px] h-full bg-[#00ffbd]" />
            </div>
            <div className="absolute -top-[2px] -right-[2px] w-8 h-8">
              <div className="absolute top-0 right-0 w-full h-[2px] bg-[#00ffbd]" />
              <div className="absolute top-0 right-0 w-[2px] h-full bg-[#00ffbd]" />
            </div>
            <div className="absolute -bottom-[2px] -left-[2px] w-8 h-8">
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#00ffbd]" />
              <div className="absolute bottom-0 left-0 w-[2px] h-full bg-[#00ffbd]" />
            </div>
            <div className="absolute -bottom-[2px] -right-[2px] w-8 h-8">
              <div className="absolute bottom-0 right-0 w-full h-[2px] bg-[#00ffbd]" />
              <div className="absolute bottom-0 right-0 w-[2px] h-full bg-[#00ffbd]" />
            </div>

            {/* Glowing dots in corners */}
            <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd]" />
            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd]" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd]" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd]" />

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Metadata JSON Example
              </h3>
              <button 
                type="button"
                onClick={onClose}
                className="w-8 h-8 inline-flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-[#1a1b1f] transition-colors cursor-pointer"
              >
                <BiX className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="bg-gray-100 dark:bg-[#151619] rounded-lg p-4">
              <pre 
                className="font-mono text-sm overflow-y-auto max-h-[60vh] whitespace-pre text-gray-800 dark:text-gray-200 metadata-example"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'var(--scroll-thumb) var(--scroll-track)'
                }}
              >
                <style>{`
                  .metadata-example {
                    scrollbar-width: thin;
                    scrollbar-color: var(--scroll-thumb) var(--scroll-track);
                  }
                  .metadata-example::-webkit-scrollbar {
                    width: 8px;
                  }
                  .metadata-example::-webkit-scrollbar-track {
                    background: var(--scroll-track);
                    border-radius: 4px;
                  }
                  .metadata-example::-webkit-scrollbar-thumb {
                    background: var(--scroll-thumb);
                    border-radius: 4px;
                  }
                  .metadata-example::-webkit-scrollbar-thumb:hover {
                    background: var(--scroll-thumb-hover);
                  }

                  /* Light mode */
                  @media (prefers-color-scheme: light) {
                    .metadata-example {
                      --scroll-track: #f3f4f6;
                      --scroll-thumb: #00ffbd80;
                      --scroll-thumb-hover: #00ffbd;
                    }
                  }

                  /* Dark mode */
                  @media (prefers-color-scheme: dark) {
                    .metadata-example {
                      --scroll-track: #1a1b1f;
                      --scroll-thumb: #00ffbd80;
                      --scroll-thumb-hover: #00ffbd;
                    }
                  }

                  /* For when dark class is applied */
                  :root[data-theme='dark'] .metadata-example {
                    --scroll-track: #1a1b1f;
                    --scroll-thumb: #00ffbd80;
                    --scroll-thumb-hover: #00ffbd;
                  }

                  /* For when light class is applied */
                  :root[data-theme='light'] .metadata-example {
                    --scroll-track: #f3f4f6;
                    --scroll-thumb: #00ffbd80;
                    --scroll-thumb-hover: #00ffbd;
                  }
                `}</style>
                {metadataExample}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default MetadataExampleModal; 