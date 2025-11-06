import React from 'react';

const PdfDetails = ({ data, themeColor }) => {
  const { companyDetails, billingDetails, quoteDate, expiryDate, salesPerson, reference, vatNo, quoteNumber, layoutStyle } = data;

  const themeHex = {
    'blue-800': '#1e40af',
    'green-700': '#047857',
    'purple-800': '#581c87',
  }[themeColor] || '#1e40af';

  const DetailLine = ({ label, value, labelClass = 'font-normal', valueClass = 'font-semibold' }) => (
  <p className="flex justify-between items-start text-sm text-gray-700">
    <span className={labelClass}>{label}:</span>
    <span className={`text-right ${valueClass}`}>{value}</span>
  </p>
);

  // --- Billing Address Block ---
  const renderBillingAddress = () => (
    <div className="text-sm leading-tight text-gray-800 space-y-0.5 p-2">
      <p className="font-bold mb-1">Bill To</p>
      <p className="font-semibold">{billingDetails.name}</p>
      <p>{billingDetails.addressLine1}</p>
      <p>{billingDetails.addressLine2}</p>
      <p>{billingDetails.zip}</p>
      <p>{billingDetails.country}</p>
    </div>
  );

  // --- Company Address Block ---
  const renderCompanyAddress = () => (
    <div className="text-sm leading-tight text-gray-800 space-y-0.5 p-2">
      <p className="font-bold mb-1" style={{ color: themeHex }}>{companyDetails.name}</p>
      <p>{companyDetails.addressLine1}</p>
      <p>{companyDetails.addressLine2}</p>
      <p>{companyDetails.country}</p>
      <p>VAT {companyDetails.vat}</p>
      <p>{companyDetails.phone}</p>
      <p>{companyDetails.email}</p>
      <p>{companyDetails.website}</p>
    </div>
  );

  // --- Spreadsheet Layout (with Grid Lines) ---
  if (layoutStyle === 'SPREADSHEET') {
    return (
      <div className="border border-gray-300 mb-4 text-gray-800 -mt-2">
        <div className="flex border-b border-gray-300">
          {/* Left: Bill To */}
          <div className="w-1/2 ">
            {renderBillingAddress()}
          </div>

         
        </div>

        {/* Subject & Description Fields */}
        <div className="">
          <div className=" p-2 text-sm">Subject :</div>
          <div className="p-2 text-sm">Description</div>
        </div>
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
          <div class='my-10 bg-green-300 w-60 h-40  flex flex-col justify-center items-center'>
            <h1 className='text-lg text-white '>Amount Paid</h1>
            <h1 className='text-xl text-white '>AMOunt</h1>
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
    <div className={`p-4 w-full`}>
      <DetailLine label="Quote Date" value={quoteDate} />
      <DetailLine label="Expiry Date" value={expiryDate} />
      <DetailLine label="Reference#" value={reference} />
      <DetailLine label="Sales person" value={salesPerson} />
      <DetailLine label="VAT No." value={vatNo} />
    </div>
  );

  // --- Default Layout (Standard/EU) ---
 // --- Default Layout (Standard/EU) ---
return (
  <div className="flex flex-col sm:flex-row justify-between mt-4 mb-8 w-full">
    {/* Left side: Company + Billing */}
    <div className=" w-full sm:w-2/3 gap-4">
      <div className="w-full sm:w-1/2">
        {renderCompanyAddress()}
      </div>

      <div className="w-full sm:w-1/2">
        {renderBillingAddress()}
      </div>
            <div className="w-full sm:w-1/2 ml-2">
            <p>Subject :</p>
            <p>Description</p>
</div>
    </div>

    {/* Right side: Quote Details */}
    <div className="w-full sm:w-1/3 sm:self-start mt-24 sm:mt-20">
      {renderStandardQuoteDetails()}
    </div>
  </div>
);

};

export default PdfDetails;
