const API_KEY = import.meta.env.VITE_17TRACK_API_KEY;
const API_URL = 'https://api.17track.net/track/v2/GetTrackInfo';

// Carrier code mapping
export const carrierCodes = {
  'fedex': '100001',
  'ups': '100002',
  'usps': '100003',
  'dhl': '100004',
  'speedaf': '190161',
  'other': null
};

export const getTrackingInfo = async (trackingNumber, carrier = 'other') => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
        '17token': API_KEY
      },
      body: JSON.stringify({
        "data": [{
          "number": trackingNumber,
          "carrier": carrierCodes[carrier.toLowerCase()] || null
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data?.data?.[0] || null;
  } catch (error) {
    console.error('Error in getTrackingInfo:', error);
    throw error;
  }
};

export const formatTrackingStatus = (status) => {
  switch (status) {
    case 0:
      return 'Not Found';
    case 10:
      return 'In Transit';
    case 20:
      return 'Pickup';
    case 30:
      return 'Delivered';
    case 35:
      return 'Failed Attempt';
    case 40:
      return 'Exception';
    default:
      return 'Unknown';
  }
};

export const getTrackingTimeline = (data) => {
  if (!data || !data.track_info || !data.track_info.tracking) {
    return [];
  }

  return data.track_info.tracking.map(event => ({
    status: formatTrackingStatus(event.status),
    description: event.description,
    date: new Date(event.time),
    location: event.location
  })).sort((a, b) => b.date - a.date);
}; 