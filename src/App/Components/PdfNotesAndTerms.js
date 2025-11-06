import React from 'react';

const PdfNotesAndTerms = ({ data, layoutStyle }) => {
    // Note: Assuming 'data' contains { notes, notes2, terms, termsLink, layoutStyle }

    if (layoutStyle === 'SPREADSHEET') {
        return (
            // Outer container: Full border for the Notes/Terms block
            <div className="mt-5 text-xs border border-gray-300 ">
                
                {/* Left Column: Notes Section (w-1/2) */}
                <div className="p-4 w-1/2">
                    <h3 className="font-bold text-sm mb-1">Notes</h3>
                    <p className="mb-1 text-gray-700">{data.notes || 'Add specific notes here.'}</p>
                    <p className="text-gray-600">{data.notes2 || 'Additional notes or payment instructions.'}</p>
                </div>

                {/* Right Column: Terms & Conditions Section (w-1/2) */}
                <div className="p-4 w-1/2">
                    <h3 className="font-bold text-sm mb-1">Terms & Conditions</h3>
                    <p className="text-[10px] text-gray-700 leading-tight mb-2">
                        {data.terms || 'Unless specified, prices exclude installation. Payment terms: 30 days net. Validity: 30 days.'}
                    </p>
                    {data.termsLink && (
                        <p className="text-[10px] text-blue-700 leading-tight">
                            {data.termsLink}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    // Default/Standard Layout
    return (
        <footer className="mt-16 text-xs">
            {/* Notes Section */}
            <h3 className="font-bold text-sm mb-1">Notes</h3>
            <p className="mb-1">{data.notes}</p>
            <p className="mb-4 text-gray-600 border-b border-gray-200 pb-4">{data.notes2}</p>

            {/* Terms & Conditions Section */}
            <h3 className="font-bold text-sm mb-1">Terms & Conditions</h3>
            <p className="text-[10px] text-gray-700 leading-tight mb-2">{data.terms}</p>
            <p className="text-[10px] text-blue-700 leading-tight">
                {data.termsLink}
            </p>
        </footer>
    );
};

export default PdfNotesAndTerms;