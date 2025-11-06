import React, { useState, useEffect, useCallback } from 'react';
import PdfHeader from '../Components/PdfHeader';
import PdfDetails from '../Components/PdfDetails';
import PdfTable from '../Components/PdfTable';
import PdfFooter from '../Components/PdfFooter';
import PdfNotesAndTerms from '../Components/PdfNotesAndTerms';
import { useDocumentData, TEMPLATES } from '../Utils/API';
import { useQuoteContext } from '../Context.js/NewQuoteContext';
import { Loader2, Download, Printer, ChevronDown } from 'lucide-react';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";


// Utility component to create responsive layout for viewer and controls
const LayoutContainer = ({ children }) => (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 flex flex-col items-center">
        {children}
    </div>
);

// Utility component for the main printable document area
const DocumentArea = ({ children }) => (
    <div 
        id="pdf-document"
        className="bg-white shadow-xl rounded-lg w-full max-w-4xl p-6 sm:p-10 mb-8 
                   print:shadow-none print:w-auto print:max-w-none print:p-0 print:m-0 print:h-auto 
                   print:mt-12" // print:mt-12 creates space for the fixed header/footer
    >
        {children}
    </div>
);

const Button = ({ children, onClick, disabled = false, className = '' }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center justify-center px-4 py-2 rounded-lg text-white font-medium transition duration-150 ease-in-out shadow-md
                    ${disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'}
                    ${className}`}
    >
        {children}
    </button>
);

// New Dropdown Menu Component
const DropdownMenu = ({ children, buttonText, icon: Icon }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOutsideClick = useCallback((event) => {
        if (!event.target.closest('.dropdown-container')) {
            setIsOpen(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isOpen, handleOutsideClick]);

    return (
        <div className="relative inline-block text-left dropdown-container">
            <Button onClick={() => setIsOpen(!isOpen)} className="sm:w-auto min-w-[150px]">
                {Icon && <Icon className="w-5 h-5 mr-2" />}
                {buttonText}
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
            </Button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <div className="py-1">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};

// Main Screen Component
const PdfViewerScreen = () => {
    // const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES.STANDARD);
    // const { data, loading, setTemplate } = useDocumentData(selectedTemplate);

    const { data, loading, selectedTemplate, setSelectedTemplate } = useQuoteContext(); // <-- NEW
    const [isPrinting, setIsPrinting] = useState(false);

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

    const handleDownloadPdf = async () => {
  try {
    const element = document.getElementById("pdf-document");
    if (!element) return alert("PDF document area not found!");

    // Hide dropdown temporarily to avoid capturing it in PDF
    const dropdowns = document.querySelectorAll(".dropdown-container");
    dropdowns.forEach(d => (d.style.visibility = "hidden"));

    // Use html2canvas to capture the document
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff"
    });

    dropdowns.forEach(d => (d.style.visibility = "visible"));

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    // Calculate image size to fit A4
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Handle multi-page content
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("document.pdf");
  } catch (err) {
    console.error("PDF generation failed", err);
    alert("Failed to generate PDF. Check console for details.");
  }
};


    const handlePrintButton = () => {
        
        console.log('Attempting to download PDF (Requires external library for client-side generation).');
        handlePrint(); // Trigger print for a simple 'Save as PDF' prompt
    };
    
    // Dropdown Item helper component
    const DropdownItem = ({ icon: Icon, onClick, children }) => (
        <button
            onClick={onClick}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
            {Icon && <Icon className="w-4 h-4 mr-3" />}
            {children}
        </button>
    );

    if (loading || !data) {
        return (
            <LayoutContainer>
                <div className="flex items-center text-gray-600 text-lg mt-20">
                    <Loader2 className="animate-spin w-6 h-6 mr-3" />
                    Loading document data...
                </div>
            </LayoutContainer>
        );
    }

    const { quoteType, themeColor, items, subTotal, discount, vatAmount, total, currency } = data;

    return (
        <LayoutContainer>
            
            {/* Control Panel */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6 w-full max-w-4xl justify-between items-center print:hidden">
                
                {/* Template Dropdown */}
                <div className="flex items-center space-x-3 w-full sm:w-auto">
                    <label htmlFor="template-select" className="text-gray-700 font-medium whitespace-nowrap">Select Template:</label>
                    <select
                        id="template-select"
                        value={selectedTemplate}
                        onChange={(e) => setSelectedTemplate(e.target.value)}
                        className="py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-auto"
                    >
                        {Object.values(TEMPLATES).map(templateName => (
                            <option key={templateName} value={templateName}>{templateName}</option>
                        ))}
                    </select>
                </div>

                {/* Download/Print Dropdown Button */}
                <DropdownMenu buttonText="PDF/Print" icon={Download}>
                    <DropdownItem icon={Download} onClick={handleDownloadPdf}>
                        Download PDF
                    </DropdownItem>
                    <DropdownItem icon={Printer} onClick={handlePrintButton}>
                        Print
                    </DropdownItem>
                </DropdownMenu>
            </div>

            {/* Main Printable Document */}
            <DocumentArea>
                
                {/* Header (Logo & Quote Title) */}
                <PdfHeader quoteType={quoteType} data={data} themeColor={themeColor} />

                {/* Details (Company, Billing, Dates) */}
                <PdfDetails data={data} themeColor={themeColor} />

                {/* Table (Items & Totals) */}
                <PdfTable 
                    items={items} 
                    subTotal={subTotal} 
                    discount={discount}
                    vatAmount={vatAmount}
                    total={total} 
                    currency={currency} 
                    themeColor={themeColor}
                    layoutStyle={data.layoutStyle} 
                />

                {/* Terms and Conditions (Placeholder) */}
                <div className="-mt-5 text-xs text-gray-600">
            
                  <PdfNotesAndTerms data={data} layoutStyle={data.layoutStyle}/>  
                </div>
            </DocumentArea>
            
            {/* Fixed Footer for Printing */}
            <PdfFooter themeColor={themeColor} isPrinting={isPrinting} layoutStyle={data.layoutStyle} 
/>
        </LayoutContainer>
    );
};

export default PdfViewerScreen;
