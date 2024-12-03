import * as XLSX from 'xlsx';

export const convertExcelToMetadataJson = (excelFile) => {
  const workbook = XLSX.read(excelFile, { type: 'array' });

  // Read NFTs sheet
  const nftsSheet = workbook.Sheets['NFTs'];
  const nftsData = XLSX.utils.sheet_to_json(nftsSheet);

  // Read Collection sheet
  const collectionSheet = workbook.Sheets['Collection'];
  const collectionRawData = XLSX.utils.sheet_to_json(collectionSheet);

  // Convert collection data from field/value format to object
  const collectionData = {};
  collectionRawData.forEach(row => {
    if (row.field && row.value !== undefined) {
      collectionData[row.field] = row.value;
    }
  });

  // Read Traits sheet
  const traitsSheet = workbook.Sheets['Traits'];
  const traitsData = XLSX.utils.sheet_to_json(traitsSheet);

  // Convert NFTs data to proper format
  const nfts = nftsData.map(row => {
    const attributes = [
      { trait_type: 'Species', value: row.Species },
      { trait_type: 'Rarity', value: row.Rarity },
      { trait_type: 'Color', value: row.Color },
      { trait_type: 'Special Ability', value: row['Special Ability'] }
    ];

    if (row['Media Type']) {
      attributes.push({ trait_type: 'Media Type', value: row['Media Type'] });
    }

    const nft = {
      id: row.id,
      name: row.name,
      description: row.description,
      image: row.image,
      attributes
    };

    if (row.animation_url) {
      nft.animation_url = row.animation_url;
    }

    return nft;
  });

  // Convert traits data to proper format
  const traits = {};
  traitsData.forEach(row => {
    traits[row.trait_type] = row.values.split(',').map(v => v.trim());
  });

  // Get prefix counts from collection data
  const prefix_counts = {};
  Object.entries(collectionData).forEach(([key, value]) => {
    if (key.startsWith('prefix_') && key.endsWith('_count')) {
      const prefix = key.replace('prefix_', '').replace('_count', '');
      prefix_counts[prefix] = parseInt(value);
    }
  });

  // Construct final metadata JSON
  const metadataJson = {
    nfts,
    metadata: {
      name: collectionData.name,
      description: collectionData.description,
      prefix_counts,
      traits,
      media_info: {
        supported_image_formats: ['png', 'jpg', 'gif'],
        supported_video_formats: ['mp4', 'webm'],
        max_video_size: '20MB',
        recommended_video_duration: '10-30 seconds',
        video_thumbnail: 'required'
      }
    }
  };

  console.log('Converted metadata:', metadataJson);
  return metadataJson;
};

// Example usage function
export const handleExcelUpload = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const json = convertExcelToMetadataJson(data);
        resolve(json);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}; 