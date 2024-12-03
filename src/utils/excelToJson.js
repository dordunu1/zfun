import * as XLSX from 'xlsx';

const convertTemplateFormat = (workbook) => {
  try {
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

    return {
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
  } catch (error) {
    console.error('Error converting template format:', error);
    return null;
  }
};

const convertFlexibleFormat = (workbook) => {
  try {
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(firstSheet);

    if (!rawData || rawData.length === 0) {
      throw new Error('No data found in Excel file');
    }

    // Analyze the structure of the first row to determine format
    const firstRow = rawData[0];
    const columns = Object.keys(firstRow);

    // Convert data to NFTs with attributes
    const nfts = rawData.map(row => {
      const baseFields = ['id', 'name', 'description', 'image', 'animation_url'];
      const nft = {
        id: row.id || row.ID || row.name || row.Name || '',
        name: row.name || row.Name || row.id || row.ID || '',
        description: row.description || row.Description || '',
        image: row.image || row.Image || '',
        animation_url: row.animation_url || row['animation_url'] || row.animationUrl || row.AnimationUrl || '',
      };

      // Convert all non-base fields to attributes
      const attributes = [];
      columns.forEach(column => {
        if (!baseFields.includes(column.toLowerCase()) && row[column] !== undefined && row[column] !== '') {
          attributes.push({
            trait_type: column,
            value: row[column].toString()
          });
        }
      });

      if (attributes.length > 0) {
        nft.attributes = attributes;
      }

      return nft;
    });

    // Extract prefix counts
    const prefix_counts = {};
    nfts.forEach(nft => {
      const prefix = nft.id.split('-')[0];
      if (prefix) {
        prefix_counts[prefix] = (prefix_counts[prefix] || 0) + 1;
      }
    });

    // Extract traits from attributes
    const traits = {};
    nfts.forEach(nft => {
      if (nft.attributes) {
        nft.attributes.forEach(attr => {
          if (!traits[attr.trait_type]) {
            traits[attr.trait_type] = new Set();
          }
          traits[attr.trait_type].add(attr.value);
        });
      }
    });

    // Convert Set to Array for each trait
    Object.keys(traits).forEach(key => {
      traits[key] = Array.from(traits[key]);
    });

    return {
      nfts,
      metadata: {
        name: "My Collection",
        description: "A unique NFT collection",
        prefix_counts,
        traits
      }
    };
  } catch (error) {
    console.error('Error converting flexible format:', error);
    return null;
  }
};

export const convertExcelToMetadataJson = (excelFile) => {
  const workbook = XLSX.read(excelFile, { type: 'array' });
  
  // Try template format first
  const templateResult = convertTemplateFormat(workbook);
  if (templateResult) {
    console.log('Successfully converted using template format');
    return templateResult;
  }

  // If template format fails, try flexible format
  const flexibleResult = convertFlexibleFormat(workbook);
  if (flexibleResult) {
    console.log('Successfully converted using flexible format');
    return flexibleResult;
  }

  throw new Error('Failed to convert Excel file - invalid format');
};

export const handleExcelUpload = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const result = convertExcelToMetadataJson(data);
        resolve(result);
      } catch (error) {
        console.error('Error converting Excel:', error);
        reject(error);
      }
    };

    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      reject(error);
    };

    reader.readAsArrayBuffer(file);
  });
}; 