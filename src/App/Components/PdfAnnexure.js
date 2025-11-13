import React from 'react';

const PdfAnnexure = ({ templateConfig }) => {
    // Get annexure configuration from templateConfig
    const config = templateConfig?.otherDetails || {
        showAnnexure: false,
        annexureLabel: 'Annexure',
        annexureContent: '',
        annexureFontSize: 8
    };

    if (!config.showAnnexure || !config.annexureContent) {
        return null;
    }

    return (
        <div className="annexure-page">
            {/* Annexure Title */}
            <h1 className="text-2xl font-bold mb-6 text-gray-800">
                {config.annexureLabel}
            </h1>

            {/* Annexure Content */}
            <div
                className="annexure-content text-gray-700 leading-relaxed"
                style={{ fontSize: `${config.annexureFontSize}pt` }}
                dangerouslySetInnerHTML={{ __html: config.annexureContent }}
            />
        </div>
    );
};

export default PdfAnnexure;
