import React, { useEffect, useState } from 'react';

// Configuration for local use
// You MUST replace this with your actual local path (e.g., '/logo.webp')
export const LOGO_URL = 'uploaded:logo.webp-ec625fa7-9041-4b63-a345-077b508f2c2b';

// --- TEMPLATE CONFIGURATION ---
export const TEMPLATES = {
  STANDARD: 'Standard Template',
  EU_QUOTE: 'EU Template',
  SPREADSHEET: 'Spreadsheet Template',
  ELITE: 'Elite Template'
};

// --- MOCK DATA FOR TEMPLATES ---

const commonDetails = {
  quoteDate: '23/10/2025',
  expiryDate: '23/10/2025',
  salesPerson: 'Richard James',
  reference: 'SO-17',
  vatNo: '999 9999 73',
  subTotal: 630.00,
  discount: 0.00,
  vatAmount: 32.75, // Combined VAT amount for simplicity in mock
  total: 662.75,
  currency: '£',

   notes: "Thanks in advance for your business.",
  notes2: "Valid for 30 days from the date of the quote unless otherwise stated.",

  terms: `The buyer is responsible for taxes, freight, and customs duties when applicable. 
All deliveries (Std. Lead) are based on standard ground shipments. Rush delivery may be 
available upon request. Errors and Omissions are Excluded. Please contact your sales 
representative with any questions.
Ralakde Ltd's terms and conditions apply. Visit our website at`,
  
  termsLink: "https://findcontrols.com/pages/terms-conditions",
};

// Layout A: Standard & EU (Quote Details are in a side box/separate block)
const standardEUDetails = {
  companyName: 'Ralake Limited',
  addressLine1: 'Unit 5A Victoria Road',
  addressLine2: 'Stoke On Trent Staffordshire ST4 2HS',
  country: 'United Kingdom',
  phone: '+44 1782 563377',
  email: 'sales@ralakde.com',
  website: 'www.ralakde.com',
  vat: 'GB 246 0938 95',
};

// Layout B: Spreadsheet Plus (Quote Details are next to the Bill To)
const spreadsheetDetails = {
  companyName: 'RALAKDE',
  addressLine1: 'Unit 5A Victoria Road',
  addressLine2: 'Stoke On Trent Staffordshire ST4 2HS',
  country: 'United Kingdom',
  phone: '+44 1782 563377',
  email: 'sales@ralakde.co.uk',
  website: 'www.findcontrols.com',
  vat: 'GB 246 0938 95',
};

const billingData = {
  name: 'Rob & Joe Traders',
  addressLine1: '24, Riche Street',
  addressLine2: 'Chennai',
  zip: '631603 Tamil Nadu',
  country: 'India',
};

const shippingData = {
  name: 'Rob & Joe Traders',
  addressLine1: '34, Riche Street',
  addressLine2: 'Chennai',
  zip: '631603 Tamil Nadu',
  country: 'India',
};

const standardItems = [
  { id: 1, description: 'Brochure Design', detail: 'Brochure Design Single Sided Color', qty: 1.00, rate: 300.00, discount: 0.00, vatPercent: '7.00%', vat: 21.00, amount: 300.00, total: 321.00, unit: 'Nos' },
  { id: 2, description: 'Web Design Packages (Template) - Basic', detail: 'Custom Themes for your business. Inclusive of 10 hours of marketing and annual training', qty: 1.00, rate: 250.00, discount: 0.00, vatPercent: '4.70%', vat: 11.75, amount: 250.00, total: 261.75, unit: 'Nos' },
  { id: 3, description: 'Print Ad - Basic - Color', detail: 'Print Ad 1/8 size Color', qty: 1.00, rate: 80.00, discount: 0.00, vatPercent: '', vat: 0.00, amount: 80.00, total: 80.00, unit: 'Nos' },
];

const mockData = {
  [TEMPLATES.STANDARD]: {
    ...commonDetails,
    layoutStyle: 'STANDARD', // Layout A
    quoteType: 'Quote',
    companyDetails: { ...standardEUDetails, name: 'RALAKDE LIMITED' },
    billingDetails: billingData,
    shippingDetails: shippingData,
    items: standardItems,
    themeColor: 'blue-800',
  },
  [TEMPLATES.EU_QUOTE]: {
    ...commonDetails,
    layoutStyle: 'STANDARD', // Layout A, with EU specific details
    quoteType: 'Quote',
    companyDetails: {
      ...standardEUDetails,
      name: 'RALAKDE LIMITED',
      addressLine1: 'Ralakde Automation s.r.o.',
      addressLine2: 'Stará Voda 38, 353 01 Stará Voda',
      country: 'Company ID 22172033', // Re-purposing fields for specific EU data
      vat: 'CZ22172033', // VAT
      eori: 'CZ22172033', // EORI is new field
      phone: '+44 1782 563377, +420 702 112 125', // Dual numbers
    },
    billingDetails: billingData,
    shippingDetails: shippingData,
    items: standardItems.map(item => ({...item, vatPercent: '0.00%', vat: 0.00, total: item.amount})), // Simulating B2B VAT exclusion
    themeColor: 'green-700',
    currency: '€',
  },
  [TEMPLATES.SPREADSHEET]: {
    ...commonDetails,
    layoutStyle: 'SPREADSHEET', // Layout B
    quoteType: 'QUOTE',
    quoteNumber: 'QT-17', // Different formatting
    companyDetails: spreadsheetDetails,
    billingDetails: billingData,
    shippingDetails: shippingData,
    items: standardItems.map(item => ({...item, taxableAmount: item.rate * item.qty, total: item.amount + item.vat})), // Rename amount to taxableAmount, total is final
    themeColor: 'purple-800',
    currency: '£',
  },
  // --- NEW: ELITE TEMPLATE DEFINITION ---
  [TEMPLATES.ELITE]: {
    ...commonDetails,
    layoutStyle: 'ELITE', // Using the existing STANDARD layout structure
    quoteType: 'Invoice', // Assuming it's an Invoice or Payment (based on ELITE.pdf content)
    companyDetails: { 
      ...standardEUDetails, 
      name: 'RALAKDE ELITE SOLUTIONS',
    },
    billingDetails: billingData,
    shippingDetails: shippingData,
    items: standardItems,
//     themeColor: 'red-700', // New theme color
    currency: '£',
  },
};

let liveFormData = {
    reference: 234445,
    quoteDate: "30/05/2025",
    expiryDate: '30/06/2025',
    salesPerson: 'Jmaes Dugga',
    // Add other changeable root fields here...
};

// let liveQuoteData = mockData[TEMPLATES.SPREADSHEET];

export const updateLiveQuoteData = (formData) => {
    // Only update fields that are present in the form submission
    liveFormData = { ...liveFormData, ...formData };
    console.log("Live Form Data Saved:", liveFormData);
};

/**
 * Custom hook to manage data fetching based on the selected template.
 */
export const fetchDocumentData = async (templateName) => {
    await new Promise(resolve => setTimeout(resolve, 50));
    const baseTemplateData = mockData[templateName] || mockData[TEMPLATES.STANDARD];
    const mergedData = {
        ...baseTemplateData,
        ...liveFormData, // Overwrites fields like reference, quoteDate, salesPerson
        // Add logic here if you need to merge nested objects (e.g., billingDetails)
    };
    return mergedData;
};

export const useDocumentData = (initialTemplate) => {
  const [template, setTemplate] = useState(initialTemplate);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const documentData = await fetchDocumentData(template);
        setData(documentData);
      } catch (error) {
        console.error("Error fetching document data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [template]);

  return { data, loading, template, setTemplate };
};
