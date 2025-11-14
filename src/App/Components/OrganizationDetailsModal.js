import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';

const OrganizationDetailsModal = ({ isOpen, onClose, initialData, onSave }) => {
    const [formData, setFormData] = useState({
        orgName: initialData?.orgName || '',
        orgAddressLine1: initialData?.orgAddressLine1 || '',
        orgAddressLine2: initialData?.orgAddressLine2 || '',
        orgCountry: initialData?.orgCountry || '',
        orgVAT: initialData?.orgVAT || '',
        orgPhone: initialData?.orgPhone || '',
        orgEmail: initialData?.orgEmail || '',
        orgWebsite: initialData?.orgWebsite || '',
    });

    if (!isOpen) return null;

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = () => {
        onSave(formData);
        onClose();
    };

    const handleCancel = () => {
        setFormData({
            orgName: initialData?.orgName || '',
            orgAddressLine1: initialData?.orgAddressLine1 || '',
            orgAddressLine2: initialData?.orgAddressLine2 || '',
            orgCountry: initialData?.orgCountry || '',
            orgVAT: initialData?.orgVAT || '',
            orgPhone: initialData?.orgPhone || '',
            orgEmail: initialData?.orgEmail || '',
            orgWebsite: initialData?.orgWebsite || '',
        });
        onClose();
    };

    const handleClearAll = () => {
        setFormData({
            orgName: '',
            orgAddressLine1: '',
            orgAddressLine2: '',
            orgCountry: '',
            orgVAT: '',
            orgPhone: '',
            orgEmail: '',
            orgWebsite: '',
        });
    };

    const modalContent = (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Edit Organization Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    <div className="space-y-4">
                        {/* Organization Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Organization Name
                            </label>
                            <input
                                type="text"
                                value={formData.orgName}
                                onChange={(e) => handleChange('orgName', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Leave empty to use default"
                            />
                        </div>

                        {/* Address Line 1 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Address Line 1
                            </label>
                            <input
                                type="text"
                                value={formData.orgAddressLine1}
                                onChange={(e) => handleChange('orgAddressLine1', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Leave empty to use default"
                            />
                        </div>

                        {/* Address Line 2 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Address Line 2
                            </label>
                            <input
                                type="text"
                                value={formData.orgAddressLine2}
                                onChange={(e) => handleChange('orgAddressLine2', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Leave empty to use default"
                            />
                        </div>

                        {/* Country */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Country
                            </label>
                            <input
                                type="text"
                                value={formData.orgCountry}
                                onChange={(e) => handleChange('orgCountry', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Leave empty to use default"
                            />
                        </div>

                        {/* VAT Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                VAT Number
                            </label>
                            <input
                                type="text"
                                value={formData.orgVAT}
                                onChange={(e) => handleChange('orgVAT', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Leave empty to use default"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone
                            </label>
                            <input
                                type="text"
                                value={formData.orgPhone}
                                onChange={(e) => handleChange('orgPhone', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Leave empty to use default"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={formData.orgEmail}
                                onChange={(e) => handleChange('orgEmail', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Leave empty to use default"
                            />
                        </div>

                        {/* Website */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Website
                            </label>
                            <input
                                type="text"
                                value={formData.orgWebsite}
                                onChange={(e) => handleChange('orgWebsite', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Leave empty to use default"
                            />
                        </div>
                    </div>

                    {/* Note */}
                    <p className="text-xs text-gray-500 mt-4">
                        Note: Leave fields empty to use default company details. Custom values will override the defaults in your PDF templates.
                    </p>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                    <div className="flex gap-3">
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                            Save
                        </button>
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                    <button
                        onClick={handleClearAll}
                        className="text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium"
                    >
                        Clear All
                    </button>
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.body);
};

export default OrganizationDetailsModal;
