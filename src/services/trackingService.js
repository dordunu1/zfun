const API_KEY = import.meta.env.VITE_17TRACK_API_KEY;
const API_URL = 'https://api.17track.net/track/v2';

const carrierCodes = {
  'fedex': 100001,
  'ups': 100058,
  'usps': 100001,
  'dhl': 100003,
  'speedaf': 190161,
  'other': null,  // For unknown carriers
  // More carriers
  'aramex': 100009,
  'dpd': 100013,
  'tnt': 100048,
  'sf express': 100080,
  'china post': 100190,
  'singapore post': 100223,
  'malaysia post': 100224,
  'pos indonesia': 100228,
  'thailand post': 100234,
  'vietnam post': 100236,
  'philippines post': 100246,
  'j&t express': 190161,
  'ninja van': 190202,
  'pos laju': 190189
};

export const getTrackingInfo = async (trackingNumber, carrier) => {
  try {
    const carrierCode = carrierCodes[carrier.toLowerCase()] || null;
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        '17token': API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      },
      mode: 'cors',
      body: JSON.stringify({
        "data": [{
          "number": trackingNumber,
          "carrier": carrierCode
        }]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tracking information');
    }

    const data = await response.json();
    return data?.data?.[0] || null;

  } catch (error) {
    console.error('Error fetching tracking info:', error);
    throw error;
  }
};

export const formatTrackingStatus = (status) => {
  // 17track status codes mapping
  const statusMap = {
    0: 'Not Found',
    10: 'In Transit',
    20: 'Pickup',
    30: 'Delivered',
    35: 'Failed Attempt',
    40: 'Exception',
  };

  return statusMap[status] || 'Unknown';
};

export const getTrackingTimeline = (trackInfo) => {
  if (!trackInfo?.track_info?.steps) return [];

  return trackInfo.track_info.steps.map(step => ({
    date: new Date(step.date),
    status: formatTrackingStatus(step.status),
    location: step.location,
    description: step.description,
  }));
}; 