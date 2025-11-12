import React, { useState } from 'react';
import PdfHeader from '../Components/PdfHeader';
import PdfDetails from '../Components/PdfDetails';
import PdfTable from '../Components/PdfTable';
import PdfFooter from '../Components/PdfFooter';
import PdfNotesAndTerms from '../Components/PdfNotesAndTerms';
import TopActionBar from '../Components/TopActionBar';
import TemplateEditorSidebar from '../Components/TemplateEditorSidebar';
import { useQuoteContext } from '../Context.js/NewQuoteContext';
import { Loader2 } from 'lucide-react';

// Utility function to get paper dimensions based on size and orientation
const getPaperDimensions = (paperSize, orientation) => {
    // Define paper sizes in inches (width x height in portrait mode)
    const sizes = {
        'A4': { width: 8, height: 12 },
        'A5': { width: 7, height: 12 },
        'Letter': { width: 9, height: 12 }
    };

    // Get dimensions for selected paper size (default to A4)
    let { width, height } = sizes[paperSize] || sizes['A4'];

    // Swap dimensions for landscape orientation
    if (orientation === 'landscape') {
        [width, height] = [height, width];
    }

    return { width, height };
};

// Utility component for the main printable document area
const DocumentArea = ({ children, margins = {}, fontFamily = 'Arial', paperSize = 'A4', orientation = 'portrait', backgroundImage, backgroundPosition, backgroundColor, backgroundColorEnabled }) => {
    const { width, height } = getPaperDimensions(paperSize, orientation);

    const getBackgroundStyle = () => {
        let style = {};

        // Apply background color if enabled
        if (backgroundColorEnabled && backgroundColor) {
            style.backgroundColor = backgroundColor;
        } else if (!backgroundImage) {
            style.backgroundColor = 'white';
        }

        // Apply background image if exists
        if (backgroundImage) {
            style.backgroundImage = `url(${backgroundImage})`;
            style.backgroundPosition = backgroundPosition || 'center center';
            style.backgroundRepeat = 'no-repeat';
            style.backgroundSize = 'cover';
        }

        return style;
    };

    return (
        <div
            id="pdf-document"
            className="shadow-xl rounded-lg mx-auto mb-8
                       print:shadow-none print:w-full print:max-w-full print:m-0 print:rounded-none print:mb-0"
            style={{
                width: `${width}in`,
                minHeight: `${height}in`,
                padding: `${margins.top || 0.7}in ${margins.right || 0.4}in ${margins.bottom || 0.7}in ${margins.left || 0.55}in`,
                fontFamily: fontFamily,
                boxSizing: 'border-box',
                ...getBackgroundStyle()
            }}
        >
            {children}
        </div>
    );
};

// Main Screen Component
const PdfViewerScreen = () => {
    // const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES.STANDARD);
    // const { data, loading, setTemplate } = useDocumentData(selectedTemplate);

    const {
        data,
        loading,
        templateConfig,
        updateTemplateConfig,
        saveTemplate,
        refreshPreview
    } = useQuoteContext();
    const [isPrinting, setIsPrinting] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // useEffect(() => {
    //     setTemplate(selectedTemplate);
    // }, [selectedTemplate, setTemplate]);

    const handlePrint = () => {
        setIsPrinting(true);
        // Delay print call to ensure isPrinting state change is applied to components
        setTimeout(() => {
            window.print();
            setIsPrinting(false);
        }, 50);
    };
    if (loading || !data) {
        return (
            <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center justify-center">
                <div className="flex items-center text-gray-600 text-lg">
                    <Loader2 className="animate-spin w-6 h-6 mr-3" />
                    Loading document data...
                </div>
            </div>
        );
    }

    const { quoteType, items, subTotal, discount, vatAmount, total, currency } = data;

    return (
        <>
            <style>
                {`
                    @media print {
                        @page {
                            size: ${templateConfig.paperSize} ${templateConfig.orientation};
                            margin: 0;
                        }

                        body * {
                            visibility: hidden;
                        }
                        #pdf-document, #pdf-document * {
                            visibility: visible;
                        }
                        #pdf-document {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                        }
                    }
                `}
            </style>

            {/* Top Action Bar */}
            <TopActionBar
                onSave={saveTemplate}
                onRefresh={refreshPreview}
                onClose={() => window.history.back()}
                selectedTheme={templateConfig.themeColor}
                onThemeChange={(theme) => updateTemplateConfig({ ...templateConfig, themeColor: theme })}
                isSidebarOpen={isSidebarOpen}
                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            {/* Template Editor Sidebar */}
            <TemplateEditorSidebar
                templateConfig={templateConfig}
                onConfigChange={updateTemplateConfig}
                isOpen={isSidebarOpen}
            />

            {/* Main Content Area - shifted right to accommodate sidebar */}
            <div className={`mt-16 p-8 bg-gray-100 min-h-screen print:ml-0 print:mt-0 print:p-0 print:bg-white transition-all duration-300 ${isSidebarOpen ? 'ml-[420px]' : 'ml-0'}`}>
                <div className="flex justify-center">
                    {/* Main Printable Document */}
                    <DocumentArea
                        margins={templateConfig.margins}
                        fontFamily={templateConfig.fontFamily}
                        paperSize={templateConfig.paperSize}
                        orientation={templateConfig.orientation}
                        backgroundImage={templateConfig.backgroundImage}
                        backgroundPosition={templateConfig.backgroundPosition}
                        backgroundColor={templateConfig.backgroundColor}
                        backgroundColorEnabled={templateConfig.backgroundColorEnabled}
                    >

                {/* Header (Logo & Quote Title) */}
                <PdfHeader quoteType={quoteType} data={data} themeColor={templateConfig.themeColor} templateConfig={templateConfig} />

                {/* Details (Company, Billing, Dates) */}
                <PdfDetails data={data} themeColor={templateConfig.themeColor} templateConfig={templateConfig} />

                {/* Table (Items & Totals) */}
                <PdfTable
                    items={items}
                    subTotal={subTotal}
                    discount={discount}
                    vatAmount={vatAmount}
                    total={total}
                    currency={currency}
                    themeColor={templateConfig.themeColor}
                    layoutStyle={data.layoutStyle}
                    tableConfig={templateConfig.table}
                    totalConfig={templateConfig.total}
                    templateConfig={templateConfig}
                />

                {/* Terms and Conditions (Placeholder) */}
                <div className=" text-xs text-gray-600">

                  <PdfNotesAndTerms
                      data={data}
                      layoutStyle={data.layoutStyle}
                      templateConfig={templateConfig}
                  />
                </div>

                {/* Fixed Footer for Printing */}
                <PdfFooter
                    currentPage={1}
                    totalPages={1}
                    templateConfig={templateConfig}
                    data={data}
                />
            </DocumentArea>
                </div>
            </div>
        </>
    );
};

export default PdfViewerScreen;
