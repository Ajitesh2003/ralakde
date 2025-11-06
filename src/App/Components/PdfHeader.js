import React from 'react';
import LOGO_URL from '../Assets/logo.webp';

const PdfHeader = ({ data }) => {
  const { layoutStyle, companyDetails, quoteNumber, quoteDate, expiryDate, reference, salesPerson } = data;

  if (layoutStyle === 'SPREADSHEET') {
    return (
      <header className="border border-gray-300 mb-2">
        {/* Top row: Company info + Logo + QUOTE title */}
        <div className="flex border-b border-gray-300">
          {/* Left: Logo & Company Info */}
          <div className="w-3/4  p-3 text-sm text-gray-800">
            <div className="flex items-start">
              <img src={LOGO_URL} alt="Ralakde Logo" className="h-[120px] w-auto object-contain mr-2" />
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
          <div className="w-1/4 p-3 flex justify-center ">
            <h1 className="text-3xl font-semibold text-gray-800 tracking-wide mt-20">QUOTE</h1>
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
     <header className="flex  items-start border-b-2 border-gray-200 pb-10 mb-6">
      <div className="w-1/2">
        <img
          src={LOGO_URL}
          alt="Ralake Limited Logo"
          className="h-[150px] w-auto object-contain"
        />
      </div>

     <div className='-ml-10'>
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
    <header className="flex justify-between items-start mb-6">
      <div className="w-1/2">
        <img
          src={LOGO_URL}
          alt="Ralake Limited Logo"
          className="h-[150px] w-auto object-contain"
        />
      </div>

      <div className="w-1/2 text-right mt-10 mr-10">
        <h1 className="text-4xl font-light text-blue-800 mb-1">{data.quoteType}</h1>
        <p className="text-sm text-gray-700">
          {data.quoteType}# <span className="font-semibold">{data.quoteNumber}</span>
        </p>
      </div>
    </header>
  );
};

export default PdfHeader;
