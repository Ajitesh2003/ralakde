/**
 * Utility functions for placeholder replacement in custom content
 */

/**
 * Replaces placeholders in HTML content with actual values from quote data
 * @param {string} htmlContent - The HTML content with placeholders
 * @param {object} quoteData - The quote data object containing actual values
 * @param {object} companyData - The company/organization data
 * @returns {string} HTML content with replaced placeholders
 */
export const replacePlaceholders = (htmlContent, quoteData = {}, companyData = {}) => {
    if (!htmlContent) return '';

    let replacedContent = htmlContent;

    // Helper function to safely get nested values
    const getValue = (obj, path, defaultValue = '') => {
        const value = path.split('.').reduce((acc, part) => acc?.[part], obj);
        return value !== undefined && value !== null ? value : defaultValue;
    };

    // Format date helper
    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
        } catch (e) {
            return dateString;
        }
    };

    // Basic placeholders
    const placeholderMap = {
        // Company/Organization placeholders
        '{companyName}': getValue(companyData, 'name', getValue(quoteData, 'organisationDetails.name', '')),
        '{companyAddress}': getValue(companyData, 'address', getValue(quoteData, 'organisationDetails.addressLine1', '')),
        '{companyEmail}': getValue(companyData, 'email', getValue(quoteData, 'organisationDetails.email', '')),
        '{companyPhone}': getValue(companyData, 'phone', getValue(quoteData, 'organisationDetails.phone', '')),

        // Current date
        '{currentDate}': formatDate(new Date()),

        // Quote number and title
        '{quoteNumber}': getValue(quoteData, 'documentNumber', getValue(quoteData, 'quoteNumber', '')),
        '{quoteTitle}': getValue(quoteData, 'documentTitle', 'Quote'),

        // Customer details
        '{customerName}': getValue(quoteData, 'billTo.name', getValue(quoteData, 'customerName', '')),
        '{customerAddress}': getValue(quoteData, 'billTo.addressLine1', getValue(quoteData, 'customerAddress', '')),
        '{customerEmail}': getValue(quoteData, 'billTo.email', getValue(quoteData, 'customerEmail', '')),
        '{customerPhone}': getValue(quoteData, 'billTo.phone', getValue(quoteData, 'customerPhone', '')),

        // Quote details
        '{quoteDate}': formatDate(getValue(quoteData, 'quoteDate', getValue(quoteData, 'date', ''))),
        '{expiryDate}': formatDate(getValue(quoteData, 'expiryDate', getValue(quoteData, 'validUntil', ''))),
        '{referenceNumber}': getValue(quoteData, 'referenceNumber', getValue(quoteData, 'reference', '')),
        '{salesPerson}': getValue(quoteData, 'salesPerson', getValue(quoteData, 'salesperson', '')),
        '{vatNumber}': getValue(quoteData, 'vatNumber', getValue(quoteData, 'taxNumber', '')),

        // Custom fields
        '{customField1}': getValue(quoteData, 'customField1', ''),
        '{customField2}': getValue(quoteData, 'customField2', ''),
        '{customField3}': getValue(quoteData, 'customField3', '')
    };

    // Replace all placeholders
    Object.entries(placeholderMap).forEach(([placeholder, value]) => {
        const regex = new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g');
        replacedContent = replacedContent.replace(regex, value);
    });

    return replacedContent;
};

/**
 * Gets a preview-friendly version of the content with sample data
 * @param {string} htmlContent - The HTML content with placeholders
 * @returns {string} HTML content with sample placeholder values
 */
export const getPreviewContent = (htmlContent) => {
    if (!htmlContent) return '';

    const sampleData = {
        '{companyName}': 'Ralakde Ltd',
        '{companyAddress}': '123 Business Street, London',
        '{companyEmail}': 'sales@ralakde.com',
        '{companyPhone}': '+44 1782 363777',
        '{currentDate}': new Date().toLocaleDateString('en-GB'),
        '{quoteNumber}': 'QT-17',
        '{quoteTitle}': 'Quote',
        '{customerName}': 'Rob & Joe Traders',
        '{customerAddress}': '83 Upper St, London',
        '{customerEmail}': 'contact@robnjoe.com',
        '{customerPhone}': '+44 20 1234 5678',
        '{quoteDate}': '11/11/2025',
        '{expiryDate}': '11/11/2025',
        '{referenceNumber}': 'SO-17',
        '{salesPerson}': 'Richard James',
        '{vatNumber}': 'GB246093895',
        '{customField1}': 'Custom Value 1',
        '{customField2}': 'Custom Value 2',
        '{customField3}': 'Custom Value 3'
    };

    let previewContent = htmlContent;
    Object.entries(sampleData).forEach(([placeholder, value]) => {
        const regex = new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g');
        previewContent = previewContent.replace(regex, value);
    });

    return previewContent;
};

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param {string} htmlContent - The HTML content to sanitize
 * @returns {string} Sanitized HTML content
 */
export const sanitizeHtml = (htmlContent) => {
    if (!htmlContent) return '';

    // Basic sanitization - remove script tags and event handlers
    let sanitized = htmlContent;

    // Remove script tags
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Remove event handlers (onclick, onerror, etc.)
    sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
    sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');

    // Remove javascript: protocol
    sanitized = sanitized.replace(/javascript:/gi, '');

    return sanitized;
};
