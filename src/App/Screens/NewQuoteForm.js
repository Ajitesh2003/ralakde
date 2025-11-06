import React, { useState } from 'react';
import { Settings, Search, ChevronDown, X } from 'lucide-react';
import { useQuoteContext } from '../Context.js/NewQuoteContext';
import { useNavigate } from 'react-router-dom';
// Assuming a custom hook handles form state and submission
// import { useQuoteForm } from '../Hooks/useQuoteForm'; 

// --- Dummy Select Component for demonstration ---
const SelectField = ({ label, value, onChange, options, isRequired = false, placeholder = "Select...", className = '' }) => (
    <div className={`relative ${className}`}>
        <label className="text-red-500 text-sm font-medium">
            {label}
            {isRequired && <span className="text-red-500">*</span>}
        </label>
        <div className="flex items-center mt-1 border border-gray-300 rounded-lg focus-within:border-blue-500">
            <input 
                type="text"
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full p-2.5 bg-white text-gray-700 focus:outline-none rounded-l-lg"
            />
            <ChevronDown className="w-5 h-5 text-gray-500 mx-2 cursor-pointer" />
        </div>
    </div>
);

// --- Main Form Component ---
const NewQuoteForm = ({onClose}) => {

    const { updateQuoteData } = useQuoteContext();
    const navigate = useNavigate();

    // Basic state setup (replace with useQuoteForm hook in a real app)
    const [formData, setFormData] = useState({
        customerName: '',
        quoteNumber: 'QT-000001',
        reference: '',
        quoteDate: new Date().toLocaleDateString('en-GB'),
        expiryDate: '',
        salesperson: '',
        projectName: '',
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = (action) => {
        // Map form fields to PDF data keys if necessary, or just pass formData
        const pdfData = {
            reference: formData.reference,
            quoteDate: formData.quoteDate,
            expiryDate: formData.expiryDate,
            salesPerson: formData.salesperson, // Note: form uses 'salesperson', data uses 'salesPerson'
            // CustomerName needs to update billingDetails name if you want it to appear
            // billingDetails: { ...liveQuoteData.billingDetails, name: formData.customerName }
        };
        
        // 1. Update the centralized data
        updateQuoteData(pdfData);

        // 2. Handle actual save/send logic
       navigate('/viewer');
       console.log(`${action} clicked. Data submitted to viewer and navigating...`);
        if (onClose) onClose(); // Close the form after saving
    };

    return (
        <div className="max-w-4xl w-full bg-white shadow-xl rounded-xl p-6 sm:p-10 my-8">
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-4 mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">New Quote</h2>
                <X className="w-6 h-6 text-gray-500 cursor-pointer hover:text-red-500" />
            </div>

            {/* Customer Name Row */}
            <div className="mb-6 flex items-end">
                <div className="flex-grow">
                    <SelectField 
                        label="Customer Name"
                        value={formData.customerName}
                        onChange={(v) => handleChange('customerName', v)}
                        isRequired
                        placeholder="Select or add a customer"
                    />
                </div>
                <button className="ml-3 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition">
                    <Search className="w-5 h-5" />
                </button>
            </div>

            {/* Quote Details Row 1: Quote # and Reference # */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="text-red-500 text-sm font-medium">Quote#<span className="text-red-500">*</span></label>
                    <div className="flex items-center mt-1 border border-gray-300 rounded-lg bg-gray-50">
                        <input 
                            type="text"
                            value={formData.quoteNumber}
                            readOnly
                            className="w-full p-2.5 bg-transparent text-gray-700 focus:outline-none"
                        />
                        <Settings className="w-5 h-5 text-gray-500 mx-3 cursor-pointer hover:text-blue-600" />
                    </div>
                </div>

                <div>
                    <label className="text-gray-700 text-sm font-medium">Reference#</label>
                    <input 
                        type="text"
                        value={formData.reference}
                        onChange={e => handleChange('reference', e.target.value)}
                        className="w-full p-2.5 mt-1 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                        placeholder="Enter reference number"
                    />
                </div>
            </div>

            {/* Quote Details Row 2: Quote Date and Expiry Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="text-red-500 text-sm font-medium">Quote Date<span className="text-red-500">*</span></label>
                    <input 
                        type="text"
                        value={formData.quoteDate}
                        onChange={e => handleChange('quoteDate', e.target.value)}
                        className="w-full p-2.5 mt-1 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                        placeholder="dd/MM/yyyy"
                    />
                </div>

                <div>
                    <label className="text-gray-700 text-sm font-medium">Expiry Date</label>
                    <input 
                        type="text"
                        value={formData.expiryDate}
                        onChange={e => handleChange('expiryDate', e.target.value)}
                        className="w-full p-2.5 mt-1 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                        placeholder="dd/MM/yyyy"
                    />
                </div>
            </div>

            {/* Salesperson and Project Name Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <SelectField 
                    label="Salesperson"
                    value={formData.salesperson}
                    onChange={(v) => handleChange('salesperson', v)}
                    placeholder="Select or Add Salesperson"
                />
                <SelectField 
                    label="Project Name"
                    value={formData.projectName}
                    onChange={(v) => handleChange('projectName', v)}
                    placeholder="Select a project"
                />
            </div>

            {/* Action Buttons and Template Footer */}
            <div className="flex justify-between items-center pt-4 border-t">
                <div className="space-x-4">
                    <button 
                        onClick={() => handleSave('Save as Draft')}
                        className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition"
                    >
                        Save as Draft
                    </button>
                    <button 
                        onClick={() => handleSave('Save and Send')}
                        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-md"
                    >
                        Save and Send
                    </button>
                    <button 
                        onClick={() => console.log('Cancel clicked')}
                        className="px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>
                </div>
                
                <p className="text-xs text-gray-500">
                    PDF Template: '<span className="font-semibold text-blue-600">Spreadsheet Template</span>'
                </p>
            </div>
        </div>
    );
};

export default NewQuoteForm;