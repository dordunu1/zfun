import React from 'react';

export const VerificationCheckmark = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M12 2L17.196 4.804L20 10L17.196 15.196L12 18L6.804 15.196L4 10L6.804 4.804L12 2Z" 
      fill="#FF1B6B"
      filter="drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.15))"
    />
    <path 
      d="M12 4L15.696 6.104L17.8 9.8L15.696 13.496L12 15.6L8.304 13.496L6.2 9.8L8.304 6.104L12 4Z" 
      fill="#FF1B6B"
      className="brightness-110"
    />
    <path 
      d="M8.5 10L11 12.5L15.5 8" 
      stroke="white" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="drop-shadow-sm"
    />
  </svg>
);

export default VerificationCheckmark; 