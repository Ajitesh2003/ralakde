import React from 'react';
import LOGO_URL from '../Assets/logo.webp';

const PdfHeader = ({ data, templateConfig }) => {
  const { layoutStyle, companyDetails, quoteNumber, quoteDate, expiryDate, reference, salesPerson } = data;

  // Get header customizations
  const headerConfig = templateConfig?.header || {};
  const {
    backgroundImage,
    backgroundColor = '#ffffff',
    imagePosition = 'center',
    logoPosition = 'left',
    logoSize = 'medium',
    quoteTitleText = 'Quote',
    quoteTitlePosition = 'right',
  } = headerConfig;

  // Helper to get image position styles
  const getImagePositionStyles = () => {
    const positions = {
      'center': 'center center',
      'top-left': 'left top',
      'top-center': 'center top',
      'top-right': 'right top',
      'center-left': 'left center',
      'center-right': 'right center',
      'bottom-left': 'left bottom',
      'bottom-center': 'center bottom',
      'bottom-right': 'right bottom',
    };
    return positions[imagePosition] || 'center center';
  };

  // Helper to get logo size class
  const getLogoSizeClass = () => {
    const sizes = {
      'small': 'max-h-[50px]',
      'medium': 'max-h-[80px]',
      'large': 'max-h-[120px]',
    };
    return sizes[logoSize] || 'max-h-[80px]';
  };

  // Helper to get logo position justify class
  const getLogoJustifyClass = () => {
    const positions = {
      'left': 'justify-start',
      'center': 'justify-center',
      'right': 'justify-end',
    };
    return positions[logoPosition] || 'justify-start';
  };

  // Helper to get title position class
  const getTitlePositionClass = () => {
    const positions = {
      'left': 'text-left justify-start',
      'center': 'text-center justify-center',
      'right': 'text-right justify-end',
    };
    return positions[quoteTitlePosition] || 'text-right justify-end';
  };

  // Common header wrapper styles
  const headerWrapperStyle = {
    backgroundColor,
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: getImagePositionStyles(),
    backgroundRepeat: 'no-repeat',
  };

  if (layoutStyle === 'SPREADSHEET') {
    return (
      <header className="border border-gray-300" style={headerWrapperStyle}>
        {/* Top row: Company info + Logo + QUOTE title */}
        <div className="flex border-b border-gray-300">
          {/* Left: Logo & Company Info */}
          <div className="w-3/4  p-3 text-sm text-gray-800">
            <div className={`flex items-start ${getLogoJustifyClass()}`}>
              <img src={LOGO_URL} alt="Ralakde Logo" className={`${getLogoSizeClass()} w-auto object-contain mr-2`} />
              <div>
                <p className="font-bold text-lg leading-snug">{companyDetails.name}</p>
                <p>{companyDetails.addressLine1}</p>
                <p>{companyDetails.addressLine2}</p>
                <p>{companyDetails.country}</p>
                <p>VAT {companyDetails.vat}</p>
                <p>{companyDetails.phone}</p>
                <p>{companyDetails.email}</p>
                <p>{companyDetails.website}</p>
              </div>
            </div>
          </div>

          {/* Right: QUOTE title */}
          <div className={`w-1/4 p-3 flex ${getTitlePositionClass()}`}>
            <h1 className="text-xl font-semibold text-gray-800 tracking-wide mt-8">{quoteTitleText.toUpperCase()}</h1>
          </div>
        </div>

        {/* Second row: Quote metadata grid */}
        <div className="flex text-sm">
          {/* Left side (Quote details) */}
          <div className="w-3/4 grid grid-cols-2 border-r border-gray-300">
            <div className="border-b border-gray-300 p-2 font-medium">Quote#</div>
            <div className="border-b border-gray-300 p-2">: {quoteNumber}</div>

            <div className="border-b border-gray-300 p-2 font-medium">Quote Date</div>
            <div className="border-b border-gray-300 p-2">: {quoteDate}</div>

            <div className="border-b border-gray-300 p-2 font-medium">Expiry Date</div>
            <div className="border-b border-gray-300 p-2">: {expiryDate}</div>

            <div className="p-2 font-medium">Reference#</div>
            <div className="p-2">: {reference}</div>
          </div>

          {/* Right side (Salesperson cell) */}
          <div className="w-1/4 grid grid-cols-2">
            <div className="border-b border-gray-300 p-2 font-medium">Sales person</div>
            <div className="border-b border-gray-300 p-2">: {salesPerson}</div>
          </div>
        </div>
      </header>
    );
  }

  if (layoutStyle === 'ELITE') {
    return(
     <header className="flex  items-start border-b-2 border-gray-200 pb-10 mb-6" style={headerWrapperStyle}>
      <div className={`w-1/2 flex ${getLogoJustifyClass()}`}>
        <img
          src={LOGO_URL}
          alt="Ralake Limited Logo"
          className={`${getLogoSizeClass()} w-auto object-contain`}
        />
      </div>

     <div className='ml-2'>
                <p className="font-bold text-lg leading-snug mb-2">Ralakde</p>
                <p>{companyDetails.addressLine1}</p>
                <p>{companyDetails.addressLine2}</p>
                <p>{companyDetails.country}</p>
                <p>VAT {companyDetails.vat}</p>
                <p>{companyDetails.phone}</p>
                <p>{companyDetails.email}</p>
                <p>{companyDetails.website}</p>
              </div>
    </header>
    );
  }

  // Default header (for Standard/EU layouts)
  return (
    <header className="flex justify-between items-start mb-6" style={headerWrapperStyle}>
      <div className={`w-1/2 flex ${getLogoJustifyClass()}`}>
        <img
          src={LOGO_URL}
          alt="Ralake Limited Logo"
          className={`${getLogoSizeClass()} w-auto object-contain`}
        />
      </div>

      <div className={`w-1/2 mt-10 mr-4 flex flex-col ${getTitlePositionClass()}`}>
        <h1 className="text-2xl font-light text-blue-800 mb-1">{quoteTitleText}</h1>
        <p className="text-sm text-gray-700">
          {quoteTitleText}# <span className="font-semibold">{data.quoteNumber}</span>
        </p>
      </div>
    </header>
  );
};

export default PdfHeader;
