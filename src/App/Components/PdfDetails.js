import React from 'react';
import LOGO_URL from '../Assets/logo.webp';

const PdfDetails = ({ data, themeColor, templateConfig }) => {
  const { companyDetails, billingDetails, quoteDate, expiryDate, salesPerson, reference, vatNo, quoteNumber, layoutStyle } = data;

  // Get transaction details customizations
  const transConfig = templateConfig?.transactionDetails || {};

  const themeHex = {
    'blue-800': '#1e40af',
    'green-700': '#047857',
    'purple-800': '#581c87',
  }[themeColor] || '#1e40af';

  // Helper to get logo size class
  const getLogoSizeClass = () => {
    const sizes = {
      'small': 'max-h-[50px]',
      'medium': 'max-h-[80px]',
      'large': 'max-h-[120px]',
    };
    return sizes[transConfig.orgLogoSize] || 'max-h-[80px]';
  };

  const DetailLine = ({ label, value, labelClass = 'font-normal', valueClass = 'font-semibold' }) => (
  <p className="flex justify-between items-start text-sm text-gray-700">
    <span className={labelClass}>{label}:</span>
    <span className={`text-right ${valueClass}`}>{value}</span>
  </p>
);

  // --- Billing Address Block ---
  const renderBillingAddress = () => {
    if (!transConfig.showBillTo) return null;

    return (
      <div className="text-sm leading-tight text-gray-800 space-y-0.5 p-2">
        <p className="font-bold mb-1">{transConfig.billToLabel || 'Bill To'}</p>
        <p
          className="font-semibold"
          style={{
            color: transConfig.customerNameColor || '#333333',
            fontSize: `${transConfig.customerNameFontSize || 9}pt`
          }}
        >
          {billingDetails.name}
        </p>
        <p>{billingDetails.addressLine1}</p>
        <p>{billingDetails.addressLine2}</p>
        <p>{billingDetails.zip}</p>
        <p>{billingDetails.country}</p>
      </div>
    );
  };

  // --- Ship To Address Block ---
  const renderShipToAddress = () => {
    if (!transConfig.showShipTo) return null;

    // Using billing details as ship to for now (can be extended to use separate shipping data)
    return (
      <div className="text-sm leading-tight text-gray-800 space-y-0.5 p-2">
        <p className="font-bold mb-1">{transConfig.shipToLabel || 'Ship To'}</p>
        <p
          className="font-semibold"
          style={{
            color: transConfig.customerNameColor || '#333333',
            fontSize: `${transConfig.customerNameFontSize || 9}pt`
          }}
        >
          {billingDetails.name}
        </p>
        <p>{billingDetails.addressLine1}</p>
        <p>{billingDetails.addressLine2}</p>
        <p>{billingDetails.zip}</p>
        <p>{billingDetails.country}</p>
      </div>
    );
  };

  // --- Company Address Block ---
  const renderCompanyAddress = () => (
    <div className="text-sm leading-tight text-gray-800 space-y-0.5 p-2">
      {transConfig.showOrgLogo && (
        <img
          src={LOGO_URL}
          alt="Company Logo"
          className={`${getLogoSizeClass()} w-auto object-contain mb-2`}
        />
      )}
      {transConfig.showOrgName && (
        <p
          className="font-bold mb-1"
          style={{
            color: transConfig.orgNameColor || themeHex,
            fontSize: `${transConfig.orgNameFontSize || 10}pt`
          }}
        >
          {companyDetails.name}
        </p>
      )}
      {transConfig.showOrgAddress && (
        <>
          <p>{companyDetails.addressLine1}</p>
          <p>{companyDetails.addressLine2}</p>
          <p>{companyDetails.country}</p>
          <p>VAT {companyDetails.vat}</p>
          <p>{companyDetails.phone}</p>
          <p>{companyDetails.email}</p>
          <p>{companyDetails.website}</p>
        </>
      )}
    </div>
  );

  // --- Spreadsheet Layout (with Grid Lines) ---
  if (layoutStyle === 'SPREADSHEET') {
    return (
      <div className="border border-gray-300 text-gray-800 ">
        <div className="flex border-b border-gray-300">
          {/* Left: Bill To */}
          <div className="w-1/2 ">
            {renderBillingAddress()}
          </div>

          {/* Right: Ship To (if enabled) */}
          {transConfig.showShipTo && (
            <div className="w-1/2 border-l border-gray-300">
              {renderShipToAddress()}
            </div>
          )}
        </div>

        {/* Subject & Description Fields */}
        {transConfig.showSubject && (
          <div className="">
            <div className=" p-2 text-sm">{transConfig.subjectLabel || 'Subject'} :</div>
            <div className="p-2 text-sm">Description</div>
          </div>
        )}
      </div>
    );
  }

  if (layoutStyle === 'ELITE'){
    return(
      <div className='mt-4 mb-8 w-full border-b-2 border-gray-300'>
        <h1 className='text-center text-xl'>PAYMENTS MADE</h1>

        <div className='flex justify-between items-start mb-10'>
          <div className='my-10'>
            <div className='text-lg text-gray-400 mt-5'>Payment#</div>
            <div className='text-lg text-gray-400 mt-5'>Payment Date</div>
            <div className='text-lg text-gray-400 mt-5'>Reference Number</div>
            <div className='text-lg text-gray-400 mt-5'>Paid To</div>
            <div className='text-lg text-gray-400 mt-5'>Payment Mode</div>
            <div className='text-lg text-gray-400 mt-5'>Paid Through</div>
          </div>
          <div className='my-10'>
            <div className='text-lg text-black-400 mt-5 border-b-2 border-gray-200'>Payment#</div>
            <div className='text-lg text-black-400 mt-5 border-b-2 border-gray-200'>Payment Date</div>
            <div className='text-lg text-black-400 mt-5 border-b-2 border-gray-200'>Reference Number</div>
            <div className='text-lg text-black-400 mt-5 border-b-2 border-gray-200'>Paid To</div>
            <div className='text-lg text-black-400 mt-5 border-b-2 border-gray-200'>Payment Mode</div>
            <div className='text-lg text-black-400 mt-5 border-b-2 border-gray-200'>Paid Through</div>
          </div>
          <div className='my-10 bg-green-300 w-40 h-32 flex flex-col justify-center items-center'>
            <h1 className='text-sm text-white '>Amount Paid</h1>
            <h1 className='text-base text-white '>AMOunt</h1>
          </div>
        </div>

      <div className='mb-10'>
        <div className='font-bold text-gray-400 mb-5'>Paid To</div>
        <div className='font-bold text-black-400 text-lg'>TestLinkage</div>
        <div className=' text-black-400'>demo</div>
        <div className=' text-black-400'>United Kingdom</div>
      </div>

      </div>
    )
  }

   const renderStandardQuoteDetails = () => (
    <div className="p-3 w-full">
      {transConfig.showDocumentTitle && (
        <h2
          className="font-bold mb-3"
          style={{
            color: transConfig.documentTitleColor || '#034287',
            fontSize: `${transConfig.documentTitleFontSize || 28}pt`
          }}
        >
          {transConfig.documentTitleText || 'Quote'}
        </h2>
      )}
      {transConfig.showNumberField && (
        <DetailLine label={transConfig.numberFieldLabel || 'Quote#'} value={quoteNumber} />
      )}
      {transConfig.showDateField && (
        <DetailLine label={transConfig.dateFieldLabel || 'Quote Date'} value={quoteDate} />
      )}
      {transConfig.showExpiryDate && (
        <DetailLine label={transConfig.expiryDateLabel || 'Expiry Date'} value={expiryDate} />
      )}
      {transConfig.showReferenceField && (
        <DetailLine label={transConfig.referenceFieldLabel || 'Reference#'} value={reference} />
      )}
      {transConfig.showSalesperson && (
        <DetailLine label={transConfig.salespersonLabel || 'Sales person'} value={salesPerson} />
      )}
      {transConfig.showVATNumber && (
        <DetailLine label={transConfig.vatNumberLabel || 'VAT No.'} value={vatNo} />
      )}
      {transConfig.showProject && (
        <DetailLine label={transConfig.projectLabel || 'Project Name'} value="N/A" />
      )}
    </div>
  );

  // --- Default Layout (Standard/EU) ---
return (
  <div className="flex flex-col sm:flex-row justify-between mt-4 mb-6 w-full">
    {/* Left side: Company + Billing + Ship To */}
    <div className="w-full sm:w-3/5 gap-4">
      <div className="w-full">
        {renderCompanyAddress()}
      </div>

      <div className="w-full mt-4">
        {renderBillingAddress()}
      </div>

      {transConfig.showShipTo && (
        <div className="w-full mt-4">
          {renderShipToAddress()}
        </div>
      )}

      {transConfig.showSubject && (
        <div className="w-full mt-4 ml-2">
          <p>{transConfig.subjectLabel || 'Subject'} :</p>
          <p>Description</p>
        </div>
      )}
    </div>

    {/* Right side: Quote Details */}
    <div className="w-full sm:w-2/5 sm:self-start mt-6 sm:mt-0">
      {renderStandardQuoteDetails()}
    </div>
  </div>
);

};

export default PdfDetails;
