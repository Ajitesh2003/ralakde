import React from 'react';
import { replacePlaceholders, sanitizeHtml } from '../Utils/placeholderUtils';

const PdfFooter = ({ currentPage = 1, totalPages = 1, templateConfig, data }) => {
  // Get footer customizations
  const footerConfig = templateConfig?.footer || {};
  const {
    fontSize = 10,
    textColor = '#aaaaaa',
    backgroundImage = null,
    imagePosition = 'center',
    backgroundColorEnabled = false,
    backgroundColor = '#ffffff',
    showPageNumbers = true,
    pageNumberPosition = 'right',
    pageNumberFormat = '${CurrentPageNumber}',
    enableCustomContent = false,
    customContent = '',
    customContentPosition = 'above'
  } = footerConfig;

  // Process custom content with placeholders
  const processedCustomContent = React.useMemo(() => {
    if (!enableCustomContent || !customContent) return '';

    // Create extended data object with page numbers
    const extendedData = {
      ...data,
      currentPage,
      totalPages
    };

    const replaced = replacePlaceholders(customContent, extendedData, data?.companyDetails);
    return sanitizeHtml(replaced);
  }, [enableCustomContent, customContent, data, currentPage, totalPages]);

  // Helper to format page number based on selected format with placeholder support
  const formatPageNumber = () => {
    return pageNumberFormat
      .replace(/\$\{CurrentPageNumber\}/g, currentPage.toString())
      .replace(/\$\{TotalPages\}/g, totalPages.toString());
  };

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

  // Helper to get page number alignment
  const getPageNumberAlignment = () => {
    const alignments = {
      'left': 'text-left justify-start',
      'center': 'text-center justify-center',
      'right': 'text-right justify-end',
    };
    return alignments[pageNumberPosition] || 'text-right justify-end';
  };

  // Footer wrapper styles
  const footerStyle = {
    backgroundColor: backgroundColorEnabled ? backgroundColor : 'transparent',
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: getImagePositionStyles(),
    backgroundRepeat: 'no-repeat',
    color: textColor,
    fontSize: `${fontSize}pt`,
  };

  // Custom Content Component
  const CustomContent = () => {
    if (!processedCustomContent) return null;

    return (
      <div
        className="custom-footer-content mb-2"
        dangerouslySetInnerHTML={{ __html: processedCustomContent }}
      />
    );
  };

  // Page Numbers Component
  const PageNumbers = () => {
    if (!showPageNumbers) return null;

    return (
      <div className={`flex ${getPageNumberAlignment()} pb-2`} style={{ color: textColor, fontSize: `${fontSize}pt` }}>
        <p>{formatPageNumber()}</p>
      </div>
    );
  };

  return (
    <div className="w-full mt-8 pt-4 border-t" style={footerStyle}>
      {/* Render content based on position setting */}
      {customContentPosition === 'replace' && enableCustomContent ? (
        <CustomContent />
      ) : (
        <>
          {customContentPosition === 'above' && <CustomContent />}
          <PageNumbers />
          {customContentPosition === 'below' && <CustomContent />}
        </>
      )}
    </div>
  );
};

export default PdfFooter;
