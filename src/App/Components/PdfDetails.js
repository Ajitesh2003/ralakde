import React from 'react';
import LOGO_URL from '../Assets/logo.webp';

const PdfDetails = ({ data, themeColor, templateConfig }) => {
  const { companyDetails, billingDetails, shippingDetails, quoteDate, expiryDate, salesPerson, reference, vatNo, quoteNumber, layoutStyle } = data;

  // Get transaction details customizations
  const transConfig = templateConfig?.transactionDetails || {};

  // Debug logging
  console.log('PdfDetails - transConfig:', transConfig);
  console.log('PdfDetails - phone:', transConfig.phone);
  console.log('PdfDetails - fax:', transConfig.fax);
  console.log('PdfDetails - showAttentionContent:', transConfig.showAttentionContent);
  console.log('PdfDetails - attentionContent:', transConfig.attentionContent);
  console.log('PdfDetails - layoutStyle:', layoutStyle);

  const themeHex = {
    'blue-800': '#1e40af',
    'green-700': '#047857',
    'purple-800': '#581c87',
  }[themeColor] || '#1e40af';

  // Helper to get logo size in pixels
  const getLogoSize = () => {
    const sizes = {
      'small': 50,
      'medium': 80,
      'large': 120,
    };
    return sizes[transConfig.orgLogoSize] || 80;
  };

  const DetailLine = ({ label, value, labelClass = 'font-normal', valueClass = 'font-semibold' }) => (
  <p className="flex justify-between items-start text-sm" style={{ color: templateConfig.fontColor || '#374151', fontSize: `${templateConfig.fontSize || 9}pt` }}>
    <span className={labelClass} style={{ color: templateConfig.labelColor || '#374151' }}>{label}:</span>
    <span className={`text-right ${valueClass}`}>{value}</span>
  </p>
);

  // --- Billing Address Block ---
  const renderBillingAddress = () => {
    if (!transConfig.showBillTo) return null;

    return (
      <div className="text-sm leading-tight space-y-0.5 p-2" style={{ color: templateConfig.fontColor || '#1f2937', fontSize: `${templateConfig.fontSize || 9}pt` }}>
        <p className="font-bold mb-1" style={{ color: templateConfig.labelColor || '#1f2937' }}>{transConfig.billToLabel || 'Bill To'}</p>
        <p
          className="font-semibold"
          style={{
            color: transConfig.customerNameColor || templateConfig.fontColor || '#333333',
            fontSize: `${transConfig.customerNameFontSize || templateConfig.fontSize || 9}pt`
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

    // Using shipping details
    const shipDetails = shippingDetails || billingDetails; // Fallback to billing if shipping not available
    return (
      <div className="text-sm leading-tight space-y-0.5 p-2" style={{ color: templateConfig.fontColor || '#1f2937', fontSize: `${templateConfig.fontSize || 9}pt` }}>
        <p className="font-bold mb-1" style={{ color: templateConfig.labelColor || '#1f2937' }}>{transConfig.shipToLabel || 'Ship To'}</p>
        <p
          className="font-semibold"
          style={{
            color: transConfig.customerNameColor || templateConfig.fontColor || '#333333',
            fontSize: `${transConfig.customerNameFontSize || templateConfig.fontSize || 9}pt`
          }}
        >
          {shipDetails.name}
        </p>
        <p>{shipDetails.addressLine1}</p>
        <p>{shipDetails.addressLine2}</p>
        <p>{shipDetails.zip}</p>
        <p>{shipDetails.country}</p>
      </div>
    );
  };

  // --- Company Address Block ---
  const renderCompanyAddress = () => (
    <div className="text-sm leading-tight space-y-0.5 p-2" style={{ color: templateConfig.fontColor || '#1f2937', fontSize: `${templateConfig.fontSize || 9}pt` }}>
      {transConfig.showOrgLogo && (
        <img
          src={transConfig.orgLogo || LOGO_URL}
          alt="Company Logo"
          style={{
            maxHeight: `${getLogoSize()}px`,
            width: 'auto',
            objectFit: 'contain',
            marginBottom: '8px'
          }}
        />
      )}
      {transConfig.showOrgName && (
        <p
          className="font-bold mb-1"
          style={{
            color: transConfig.orgNameColor || themeHex,
            fontSize: `${transConfig.orgNameFontSize || templateConfig.fontSize || 10}pt`
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
          <p><span style={{ color: templateConfig.labelColor || '#1f2937' }}>VAT</span> {companyDetails.vat}</p>
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

        {/* Attention Content */}
        {transConfig.showAttentionContent && transConfig.attentionContent && (
          <div className="border-t border-gray-300 p-2">
            <p className="font-semibold text-sm mb-1">Attention:</p>
            <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{transConfig.attentionContent}</p>
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
            {transConfig.phone && transConfig.phone.trim() !== '' && (
              <div className='text-lg text-gray-400 mt-5'>Phone</div>
            )}
            {transConfig.fax && transConfig.fax.trim() !== '' && (
              <div className='text-lg text-gray-400 mt-5'>Fax</div>
            )}
          </div>
          <div className='my-10'>
            <div className='text-lg text-black-400 mt-5 border-b-2 border-gray-200'>Payment#</div>
            <div className='text-lg text-black-400 mt-5 border-b-2 border-gray-200'>Payment Date</div>
            <div className='text-lg text-black-400 mt-5 border-b-2 border-gray-200'>Reference Number</div>
            <div className='text-lg text-black-400 mt-5 border-b-2 border-gray-200'>Paid To</div>
            <div className='text-lg text-black-400 mt-5 border-b-2 border-gray-200'>Payment Mode</div>
            <div className='text-lg text-black-400 mt-5 border-b-2 border-gray-200'>Paid Through</div>
            {transConfig.phone && transConfig.phone.trim() !== '' && (
              <div className='text-lg text-black-400 mt-5 border-b-2 border-gray-200'>{transConfig.phone}</div>
            )}
            {transConfig.fax && transConfig.fax.trim() !== '' && (
              <div className='text-lg text-black-400 mt-5 border-b-2 border-gray-200'>{transConfig.fax}</div>
            )}
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

      {/* Attention Content */}
      {transConfig.showAttentionContent && transConfig.attentionContent && (
        <div className="mb-8">
          <p className="font-semibold text-base mb-2">Attention:</p>
          <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{transConfig.attentionContent}</p>
        </div>
      )}

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
      {(() => {
        const shouldShowPhone = transConfig.phone && transConfig.phone.trim() !== '';
        console.log('Should show phone?', shouldShowPhone, transConfig.phone);
        return shouldShowPhone;
      })() && (
        <DetailLine label="Phone" value={transConfig.phone} />
      )}
      {(() => {
        const shouldShowFax = transConfig.fax && transConfig.fax.trim() !== '';
        console.log('Should show fax?', shouldShowFax, transConfig.fax);
        return shouldShowFax;
      })() && (
        <DetailLine label="Fax" value={transConfig.fax} />
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

      {transConfig.showAttentionContent && transConfig.attentionContent && (
        <div className="w-full mt-4 ml-2">
          <p className="font-semibold mb-2">Attention:</p>
          <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{transConfig.attentionContent}</p>
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
