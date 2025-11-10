import React from 'react';

const PdfFooter = ({ currentPage = 1, totalPages = 1, templateConfig }) => {
  // Get footer customizations
  const footerConfig = templateConfig?.footer || {};
  const {
    backgroundColor = '#ffffff',
    textColor = '#666666',
    fontSize = 10,
    showPageNumbers = true,
    pageNumberFormat = 'Page X',
    showSeparatorLine = true,
  } = footerConfig;

  // Helper to format page number based on selected format
  const formatPageNumber = () => {
    switch (pageNumberFormat) {
      case 'Page X':
        return `Page ${currentPage}`;
      case 'X of Y':
        return `${currentPage} of ${totalPages}`;
      case 'X / Y':
        return `${currentPage} / ${totalPages}`;
      default:
        return `Page ${currentPage}`;
    }
  };

  // Footer wrapper styles
  const footerStyle = {
    backgroundColor,
    color: textColor,
    fontSize: `${fontSize}px`,
  };

  return (
    // This div is structured to sit at the bottom of the A4 page container.
    // The classes 'print:fixed' and 'print:bottom-0' are crucial for forcing
    // the footer to the bottom of the viewport/page in print preview.
    // However, since we are simulating an A4 container, standard CSS padding/margin
    // is used for display, and we rely on print styles for actual printing.
    <div className="absolute bottom-0 w-full pt-4 print:pt-0" style={footerStyle}>
      {/* Footer Line (only visible on print/download) */}
      {showSeparatorLine && (
        <div className="print:block hidden border-t mb-2" style={{ borderColor: textColor }}></div>
      )}

      {/* Page Numbering (only visible on print/download) */}
      {showPageNumbers && (
        <div className="text-right print:block hidden" style={{ color: textColor, fontSize: `${fontSize}px` }}>
          {/* Note: Browser print preview will handle the actual page count (totalPages).
              This is a placeholder for the PDF generation library (like jsPDF)
              to inject the correct numbering dynamically. */}
          <p>{formatPageNumber()}</p>
        </div>
      )}
    </div>
  );
};

export default PdfFooter;
