import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';
import { replacePlaceholders } from '../Utils/placeholderUtils';
import { useQuoteContext } from '../Context.js/NewQuoteContext';

const AttentionContentModal = ({ isOpen, onClose, initialContent, onSave }) => {
    const [content, setContent] = useState(initialContent || '');
    const { data } = useQuoteContext();
    const companyDetails = data?.companyDetails || {};

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(content);
        onClose();
    };

    const handleCancel = () => {
        setContent(initialContent || '');
        onClose();
    };

    const handleClearContent = () => {
        setContent('');
    };

    // Insert placeholder at cursor position
    const handleInsertPlaceholder = (placeholder) => {
        const textarea = document.getElementById('attention-content-textarea');
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newContent = content.substring(0, start) + placeholder + content.substring(end);
        setContent(newContent);

        // Set cursor position after the inserted placeholder
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + placeholder.length, start + placeholder.length);
        }, 0);
    };

    // Available placeholders
    const placeholders = [
        { label: 'Organization Name', value: '${OrganizationName}' },
        { label: 'Organization Address', value: '${OrganizationAddress}' },
        { label: 'Organization Phone', value: '${OrganizationPhone}' },
        { label: 'Organization Email', value: '${OrganizationEmail}' },
        { label: 'Organization Website', value: '${OrganizationWebsite}' },
        { label: 'Customer Name', value: '${CustomerName}' },
        { label: 'Quote Number', value: '${QuoteNumber}' },
        { label: 'Quote Date', value: '${QuoteDate}' },
        { label: 'Expiry Date', value: '${ExpiryDate}' },
        { label: 'Reference', value: '${Reference}' },
        { label: 'Sales Person', value: '${SalesPerson}' },
    ];

    // Preview with placeholders replaced
    const previewContent = replacePlaceholders(content, data, companyDetails);

    const modalContent = (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Add Attention Content</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {/* Insert Placeholders Dropdown */}
                    <div className="flex justify-end mb-3">
                        <select
                            onChange={(e) => {
                                if (e.target.value) {
                                    handleInsertPlaceholder(e.target.value);
                                    e.target.value = '';
                                }
                            }}
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Insert Placeholders</option>
                            {placeholders.map((ph, index) => (
                                <option key={index} value={ph.value}>
                                    {ph.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Text Editor */}
                    <textarea
                        id="attention-content-textarea"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full h-64 px-4 py-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono"
                        placeholder="Enter attention content here..."
                    />

                    {/* Note */}
                    <p className="text-xs text-gray-500 mt-3">
                        Note: Attention content will be displayed above the "Item Table".
                    </p>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                    <div className="flex gap-3">
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                            Preview
                        </button>
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                    <button
                        onClick={handleClearContent}
                        className="text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium"
                    >
                        Clear Content
                    </button>
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.body);
};

export default AttentionContentModal;
