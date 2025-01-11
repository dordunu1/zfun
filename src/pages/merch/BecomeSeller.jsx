import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BiStore, BiCheckCircle, BiArrowBack } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useMerchAuth } from '../../context/MerchAuthContext';
import { doc, setDoc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/merchConfig';
import countryList from 'react-select-country-list';
import Select, { components } from 'react-select';
import ReactCountryFlag from 'react-country-flag';

// Add country calling codes data
const countryCallingCodes = {
  AF: '+93',
  AL: '+355',
  DZ: '+213',
  AS: '+1-684',
  AD: '+376',
  AO: '+244',
  AI: '+1-264',
  AQ: '+672',
  AG: '+1-268',
  AR: '+54',
  AM: '+374',
  AW: '+297',
  AU: '+61',
  AT: '+43',
  AZ: '+994',
  BS: '+1-242',
  BH: '+973',
  BD: '+880',
  BB: '+1-246',
  BY: '+375',
  BE: '+32',
  BZ: '+501',
  BJ: '+229',
  BM: '+1-441',
  BT: '+975',
  BO: '+591',
  BA: '+387',
  BW: '+267',
  BR: '+55',
  BN: '+673',
  BG: '+359',
  BF: '+226',
  BI: '+257',
  KH: '+855',
  CM: '+237',
  CA: '+1',
  CV: '+238',
  KY: '+1-345',
  CF: '+236',
  TD: '+235',
  CL: '+56',
  CN: '+86',
  CO: '+57',
  KM: '+269',
  CG: '+242',
  CD: '+243',
  CK: '+682',
  CR: '+506',
  HR: '+385',
  CU: '+53',
  CY: '+357',
  CZ: '+420',
  DK: '+45',
  DJ: '+253',
  DM: '+1-767',
  DO: '+1-809',
  EC: '+593',
  EG: '+20',
  SV: '+503',
  GQ: '+240',
  ER: '+291',
  EE: '+372',
  ET: '+251',
  FK: '+500',
  FO: '+298',
  FJ: '+679',
  FI: '+358',
  FR: '+33',
  GF: '+594',
  PF: '+689',
  GA: '+241',
  GM: '+220',
  GE: '+995',
  DE: '+49',
  GH: '+233',
  GI: '+350',
  GR: '+30',
  GL: '+299',
  GD: '+1-473',
  GP: '+590',
  GU: '+1-671',
  GT: '+502',
  GN: '+224',
  GW: '+245',
  GY: '+592',
  HT: '+509',
  HN: '+504',
  HK: '+852',
  HU: '+36',
  IS: '+354',
  IN: '+91',
  ID: '+62',
  IR: '+98',
  IQ: '+964',
  IE: '+353',
  IL: '+972',
  IT: '+39',
  JM: '+1-876',
  JP: '+81',
  JO: '+962',
  KZ: '+7',
  KE: '+254',
  KI: '+686',
  KP: '+850',
  KR: '+82',
  KW: '+965',
  KG: '+996',
  LA: '+856',
  LV: '+371',
  LB: '+961',
  LS: '+266',
  LR: '+231',
  LY: '+218',
  LI: '+423',
  LT: '+370',
  LU: '+352',
  MO: '+853',
  MK: '+389',
  MG: '+261',
  MW: '+265',
  MY: '+60',
  MV: '+960',
  ML: '+223',
  MT: '+356',
  MH: '+692',
  MQ: '+596',
  MR: '+222',
  MU: '+230',
  YT: '+262',
  MX: '+52',
  FM: '+691',
  MD: '+373',
  MC: '+377',
  MN: '+976',
  ME: '+382',
  MS: '+1-664',
  MA: '+212',
  MZ: '+258',
  MM: '+95',
  NA: '+264',
  NR: '+674',
  NP: '+977',
  NL: '+31',
  NC: '+687',
  NZ: '+64',
  NI: '+505',
  NE: '+227',
  NG: '+234',
  NU: '+683',
  NF: '+672',
  MP: '+1-670',
  NO: '+47',
  OM: '+968',
  PK: '+92',
  PW: '+680',
  PS: '+970',
  PA: '+507',
  PG: '+675',
  PY: '+595',
  PE: '+51',
  PH: '+63',
  PN: '+64',
  PL: '+48',
  PT: '+351',
  PR: '+1-787',
  QA: '+974',
  RE: '+262',
  RO: '+40',
  RU: '+7',
  RW: '+250',
  BL: '+590',
  SH: '+290',
  KN: '+1-869',
  LC: '+1-758',
  MF: '+590',
  PM: '+508',
  VC: '+1-784',
  WS: '+685',
  SM: '+378',
  ST: '+239',
  SA: '+966',
  SN: '+221',
  RS: '+381',
  SC: '+248',
  SL: '+232',
  SG: '+65',
  SK: '+421',
  SI: '+386',
  SB: '+677',
  SO: '+252',
  ZA: '+27',
  SS: '+211',
  ES: '+34',
  LK: '+94',
  SD: '+249',
  SR: '+597',
  SJ: '+47',
  SZ: '+268',
  SE: '+46',
  CH: '+41',
  SY: '+963',
  TW: '+886',
  TJ: '+992',
  TZ: '+255',
  TH: '+66',
  TL: '+670',
  TG: '+228',
  TK: '+690',
  TO: '+676',
  TT: '+1-868',
  TN: '+216',
  TR: '+90',
  TM: '+993',
  TC: '+1-649',
  TV: '+688',
  VI: '+1-340',
  UG: '+256',
  UA: '+380',
  AE: '+971',
  GB: '+44',
  US: '+1',
  UY: '+598',
  UZ: '+998',
  VU: '+678',
  VA: '+379',
  VE: '+58',
  VN: '+84',
  WF: '+681',
  EH: '+212',
  YE: '+967',
  ZM: '+260',
  ZW: '+263'
};

export default function BecomeSeller() {
  const navigate = useNavigate();
  const { user } = useMerchAuth();
  const [step, setStep] = useState(1);
  const listingFee = 750.00;
  const [isProcessing, setIsProcessing] = useState(false);
  const countries = useMemo(() => countryList().getData(), []);
  const [phonePlaceholder, setPhonePlaceholder] = useState('+233 XX XXX XXXX'); // Default to Ghana

  const countryOptions = useMemo(() => 
    countries.map(country => ({
      value: country.value,
      label: (
        <div className="flex items-center gap-2">
          <ReactCountryFlag 
            countryCode={country.value} 
            svg 
            style={{
              width: '1.5em',
              height: '1.5em',
            }}
          />
          {country.label}
        </div>
      ),
      searchLabel: country.label // For search functionality
    })), 
    [countries]
  );

  const customStyles = {
    control: (provided) => ({
      ...provided,
      padding: '2px',
      borderColor: '#E5E7EB',
      '&:hover': {
        borderColor: '#FF1B6B'
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#FF1B6B' : state.isFocused ? '#FFE4E4' : 'white',
      color: state.isSelected ? 'white' : '#374151',
      '&:hover': {
        backgroundColor: state.isSelected ? '#FF1B6B' : '#FFE4E4',
      }
    })
  };

  const [storeInfo, setStoreInfo] = useState({
    storeName: '',
    description: '',
    contactEmail: user?.email || '',
    phoneNumber: '',
    country: {
      name: '',
      code: '',
      flag: ''
    },
    city: '',
    postalCode: '',
    preferredToken: 'USDC',
    preferredNetwork: 'polygon',
    walletAddress: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStoreInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateSellerId = () => {
    // Generate a seller ID with prefix SELL_ and random numbers
    const randomNum = Math.floor(Math.random() * 100000);
    return `SELL_${randomNum.toString().padStart(6, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStep(3);
  };

  const handlePaymentSuccess = async (reference) => {
    setIsProcessing(true);
    try {
      if (!user) {
        toast.error('Please login first');
        return;
      }

      // Generate a unique seller ID
      const sellerId = generateSellerId();

      // Create seller profile
      await setDoc(doc(db, 'sellers', sellerId), {
        sellerId,
        userId: user.uid,
        ...storeInfo,
        status: 'active',
        createdAt: serverTimestamp(),
        statistics: {
          totalSales: 0,
          totalOrders: 0,
          rating: 0
        },
        balance: {
          available: 0,
          pending: 0
        },
        paymentReference: reference
      });

      // Update user profile to mark as seller
      await updateDoc(doc(db, 'users', user.uid), {
        isSeller: true,
        sellerId,
        updatedAt: serverTimestamp()
      });

      // Reload user data to update the context
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        window.location.href = '/merch-store/dashboard';
      }

      toast.success('Store created successfully!');
    } catch (error) {
      console.error('Error creating store:', error);
      toast.error('Failed to create store. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const initializePayment = () => {
    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      email: user?.email || storeInfo.contactEmail,
      amount: listingFee * 100,
      currency: 'GHS',
      callback: (response) => handlePaymentSuccess(response.reference),
      onClose: () => {
        toast.error('Payment cancelled');
      },
    });
    handler.openIframe();
  };

  useEffect(() => {
    // Load Paystack script
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCountryChange = (selectedOption) => {
    setStoreInfo(prev => ({
      ...prev,
      country: {
        name: selectedOption.searchLabel,
        code: selectedOption.value,
        flag: `https://flagcdn.com/${selectedOption.value.toLowerCase()}.svg`
      }
    }));

    // Update phone placeholder based on country
    const countryCode = countryCallingCodes[selectedOption.value] || '+233';
    setPhonePlaceholder(`${countryCode} XX XXX XXXX`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          <div className={`flex items-center ${step >= 1 ? 'text-[#FF1B6B]' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full border-2 ${step >= 1 ? 'border-[#FF1B6B] bg-pink-50' : 'border-gray-300'} flex items-center justify-center font-semibold transition-colors duration-300`}>
              1
            </div>
            <span className="ml-2">Information</span>
          </div>
          <div className="w-16 h-0.5 bg-gray-200">
            <div 
              className="h-full bg-[#FF1B6B] transition-all duration-300"
              style={{ width: step > 1 ? '100%' : '0%' }}
            />
          </div>
          <div className={`flex items-center ${step >= 2 ? 'text-[#FF1B6B]' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full border-2 ${step >= 2 ? 'border-[#FF1B6B] bg-pink-50' : 'border-gray-300'} flex items-center justify-center font-semibold transition-colors duration-300`}>
              2
            </div>
            <span className="ml-2">Store Info</span>
          </div>
          <div className="w-16 h-0.5 bg-gray-200">
            <div 
              className="h-full bg-[#FF1B6B] transition-all duration-300"
              style={{ width: step > 2 ? '100%' : '0%' }}
            />
          </div>
          <div className={`flex items-center ${step >= 3 ? 'text-[#FF1B6B]' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full border-2 ${step >= 3 ? 'border-[#FF1B6B] bg-pink-50' : 'border-gray-300'} flex items-center justify-center font-semibold transition-colors duration-300`}>
              3
            </div>
            <span className="ml-2">Payment</span>
          </div>
        </div>
      </div>

      {/* Step 1: Information */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-8 shadow-lg"
        >
          <div className="text-center mb-8">
            <BiStore className="w-16 h-16 text-[#FF1B6B] mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Become a Seller
            </h1>
            <p className="text-gray-600">
              Start selling your merchandise with a one-time listing fee
            </p>
          </div>

          <div className="bg-pink-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              What's Included:
            </h2>
            <ul className="space-y-3">
              {[
                'List unlimited products',
                'Manage your orders easily',
                'Secure payment processing',
                'Direct customer communication',
                'Flexible withdrawal options'
              ].map((benefit, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <BiCheckCircle className="w-5 h-5 text-[#FF1B6B] mr-2" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center mb-8">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              GHS {listingFee.toFixed(2)}
              <span className="text-sm font-normal text-gray-500 ml-1">
                one-time fee
              </span>
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full bg-[#FF1B6B] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#D4145A] transition-colors duration-300"
          >
            Next: Store Details
          </button>

          <div className="text-center mt-4">
            <div className="flex items-center justify-center text-sm text-gray-500">
              <span>Secure payment powered by</span>
              <img 
                src="/paystack.png" 
                alt="Paystack" 
                className="h-8 w-auto object-contain ml-2" 
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Step 2: Store Info */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-8 shadow-lg"
        >
          <button
            onClick={() => setStep(1)}
            className="flex items-center text-gray-600 hover:text-[#FF1B6B] mb-6 transition-colors"
          >
            <BiArrowBack className="w-5 h-5 mr-2" />
            Back
          </button>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Store Information</h2>
            <p className="text-gray-600">Tell us about your business</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Store Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Store Details</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Store Name *
                </label>
                <input
                  type="text"
                  name="storeName"
                  value={storeInfo.storeName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors"
                  placeholder="Your store name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={storeInfo.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors"
                  placeholder="Tell customers about your store"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={storeInfo.contactEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors"
                    placeholder="contact@yourstore.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={storeInfo.phoneNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors"
                    placeholder={phonePlaceholder}
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Location</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country *
                  </label>
                  <Select
                    options={countryOptions}
                    styles={customStyles}
                    onChange={handleCountryChange}
                    required
                    placeholder="select"
                    className="country-select"
                    value={storeInfo.country.code ? countryOptions.find(option => option.value === storeInfo.country.code) : null}
                    components={{
                      Option: ({ children, ...props }) => (
                        <components.Option {...props}>
                          {props.data.label}
                        </components.Option>
                      )
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={storeInfo.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors"
                    placeholder="Your city"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={storeInfo.postalCode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors"
                    placeholder="Postal code"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Payment Settings</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Network *
                </label>
                <div className="grid grid-cols-2 gap-4 mb-2">
                  {[
                    { id: 'polygon', name: 'Polygon', logo: '/polygon.png' },
                    { id: 'unichain', name: 'Unichain Testnet', logo: '/unichain-logo.png' }
                  ].map(network => (
                    <button
                      key={network.id}
                      type="button"
                      onClick={() => handleInputChange({ target: { name: 'preferredNetwork', value: network.id } })}
                      className={`p-4 border rounded-lg transition-colors flex items-center justify-center gap-2 ${
                        storeInfo.preferredNetwork === network.id 
                          ? 'border-[#FF1B6B] bg-pink-50' 
                          : 'border-gray-200 hover:border-[#FF1B6B]'
                      }`}
                    >
                      <img 
                        src={network.logo}
                        alt={`${network.name} logo`}
                        className="w-6 h-6"
                      />
                      <span className="font-medium">{network.name}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-1 text-sm">
                  <p className="text-gray-500">Network you want to operate your store on</p>
                  <p className="text-amber-600 font-medium mt-1">
                    ⚠️ This selection cannot be changed after store creation
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Payment Token *
                </label>
                <div className="relative">
                  <select
                    name="preferredToken"
                    value={storeInfo.preferredToken}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors appearance-none"
                  >
                    <option value="USDC">USDC (USD Coin)</option>
                    <option value="USDT">USDT (Tether)</option>
                  </select>
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <img 
                      src={`/${storeInfo.preferredToken.toLowerCase()}.png`}
                      alt={storeInfo.preferredToken}
                      className="w-6 h-6"
                    />
                  </div>
                </div>
                <div className="mt-1 text-sm">
                  <p className="text-gray-500">Token you want to receive payments in</p>
                  <p className="text-amber-600 font-medium mt-1">
                    ⚠️ This selection cannot be changed after store creation
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-[#FF1B6B] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#D4145A] transition-colors duration-300"
              >
                Next: Proceed to Payment
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Step 3: Payment */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-8 shadow-lg"
        >
          <button
            onClick={() => setStep(2)}
            className="flex items-center text-gray-600 hover:text-[#FF1B6B] mb-6 transition-colors"
          >
            <BiArrowBack className="w-5 h-5 mr-2" />
            Back to Store Info
          </button>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>
            <p className="text-gray-600">Pay the one-time listing fee to activate your store</p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Listing Fee</span>
                <span className="font-semibold">GHS {listingFee}</span>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total</span>
                  <span className="font-bold text-xl">GHS {listingFee}</span>
                </div>
              </div>
            </div>

            <button
              onClick={initializePayment}
              className="w-full bg-[#FF1B6B] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#D4145A] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Pay Now'}
            </button>

            <div className="text-center mt-4">
              <div className="flex items-center justify-center text-sm text-gray-500">
                <span>Secure payment powered by</span>
                <img 
                  src="/paystack.png" 
                  alt="Paystack" 
                  className="h-8 w-auto object-contain ml-2" 
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
} 