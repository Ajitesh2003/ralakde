import React from 'react';
import LOGO_URL from '../Assets/logo.webp';
import { replacePlaceholders, sanitizeHtml } from '../Utils/placeholderUtils';

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
    enableCustomContent = false,
    customContent = '',
    customContentPosition = 'below'
  } = headerConfig;

  // Process custom content with placeholders
  const processedCustomContent = React.useMemo(() => {
    if (!enableCustomContent || !customContent) return '';
    const replaced = replacePlaceholders(customContent, data, companyDetails);
    return sanitizeHtml(replaced);
  }, [enableCustomContent, customContent, data, companyDetails]);

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

  // Custom content component
  const CustomContent = () => {
    if (!enableCustomContent || !processedCustomContent) return null;
    return (
      <div
        className="custom-header-content py-3 px-4"
        dangerouslySetInnerHTML={{ __html: processedCustomContent }}
      />
    );
  };

  if (layoutStyle === 'SPREADSHEET') {
    // If custom content replaces header
    if (customContentPosition === 'replace' && enableCustomContent && processedCustomContent) {
      return (
        <header className="border border-gray-300" style={headerWrapperStyle}>
          <CustomContent />
        </header>
      );
    }

    return (
      <header className="border border-gray-300" style={headerWrapperStyle}>
        {/* Custom content above */}
        {customContentPosition === 'above' && <CustomContent />}

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
            {templateConfig?.transactionDetails?.showDocumentTitle && (
              <h1
                className="font-semibold tracking-wide mt-8"
                style={{
                  color: templateConfig.transactionDetails.documentTitleColor || '#034287',
                  fontSize: `${templateConfig.transactionDetails.documentTitleFontSize || 28}pt`
                }}
              >
                {(templateConfig.transactionDetails.documentTitleText || 'Quote').toUpperCase()}
              </h1>
            )}
          </div>
        </div>

        {/* Second row: Quote metadata grid */}
        <div className="flex text-sm">
          {/* Left side (Quote details) */}
          <div className="w-3/4 grid grid-cols-2 border-r border-gray-300">
            {/* Quote Number */}
            {templateConfig?.transactionDetails?.showNumberField && (
              <>
                <div className="border-b border-gray-300 p-2 font-medium">{templateConfig.transactionDetails.numberFieldLabel || 'Quote#'}</div>
                <div className="border-b border-gray-300 p-2">: {quoteNumber}</div>
              </>
            )}

            {/* Quote Date */}
            {templateConfig?.transactionDetails?.showDateField && (
              <>
                <div className="border-b border-gray-300 p-2 font-medium">{templateConfig.transactionDetails.dateFieldLabel || 'Quote Date'}</div>
                <div className="border-b border-gray-300 p-2">: {quoteDate}</div>
              </>
            )}

            {/* Expiry Date */}
            {templateConfig?.transactionDetails?.showExpiryDate && (
              <>
                <div className="border-b border-gray-300 p-2 font-medium">{templateConfig.transactionDetails.expiryDateLabel || 'Expiry Date'}</div>
                <div className="border-b border-gray-300 p-2">: {expiryDate}</div>
              </>
            )}

            {/* VAT Number */}
            {templateConfig?.transactionDetails?.showVATNumber && (
              <>
                <div className="border-b border-gray-300 p-2 font-medium">{templateConfig.transactionDetails.vatNumberLabel || 'VAT No.'}</div>
                <div className="border-b border-gray-300 p-2">: {data.vatNo}</div>
              </>
            )}

            {/* Reference Field */}
            {templateConfig?.transactionDetails?.showReferenceField && (
              <>
                <div className={`p-2 font-medium ${(templateConfig?.transactionDetails?.showProject || templateConfig?.transactionDetails?.phone || templateConfig?.transactionDetails?.fax) ? 'border-b border-gray-300' : ''}`}>{templateConfig.transactionDetails.referenceFieldLabel || 'Reference#'}</div>
                <div className={`p-2 ${(templateConfig?.transactionDetails?.showProject || templateConfig?.transactionDetails?.phone || templateConfig?.transactionDetails?.fax) ? 'border-b border-gray-300' : ''}`}>: {reference}</div>
              </>
            )}

            {/* Project */}
            {templateConfig?.transactionDetails?.showProject && (
              <>
                <div className={`p-2 font-medium ${(templateConfig?.transactionDetails?.phone || templateConfig?.transactionDetails?.fax) ? 'border-b border-gray-300' : ''}`}>{templateConfig.transactionDetails.projectLabel || 'Project Name'}</div>
                <div className={`p-2 ${(templateConfig?.transactionDetails?.phone || templateConfig?.transactionDetails?.fax) ? 'border-b border-gray-300' : ''}`}>: N/A</div>
              </>
            )}

            {/* Phone field */}
            {templateConfig?.transactionDetails?.phone && templateConfig.transactionDetails.phone.trim() !== '' && (
              <>
                <div className={`p-2 font-medium ${templateConfig?.transactionDetails?.fax ? 'border-b border-gray-300' : ''}`}>Phone</div>
                <div className={`p-2 ${templateConfig?.transactionDetails?.fax ? 'border-b border-gray-300' : ''}`}>: {templateConfig.transactionDetails.phone}</div>
              </>
            )}

            {/* Fax field */}
            {templateConfig?.transactionDetails?.fax && templateConfig.transactionDetails.fax.trim() !== '' && (
              <>
                <div className="p-2 font-medium">Fax</div>
                <div className="p-2">: {templateConfig.transactionDetails.fax}</div>
              </>
            )}
          </div>

          {/* Right side (Salesperson cell) */}
          <div className="w-1/4 grid grid-cols-2">
            {templateConfig?.transactionDetails?.showSalesperson && (
              <>
                <div className="border-b border-gray-300 p-2 font-medium">{templateConfig.transactionDetails.salespersonLabel || 'Sales person'}</div>
                <div className="border-b border-gray-300 p-2">: {salesPerson}</div>
              </>
            )}
          </div>
        </div>

        {/* Custom content below */}
        {customContentPosition === 'below' && <CustomContent />}
      </header>
    );
  }

  if (layoutStyle === 'ELITE') {
    // If custom content replaces header
    if (customContentPosition === 'replace' && enableCustomContent && processedCustomContent) {
      return (
        <header className="border-b-2 border-gray-200 mb-6" style={headerWrapperStyle}>
          <CustomContent />
        </header>
      );
    }

    return(
     <header style={headerWrapperStyle}>
       {/* Custom content above */}
       {customContentPosition === 'above' && <CustomContent />}

       <div className="flex items-start border-b-2 border-gray-200 pb-10 mb-6">
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
       </div>

       {/* Custom content below */}
       {customContentPosition === 'below' && <CustomContent />}
    </header>
    );
  }

  // Default header (for Standard/EU layouts)
  // If custom content replaces header
  if (customContentPosition === 'replace' && enableCustomContent && processedCustomContent) {
    return (
      <header className="mb-6" style={headerWrapperStyle}>
        <CustomContent />
      </header>
    );
  }

  return (
    <header style={headerWrapperStyle}>
      {/* Custom content above */}
      {customContentPosition === 'above' && <CustomContent />}

      <div className="flex justify-between items-start mb-6">
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
      </div>

      {/* Custom content below */}
      {customContentPosition === 'below' && <CustomContent />}
    </header>
  );
};

export default PdfHeader;
