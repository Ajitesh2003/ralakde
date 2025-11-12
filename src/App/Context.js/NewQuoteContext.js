// QuoteContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchDocumentData, TEMPLATES, updateLiveQuoteData } from './../Utils/API';

const QuoteContext = createContext(null);

export const useQuoteContext = () => useContext(QuoteContext);

export const QuoteProvider = ({ children }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES.SPREADSHEET);

    // Template configuration state
    const [templateConfig, setTemplateConfig] = useState(() => {
        // Default configuration
        const CONFIG_VERSION = '1.1'; // Increment this when adding new fields
        const defaultConfig = {
            configVersion: CONFIG_VERSION,
            templateName: 'Standard Template',
            paperSize: 'A4',
            orientation: 'portrait',
            margins: {
                top: 0.7,
                bottom: 0.7,
                left: 0.55,
                right: 0.4
            },
            fontFamily: 'Arial',
            themeColor: 'blue-800',
            header: {
                backgroundImage: null,
                backgroundColor: '#ffffff',
                imagePosition: 'center',
                logoPosition: 'left',
                logoSize: 'medium',
                quoteTitleText: 'Quote',
                quoteTitlePosition: 'right',
                applyToFirstPageOnly: false,
                enableCustomContent: false,
                customContent: '',
                customContentPosition: 'below' // 'above' | 'below' | 'replace'
            },
            footer: {
                fontSize: 10,
                textColor: '#aaaaaa',
                backgroundImage: null,
                imagePosition: 'center',
                backgroundColorEnabled: false,
                backgroundColor: '#ffffff',
                showPageNumbers: true,
                pageNumberPosition: 'right',
                pageNumberFormat: '${CurrentPageNumber}',
                enableCustomContent: false,
                customContent: '',
                customContentPosition: 'above' // 'above' | 'below' | 'replace'
            },
            transactionDetails: {
                // Organisation Details
                showOrgLogo: true,
                orgLogo: null,
                orgLogoSize: 'medium',
                showOrgName: true,
                orgNameColor: '#333333',
                orgNameFontSize: 10,
                showOrgAddress: true,

                // Customer Details
                customerNameColor: '#333333',
                customerNameFontSize: 9,
                showBillTo: true,
                billToLabel: 'Bill To',
                showShipTo: false,
                shipToLabel: 'Ship To',

                // Document Details
                showDocumentTitle: true,
                documentTitleText: 'Quote',
                documentTitleFontSize: 28,
                documentTitleColor: '#034287',
                phone: '',
                fax: '',
                showAttentionContent: false,
                attentionContent: '',

                // Document Information field visibility
                showNumberField: true,
                numberFieldLabel: 'Quote#',
                showDateField: true,
                dateFieldLabel: 'Quote Date',
                showExpiryDate: true,
                expiryDateLabel: 'Expiry Date',
                showVATNumber: true,
                vatNumberLabel: 'VAT No.',
                showReferenceField: true,
                referenceFieldLabel: 'Reference#',
                showSalesperson: true,
                salespersonLabel: 'Sales person',
                showProject: false,
                projectLabel: 'Project Name',
                showSubject: true,
                subjectLabel: 'Subject'
            },
            table: {
                // Labels Tab - Column Configuration
                columns: [
                    { id: 'lineItemNumber', field: 'index', label: '#', visible: true, width: 5 },
                    { id: 'item', field: 'description', label: 'Item', visible: true, width: 20 },
                    { id: 'description', field: 'detail', label: 'Description', visible: true, width: 20 },
                    { id: 'customFields', field: 'custom', label: '%Custom Field Label', visible: false, width: 15 },
                    { id: 'quantity', field: 'qty', label: 'Qty', visible: true, width: 11, showUnit: false },
                    { id: 'rate', field: 'rate', label: 'Rate', visible: true, width: 11 },
                    { id: 'taxableAmount', field: 'taxableAmount', label: 'Taxable Amount', visible: true, width: 12 },
                    { id: 'vatRate', field: 'vatPercent', label: 'VAT %', visible: true, width: 11 },
                    { id: 'vatAmount', field: 'vat', label: 'VAT', visible: true, width: 11 },
                    { id: 'discount', field: 'discount', label: 'Discount', visible: true, width: 11 },
                    { id: 'amount', field: 'amount', label: 'Amount', visible: true, width: 15, addTaxToAmount: false }
                ],

                // Layout Tab - Styling Configuration
                borderColor: '#adadad',

                // Table Header
                headerFontSize: 9,
                headerBackgroundColor: '#064384',
                headerFontColor: '#ffffff',

                // Item Row
                rowFontSize: 9,
                rowBackgroundColor: '#ffffff',
                rowFontColor: '#000000',

                // Item Description
                descriptionFontSize: 8,
                descriptionFontColor: '#333333'
            },
            total: {
                // Labels Configuration
                showTotalSection: true,
                subTotal: { visible: true, label: 'Sub Total' },
                discount: { visible: true, label: 'Discount' },
                taxDetails: { visible: true, label: 'VAT' },
                total: { visible: true, label: 'Total' },
                currencyPosition: 'before', // 'before' or 'after'
                showQuantity: false,
                showAmountInWords: false,

                // Layout Configuration
                totalSectionFontSize: 10,
                totalSectionFontColor: '#000000',
                totalSectionBgEnabled: false,
                totalSectionBgColor: '#ffffff',

                balanceDueFontSize: 12,
                balanceDueFontColor: '#000000',
                balanceDueBgEnabled: false,
                balanceDueBgColor: '#f7f8f5'
            },
            otherDetails: {
                // Notes
                showNotes: true,
                notesLabel: 'Notes',
                notesFontSize: 8,

                // Terms & Conditions
                showTerms: true,
                termsLabel: 'Terms & Conditions',
                termsFontSize: 8,

                // Signature
                showSignature: false,
                signatureLabel: 'Authorized Signature',

                // Annexure
                showAnnexure: false
            }
        };

        // Try to load from localStorage and merge with defaults
        const saved = localStorage.getItem('templateConfig');
        if (saved) {
            const savedConfig = JSON.parse(saved);
            // Check version - if mismatch, use default config
            if (savedConfig.configVersion !== CONFIG_VERSION) {
                console.log('Config version mismatch, using default config');
                localStorage.removeItem('templateConfig');
                return defaultConfig;
            }
            // Merge saved config with default config to ensure new properties exist
            return {
                ...defaultConfig,
                ...savedConfig,
                header: {
                    ...defaultConfig.header,
                    ...(savedConfig.header || {})
                },
                footer: {
                    ...defaultConfig.footer,
                    ...(savedConfig.footer || {})
                },
                transactionDetails: {
                    ...defaultConfig.transactionDetails,
                    ...(savedConfig.transactionDetails || {})
                },
                table: {
                    ...defaultConfig.table,
                    ...(savedConfig.table || {})
                },
                total: {
                    ...defaultConfig.total,
                    ...(savedConfig.total || {})
                },
                otherDetails: {
                    ...defaultConfig.otherDetails,
                    ...(savedConfig.otherDetails || {})
                }
            };
        }
        return defaultConfig;
    });

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            try {
                // Fetch initial data based on the starting template
                const initialData = await fetchDocumentData(selectedTemplate);
                setData(initialData);
            } catch (error) {
                console.error("Error loading initial quote data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, [selectedTemplate]);

    // Function called by the form to update and display the new data
   const updateQuoteData = async (formData) => {
       setLoading(true);
      try {
            updateLiveQuoteData(formData); // Save the form data
           const newData = await fetchDocumentData(selectedTemplate);
    //    Fetch the merged data
             setData(newData); // This triggers re-render in

         } catch (error) {
             console.error("Error updating quote data:", error);
        } finally {
             setLoading(false);
        }
      };

    // Update template configuration
    const updateTemplateConfig = (newConfig) => {
        setTemplateConfig(newConfig);
        localStorage.setItem('templateConfig', JSON.stringify(newConfig));
    };

    // Save template to localStorage
    const saveTemplate = () => {
        localStorage.setItem('templateConfig', JSON.stringify(templateConfig));
        alert('Template configuration saved successfully!');
    };

    // Refresh preview (re-fetch data)
    const refreshPreview = async () => {
        setLoading(true);
        try {
            const newData = await fetchDocumentData(selectedTemplate);
            setData(newData);
        } catch (error) {
            console.error("Error refreshing preview:", error);
        } finally {
            setLoading(false);
        }
    }; 

    const value = {
        data,
        loading,
        selectedTemplate,
        setSelectedTemplate,
        updateQuoteData,
        templateConfig,
        updateTemplateConfig,
        saveTemplate,
        refreshPreview
    };

    return (
        <QuoteContext.Provider value={value}>
            {children}
        </QuoteContext.Provider>
    );
};