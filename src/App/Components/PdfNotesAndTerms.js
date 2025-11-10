import React from 'react';

const PdfNotesAndTerms = ({ data, layoutStyle, templateConfig }) => {
    // Use default configuration if templateConfig is not provided
    const config = templateConfig?.otherDetails || {
        showNotes: true,
        notesLabel: 'Notes',
        notesFontSize: 8,
        showTerms: true,
        termsLabel: 'Terms & Conditions',
        termsFontSize: 8,
        showSignature: false,
        signatureLabel: 'Authorized Signature',
        showAnnexure: false
    };

    if (layoutStyle === 'SPREADSHEET') {
        return (
            <div className="text-xs border border-gray-300">
                {/* Notes Section */}
                {config.showNotes && (
                    <div className="p-4">
                        <h3 className="font-bold mb-1" style={{ fontSize: `${config.notesFontSize + 2}pt` }}>
                            {config.notesLabel}
                        </h3>
                        <p className="mb-1 text-gray-700" style={{ fontSize: `${config.notesFontSize}pt` }}>
                            {data.notes || 'Add specific notes here.'}
                        </p>
                        <p className="text-gray-600" style={{ fontSize: `${config.notesFontSize}pt` }}>
                            {data.notes2 || 'Additional notes or payment instructions.'}
                        </p>
                    </div>
                )}

                {/* Terms & Conditions Section */}
                {config.showTerms && (
                    <div className="p-4">
                        <h3 className="font-bold mb-1" style={{ fontSize: `${config.termsFontSize + 2}pt` }}>
                            {config.termsLabel}
                        </h3>
                        <p className="text-gray-700 leading-tight mb-2" style={{ fontSize: `${config.termsFontSize}pt` }}>
                            {data.terms || 'Unless specified, prices exclude installation. Payment terms: 30 days net. Validity: 30 days.'}
                        </p>
                        {data.termsLink && (
                            <p className="text-blue-700 leading-tight" style={{ fontSize: `${config.termsFontSize}pt` }}>
                                {data.termsLink}
                            </p>
                        )}
                    </div>
                )}

                {/* Signature Section */}
                {config.showSignature && (
                    <div className="p-4 border-t border-gray-300">
                        <div className="mt-8">
                            <p className="text-xs font-medium">{config.signatureLabel}</p>
                            <div className="border-b border-gray-400 w-64 mt-2"></div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Default/Standard Layout
    return (
        <footer className="mt-16 text-xs">
            {/* Notes Section */}
            {config.showNotes && (
                <>
                    <h3 className="font-bold mb-1" style={{ fontSize: `${config.notesFontSize + 2}pt` }}>
                        {config.notesLabel}
                    </h3>
                    <p className="mb-1" style={{ fontSize: `${config.notesFontSize}pt` }}>
                        {data.notes}
                    </p>
                    <p className="mb-4 text-gray-600 border-b border-gray-200 pb-4" style={{ fontSize: `${config.notesFontSize}pt` }}>
                        {data.notes2}
                    </p>
                </>
            )}

            {/* Terms & Conditions Section */}
            {config.showTerms && (
                <>
                    <h3 className="font-bold mb-1" style={{ fontSize: `${config.termsFontSize + 2}pt` }}>
                        {config.termsLabel}
                    </h3>
                    <p className="text-gray-700 leading-tight mb-2" style={{ fontSize: `${config.termsFontSize}pt` }}>
                        {data.terms}
                    </p>
                    <p className="text-blue-700 leading-tight" style={{ fontSize: `${config.termsFontSize}pt` }}>
                        {data.termsLink}
                    </p>
                </>
            )}

            {/* Signature Section */}
            {config.showSignature && (
                <div className="mt-8">
                    <p className="text-xs font-medium">{config.signatureLabel}</p>
                    <div className="border-b border-gray-400 w-64 mt-2"></div>
                </div>
            )}
        </footer>
    );
};

export default PdfNotesAndTerms;
