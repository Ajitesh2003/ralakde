import React, { useState, useRef } from 'react';
import { FileText, FileType, Grid, Table, DollarSign, FileCheck, ChevronDown, ChevronRight, Info, Upload, Settings, Plus } from 'lucide-react';
import HeaderContentModal from './HeaderContentModal';
import FooterContentModal from './FooterContentModal';
import AttentionContentModal from './AttentionContentModal';
import ItemDescriptionModal from './ItemDescriptionModal';

const TemplateEditorSidebar = ({
    templateConfig,
    onConfigChange,
    isOpen = true
}) => {
    const [activeTab, setActiveTab] = useState('general');
    const [tableSubTab, setTableSubTab] = useState('labels');
    const [totalSubTab, setTotalSubTab] = useState('labels');
    const [isHeaderModalOpen, setIsHeaderModalOpen] = useState(false);
    const [isFooterModalOpen, setIsFooterModalOpen] = useState(false);
    const [isAttentionModalOpen, setIsAttentionModalOpen] = useState(false);
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        templateProperties: true,
        font: false,
        background: false,
        headerSection: true,
        headerCustomize: false,
        footerSection: false,
        organisationDetails: true,
        customerDetails: false,
        documentDetails: true,
        tableLabels: true,
        tableLayout: false,
        totalSection: true,
        taxesSection: false,
        documentSummary: true,
        annexure: false
    });
    const fileInputRef = useRef(null);
    const backgroundImageInputRef = useRef(null);
    const tabs = [
        { id: 'general', icon: FileText, label: 'General' },
        { id: 'header', icon: FileType, label: 'Header &\nFooter' },
        { id: 'transaction', icon: Grid, label: 'Transaction\nDetails' },
        { id: 'table', icon: Table, label: 'Table' },
        { id: 'total', icon: DollarSign, label: 'Total' },
        { id: 'other', icon: FileCheck, label: 'Other Details' }
    ];

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleChange = (field, value) => {
        onConfigChange({ ...templateConfig, [field]: value });
    };

    const handleMarginChange = (side, value) => {
        onConfigChange({
            ...templateConfig,
            margins: { ...templateConfig.margins, [side]: parseFloat(value) || 0 }
        });
    };

    const handleHeaderChange = (field, value) => {
        onConfigChange({
            ...templateConfig,
            header: { ...templateConfig.header, [field]: value }
        });
    };

    const handleFooterChange = (field, value) => {
        onConfigChange({
            ...templateConfig,
            footer: { ...templateConfig.footer, [field]: value }
        });
    };

    const handleTransactionDetailsChange = (field, value) => {
        console.log('handleTransactionDetailsChange:', field, value);
        const newConfig = {
            ...templateConfig,
            transactionDetails: { ...templateConfig.transactionDetails, [field]: value }
        };
        console.log('New config transactionDetails:', newConfig.transactionDetails);
        onConfigChange(newConfig);
    };

    const handleTableChange = (field, value) => {
        onConfigChange({
            ...templateConfig,
            table: { ...templateConfig.table, [field]: value }
        });
    };

    const handleColumnChange = (columnId, field, value) => {
        const updatedColumns = templateConfig.table.columns.map(col =>
            col.id === columnId ? { ...col, [field]: value } : col
        );
        handleTableChange('columns', updatedColumns);
    };

    const handleTotalChange = (field, value) => {
        onConfigChange({
            ...templateConfig,
            total: { ...templateConfig.total, [field]: value }
        });
    };

    const handleTotalLabelChange = (fieldName, property, value) => {
        onConfigChange({
            ...templateConfig,
            total: {
                ...templateConfig.total,
                [fieldName]: {
                    ...templateConfig.total[fieldName],
                    [property]: value
                }
            }
        });
    };

    const handleOtherDetailsChange = (field, value) => {
        onConfigChange({
            ...templateConfig,
            otherDetails: { ...templateConfig.otherDetails, [field]: value }
        });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (1MB max)
            if (file.size > 1024 * 1024) {
                alert('File size must be less than 1MB');
                return;
            }

            // Validate file type
            const validTypes = ['image/gif', 'image/png', 'image/jpeg', 'image/jpg', 'image/bmp'];
            if (!validTypes.includes(file.type)) {
                alert('Supported formats: GIF, PNG, JPEG, JPG, BMP');
                return;
            }

            // Convert to base64
            const reader = new FileReader();
            reader.onloadend = () => {
                handleHeaderChange('backgroundImage', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBackgroundImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (1MB max)
            if (file.size > 1024 * 1024) {
                alert('File size must be less than 1MB');
                return;
            }

            // Validate file type
            const validTypes = ['image/gif', 'image/png', 'image/jpeg', 'image/jpg', 'image/bmp'];
            if (!validTypes.includes(file.type)) {
                alert('Supported formats: GIF, PNG, JPEG, JPG, BMP');
                return;
            }

            // Convert to base64
            const reader = new FileReader();
            reader.onloadend = () => {
                handleChange('backgroundImage', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className={`fixed left-0 top-16 bottom-0 w-[420px] bg-gray-50 border-r border-gray-200 flex print:hidden transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            {/* Icon Tabs */}
            <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-2">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-12 h-12 flex flex-col items-center justify-center rounded-lg transition text-xs
                                ${isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            title={tab.label}
                        >
                            <Icon className="w-5 h-5" />
                        </button>
                    );
                })}
            </div>

            {/* Content Panel */}
            <div className="flex-1 overflow-y-auto">
                {activeTab === 'general' && (
                    <div className="p-4 space-y-4">
                        {/* Template Properties Section */}
                        <div className="bg-white rounded-lg border border-gray-200">
                            <button
                                onClick={() => toggleSection('templateProperties')}
                                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
                            >
                                <span className="font-semibold text-gray-800">Template Properties</span>
                                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${expandedSections.templateProperties ? 'rotate-180' : ''}`} />
                            </button>

                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSections.templateProperties ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="px-4 pb-4 space-y-4">
                                    {/* Template Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-red-600 mb-1">
                                            Template Name*
                                        </label>
                                        <input
                                            type="text"
                                            value={templateConfig.templateName || 'Standard Template'}
                                            onChange={(e) => handleChange('templateName', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    {/* Paper Size */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Paper Size <Info className="inline w-3 h-3 text-gray-400" />
                                        </label>
                                        <div className="flex space-x-4">
                                            {['A5', 'A4', 'Letter'].map(size => (
                                                <label key={size} className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="paperSize"
                                                        value={size}
                                                        checked={templateConfig.paperSize === size}
                                                        onChange={(e) => handleChange('paperSize', e.target.value)}
                                                        className="mr-2"
                                                    />
                                                    <span className="text-sm text-gray-700">{size}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Orientation */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Orientation
                                        </label>
                                        <div className="flex space-x-4">
                                            {['Portrait', 'Landscape'].map(orientation => (
                                                <label key={orientation} className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="orientation"
                                                        value={orientation.toLowerCase()}
                                                        checked={templateConfig.orientation === orientation.toLowerCase()}
                                                        onChange={(e) => handleChange('orientation', e.target.value)}
                                                        className="mr-2"
                                                    />
                                                    <span className="text-sm text-gray-700">{orientation}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Margins */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Margins (in inches)
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {['top', 'bottom', 'left', 'right'].map(side => (
                                                <div key={side}>
                                                    <label className="block text-xs text-gray-600 mb-1 capitalize">
                                                        {side}
                                                    </label>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={templateConfig.margins?.[side] || 0.7}
                                                        onChange={(e) => handleMarginChange(side, e.target.value)}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Font Section */}
                        <div className="bg-white rounded-lg border border-gray-200">
                            <button
                                onClick={() => toggleSection('font')}
                                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
                            >
                                <span className="font-semibold text-gray-800">Font</span>
                                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${expandedSections.font ? 'rotate-180' : ''}`} />
                            </button>

                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSections.font ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="px-4 pb-4 space-y-4">
                                    {/* PDF Font */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            PDF Font
                                        </label>
                                        <select
                                            value={templateConfig.fontFamily || 'Arial'}
                                            onChange={(e) => handleChange('fontFamily', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                                        >
                                            <option value="Arial">Arial</option>
                                            <option value="Helvetica">Helvetica</option>
                                            <option value="Times New Roman">Times New Roman</option>
                                            <option value="Georgia">Georgia</option>
                                            <option value="Courier New">Courier New</option>
                                        </select>
                                    </div>

                                    {/* Label Colour */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Label Colour
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={templateConfig.labelColor || '#333333'}
                                                onChange={(e) => handleChange('labelColor', e.target.value)}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                                                placeholder="#333333"
                                            />
                                            <input
                                                type="color"
                                                value={templateConfig.labelColor || '#333333'}
                                                onChange={(e) => handleChange('labelColor', e.target.value)}
                                                className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                                            />
                                        </div>
                                    </div>

                                    {/* Font Colour and Font Size in same row */}
                                    <div className='grid grid-cols-2 gap-3'>
                                        {/* Font Colour */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Font Colour
                                            </label>
                                            <div className="flex items-center gap-1.5">
                                                <input
                                                    type="text"
                                                    value={templateConfig.fontColor || '#333333'}
                                                    onChange={(e) => handleChange('fontColor', e.target.value)}
                                                    className="w-20 px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-xs"
                                                    placeholder="#333333"
                                                />
                                                <input
                                                    type="color"
                                                    value={templateConfig.fontColor || '#333333'}
                                                    onChange={(e) => handleChange('fontColor', e.target.value)}
                                                    className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                                                />
                                            </div>
                                        </div>

                                        {/* Font Size */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Font Size
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    min="6"
                                                    max="72"
                                                    value={templateConfig.fontSize || 9}
                                                    onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
                                                    className="flex-1 w-10 px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                />
                                                <span className="text-sm text-gray-600 font-medium">pt</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Background Section */}
                        <div className="bg-white rounded-lg border border-gray-200">
                            <button
                                onClick={() => toggleSection('background')}
                                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
                            >
                                <span className="font-semibold text-gray-800">Background</span>
                                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${expandedSections.background ? 'rotate-180' : ''}`} />
                            </button>

                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSections.background ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="px-4 pb-4 space-y-4">
                                    {/* Background Image */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Background Image
                                        </label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                            <input
                                                ref={backgroundImageInputRef}
                                                type="file"
                                                accept="image/gif,image/png,image/jpeg,image/jpg,image/bmp"
                                                onChange={handleBackgroundImageUpload}
                                                className="hidden"
                                            />
                                            {templateConfig.backgroundImage ? (
                                                <div className="space-y-2">
                                                    <img
                                                        src={templateConfig.backgroundImage}
                                                        alt="Background"
                                                        className="max-h-20 mx-auto rounded"
                                                    />
                                                    <div className="flex gap-2 justify-center">
                                                        <button
                                                            onClick={() => backgroundImageInputRef.current?.click()}
                                                            className="text-xs text-blue-600 hover:text-blue-800"
                                                        >
                                                            Change
                                                        </button>
                                                        <button
                                                            onClick={() => handleChange('backgroundImage', null)}
                                                            className="text-xs text-red-600 hover:text-red-800"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                                                    <p className="text-sm text-gray-600 mb-1">
                                                        Drag and drop or{' '}
                                                        <button
                                                            onClick={() => backgroundImageInputRef.current?.click()}
                                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                                        >
                                                            Upload file
                                                        </button>
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Maximum size: 1 MB<br />
                                                        Supported Formats: GIF, PNG, JPEG, JPG, BMP
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Image Position */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Image Position
                                        </label>
                                        <select
                                            value={templateConfig.backgroundPosition || 'center center'}
                                            onChange={(e) => handleChange('backgroundPosition', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                                        >
                                            <option value="center center">Centre centre</option>
                                            <option value="top left">Top left</option>
                                            <option value="top center">Top centre</option>
                                            <option value="top right">Top right</option>
                                            <option value="center left">Centre left</option>
                                            <option value="center right">Centre right</option>
                                            <option value="bottom left">Bottom left</option>
                                            <option value="bottom center">Bottom centre</option>
                                            <option value="bottom right">Bottom right</option>
                                        </select>
                                    </div>

                                    {/* Background Colour */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <input
                                                type="checkbox"
                                                checked={templateConfig.backgroundColorEnabled || false}
                                                onChange={(e) => handleChange('backgroundColorEnabled', e.target.checked)}
                                                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                            />
                                            <label className="text-sm font-medium text-gray-700">
                                                Background Colour
                                            </label>
                                        </div>
                                        {templateConfig.backgroundColorEnabled && (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={templateConfig.backgroundColor || '#ffffff'}
                                                    onChange={(e) => handleChange('backgroundColor', e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                                                    placeholder="#ffffff"
                                                />
                                                <input
                                                    type="color"
                                                    value={templateConfig.backgroundColor || '#ffffff'}
                                                    onChange={(e) => handleChange('backgroundColor', e.target.value)}
                                                    className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header & Footer Tab */}
                {activeTab === 'header' && (
                    <div className="p-4 space-y-4">
                        {/* Header Section */}
                        <div className="bg-white rounded-lg border border-gray-200">
                            <button
                                onClick={() => toggleSection('headerSection')}
                                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
                            >
                                <span className="font-semibold text-gray-800">Header</span>
                                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${expandedSections.headerSection ? 'rotate-180' : ''}`} />
                            </button>

                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSections.headerSection ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="px-4 pb-4 space-y-4">
                                    {/* Background Image */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Background Image
                                        </label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/gif,image/png,image/jpeg,image/jpg,image/bmp"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                            />
                                            {templateConfig.header?.backgroundImage ? (
                                                <div className="space-y-2">
                                                    <img
                                                        src={templateConfig.header.backgroundImage}
                                                        alt="Header background"
                                                        className="max-h-20 mx-auto rounded"
                                                    />
                                                    <div className="flex gap-2 justify-center">
                                                        <button
                                                            onClick={() => fileInputRef.current?.click()}
                                                            className="text-xs text-blue-600 hover:text-blue-800"
                                                        >
                                                            Change
                                                        </button>
                                                        <button
                                                            onClick={() => handleHeaderChange('backgroundImage', null)}
                                                            className="text-xs text-red-600 hover:text-red-800"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                    <p className="text-sm text-gray-600 mb-1">
                                                        Drag and drop or{' '}
                                                        <button
                                                            onClick={() => fileInputRef.current?.click()}
                                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                                        >
                                                            Upload file
                                                        </button>
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Maximum size: 1 MB<br />
                                                        Supported Formats: GIF, PNG, JPEG, JPG, BMP
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Image Position */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Image Position
                                        </label>
                                        <select
                                            value={templateConfig.header?.imagePosition || 'center'}
                                            onChange={(e) => handleHeaderChange('imagePosition', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="center">Center center</option>
                                            <option value="top-left">Top left</option>
                                            <option value="top-center">Top center</option>
                                            <option value="top-right">Top right</option>
                                            <option value="center-left">Center left</option>
                                            <option value="center-right">Center right</option>
                                            <option value="bottom-left">Bottom left</option>
                                            <option value="bottom-center">Bottom center</option>
                                            <option value="bottom-right">Bottom right</option>
                                        </select>
                                    </div>

                                    {/* Background Colour */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Background Colour
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="color"
                                                value={templateConfig.header?.backgroundColor || '#ffffff'}
                                                onChange={(e) => handleHeaderChange('backgroundColor', e.target.value)}
                                                className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={templateConfig.header?.backgroundColor || '#ffffff'}
                                                onChange={(e) => handleHeaderChange('backgroundColor', e.target.value)}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                placeholder="#ffffff"
                                            />
                                        </div>
                                    </div>

                                    {/* Customise header content */}
                                    <div className="border-t border-gray-200 pt-3 space-y-3">
                                        {/* Enable Custom Content Toggle */}
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-medium text-gray-700">
                                                Enable Custom Header Content
                                            </label>
                                            <input
                                                type="checkbox"
                                                checked={templateConfig.header?.enableCustomContent || false}
                                                onChange={(e) => handleHeaderChange('enableCustomContent', e.target.checked)}
                                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                        </div>

                                        {/* Custom Content Position */}
                                        {templateConfig.header?.enableCustomContent && (
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    Custom Content Position
                                                </label>
                                                <select
                                                    value={templateConfig.header?.customContentPosition || 'below'}
                                                    onChange={(e) => handleHeaderChange('customContentPosition', e.target.value)}
                                                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="above">Above existing header</option>
                                                    <option value="below">Below existing header</option>
                                                    <option value="replace">Replace existing header</option>
                                                </select>
                                            </div>
                                        )}

                                        {/* Customise Button */}
                                        <button
                                            onClick={() => setIsHeaderModalOpen(true)}
                                            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 w-full"
                                        >
                                            <Settings className="w-4 h-4" />
                                            Customise your header content
                                        </button>
                                    </div>

                                    {/* Apply to first page only */}
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="firstPageOnly"
                                            checked={templateConfig.header?.applyToFirstPageOnly || false}
                                            onChange={(e) => handleHeaderChange('applyToFirstPageOnly', e.target.checked)}
                                            className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor="firstPageOnly" className="text-sm text-gray-700">
                                            Apply to first page only
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Section */}
                        <div className="bg-white rounded-lg border border-gray-200">
                            <button
                                onClick={() => toggleSection('footerSection')}
                                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
                            >
                                <span className="font-semibold text-gray-800">Footer</span>
                                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${expandedSections.footerSection ? 'rotate-180' : ''}`} />
                            </button>

                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSections.footerSection ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="px-4 pb-4 space-y-4">
                                    {/* Font Size */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Font Size
                                        </label>
                                        <div className="flex gap-2 items-center">
                                            <input
                                                type="number"
                                                min="6"
                                                max="20"
                                                value={templateConfig.footer?.fontSize || 10}
                                                onChange={(e) => handleFooterChange('fontSize', parseInt(e.target.value))}
                                                className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-600">pt</span>
                                        </div>
                                    </div>

                                    {/* Font Colour */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Font Colour
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={templateConfig.footer?.textColor || '#aaaaaa'}
                                                onChange={(e) => handleFooterChange('textColor', e.target.value)}
                                                className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                placeholder="#aaaaaa"
                                            />
                                            <input
                                                type="color"
                                                value={templateConfig.footer?.textColor || '#aaaaaa'}
                                                onChange={(e) => handleFooterChange('textColor', e.target.value)}
                                                className="h-9 w-12 border border-gray-300 rounded cursor-pointer"
                                            />
                                        </div>
                                    </div>

                                    {/* Background Image */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-2">
                                            Background Image
                                        </label>
                                        <div className="text-center border-2 border-dashed border-gray-300 rounded-lg p-4">
                                            <Upload className="w-8 h-8 mx-auto text-blue-500 mb-2" />
                                            <p className="text-sm text-gray-600 mb-1">Drag and drop or <button className="text-blue-600 hover:underline">Upload file</button></p>
                                            <p className="text-xs text-gray-500">Maximum size: 1 MB</p>
                                            <p className="text-xs text-gray-500">Supported Formats: GIF, PNG, JPEG, JPG, BMP</p>
                                            <button className="mt-2 text-sm text-blue-600 hover:underline">Choose from Gallery</button>
                                        </div>
                                    </div>

                                    {/* Image Position */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Image Position
                                        </label>
                                        <select
                                            value={templateConfig.footer?.imagePosition || 'center'}
                                            onChange={(e) => handleFooterChange('imagePosition', e.target.value)}
                                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="center">Centre centre</option>
                                            <option value="top-left">Top left</option>
                                            <option value="top-center">Top center</option>
                                            <option value="top-right">Top right</option>
                                            <option value="center-left">Center left</option>
                                            <option value="center-right">Center right</option>
                                            <option value="bottom-left">Bottom left</option>
                                            <option value="bottom-center">Bottom center</option>
                                            <option value="bottom-right">Bottom right</option>
                                        </select>
                                    </div>

                                    {/* Background Colour */}
                                    <div>
                                        <div className="flex items-center mb-2">
                                            <input
                                                type="checkbox"
                                                id="footerBgColorEnabled"
                                                checked={templateConfig.footer?.backgroundColorEnabled ?? false}
                                                onChange={(e) => handleFooterChange('backgroundColorEnabled', e.target.checked)}
                                                className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <label htmlFor="footerBgColorEnabled" className="text-xs font-medium text-gray-700">
                                                Background Colour
                                            </label>
                                        </div>
                                        {templateConfig.footer?.backgroundColorEnabled && (
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={templateConfig.footer?.backgroundColor || '#ffffff'}
                                                    onChange={(e) => handleFooterChange('backgroundColor', e.target.value)}
                                                    className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                    placeholder="#ffffff"
                                                />
                                                <input
                                                    type="color"
                                                    value={templateConfig.footer?.backgroundColor || '#ffffff'}
                                                    onChange={(e) => handleFooterChange('backgroundColor', e.target.value)}
                                                    className="h-9 w-12 border border-gray-300 rounded cursor-pointer"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Page Number */}
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="showPageNumbers"
                                            checked={templateConfig.footer?.showPageNumbers ?? true}
                                            onChange={(e) => handleFooterChange('showPageNumbers', e.target.checked)}
                                            className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor="showPageNumbers" className="text-xs font-medium text-gray-700">
                                            Page Number
                                        </label>
                                    </div>

                                    {/* Page Number Position */}
                                    {templateConfig.footer?.showPageNumbers && (
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Page Number Position
                                            </label>
                                            <select
                                                value={templateConfig.footer?.pageNumberPosition || 'right'}
                                                onChange={(e) => handleFooterChange('pageNumberPosition', e.target.value)}
                                                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="left">Left</option>
                                                <option value="center">Center</option>
                                                <option value="right">Right</option>
                                            </select>
                                        </div>
                                    )}

                                    {/* Page Number Format */}
                                    {templateConfig.footer?.showPageNumbers && (
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Page Number Format
                                                <button className="ml-2 text-blue-600 text-xs hover:underline">Pre-defined Formats</button>
                                            </label>
                                            <input
                                                type="text"
                                                value={templateConfig.footer?.pageNumberFormat || '${CurrentPageNumber}'}
                                                onChange={(e) => handleFooterChange('pageNumberFormat', e.target.value)}
                                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 mb-1"
                                                placeholder="${CurrentPageNumber}"
                                            />
                                            <p className="text-xs text-gray-500">Preview : <span className="font-medium">1</span></p>
                                            <div className="mt-2 p-3 bg-blue-50 rounded-md">
                                                <div className="flex items-start gap-2">
                                                    <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                                    <p className="text-xs text-gray-700">
                                                        <strong>Note:</strong> Use placeholders ${'{'}CurrentPageNumber{'}'} for the current page number, ${'{'}TotalPages{'}'} for the total pages count.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Customise footer content */}
                                    <div className="border-t border-gray-200 pt-3 mt-4 space-y-3">
                                        {/* Enable Custom Content Toggle */}
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-medium text-gray-700">
                                                Enable Custom Footer Content
                                            </label>
                                            <input
                                                type="checkbox"
                                                checked={templateConfig.footer?.enableCustomContent || false}
                                                onChange={(e) => handleFooterChange('enableCustomContent', e.target.checked)}
                                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                        </div>

                                        {/* Custom Content Position */}
                                        {templateConfig.footer?.enableCustomContent && (
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    Custom Content Position
                                                </label>
                                                <select
                                                    value={templateConfig.footer?.customContentPosition || 'above'}
                                                    onChange={(e) => handleFooterChange('customContentPosition', e.target.value)}
                                                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="above">Above page numbers</option>
                                                    <option value="below">Below page numbers</option>
                                                    <option value="replace">Replace page numbers</option>
                                                </select>
                                            </div>
                                        )}

                                        {/* Customise Button */}
                                        <button
                                            onClick={() => setIsFooterModalOpen(true)}
                                            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 w-full"
                                        >
                                            <Settings className="w-4 h-4" />
                                            Customise your footer content
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Transaction Details Tab */}
                {activeTab === 'transaction' && (
                    <div className="p-4 space-y-4">
                        {/* Organisation Details Section */}
                        <div className="bg-white rounded-lg border border-gray-200">
                            <button
                                onClick={() => toggleSection('organisationDetails')}
                                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
                            >
                                <span className="font-semibold text-gray-800">Organisation Details</span>
                                {expandedSections.organisationDetails ? (
                                    <ChevronDown className="w-4 h-4 text-gray-500" />
                                ) : (
                                    <ChevronRight className="w-4 h-4 text-gray-500" />
                                )}
                            </button>

                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSections.organisationDetails ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="px-4 pb-4 space-y-4">
                                    {/* Show Organisation Logo */}
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="showOrgLogo"
                                            checked={templateConfig.transactionDetails?.showOrgLogo ?? true}
                                            onChange={(e) => handleTransactionDetailsChange('showOrgLogo', e.target.checked)}
                                            className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor="showOrgLogo" className="text-sm text-gray-700">
                                            Show Organisation Logo
                                        </label>
                                    </div>

                                    {/* Upload Logo / Logo Preview */}
                                    {templateConfig.transactionDetails?.showOrgLogo && (
                                        <>
                                            <div
                                                className="border border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors bg-gray-100 relative"
                                                onClick={() => {
                                                    const input = document.createElement('input');
                                                    input.type = 'file';
                                                    input.accept = 'image/*';
                                                    input.onchange = (e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onload = (event) => {
                                                                handleTransactionDetailsChange('orgLogo', event.target.result);
                                                            };
                                                            reader.readAsDataURL(file);
                                                        }
                                                    };
                                                    input.click();
                                                }}
                                            >
                                                {templateConfig.transactionDetails?.orgLogo ? (
                                                    <img
                                                        src={templateConfig.transactionDetails.orgLogo}
                                                        alt="Organization Logo"
                                                        className="max-h-32 mx-auto object-contain"
                                                    />
                                                ) : (
                                                    <div className="py-8">
                                                        <Upload className="w-6 h-6 mx-auto mb-2 text-gray-500" />
                                                        <p className="text-sm text-gray-600">Upload your Files</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info Message */}
                                            <div className="flex items-start gap-2 text-xs text-gray-500">
                                                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                <span className="italic">You can change the logo in Organization Profile.</span>
                                            </div>

                                            {/* Resize Logo Slider */}
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <label className="text-sm font-medium text-gray-700">
                                                        Resize Logo
                                                    </label>
                                                    <Info className="w-4 h-4 text-gray-400" />
                                                </div>
                                                <input
                                                    type="range"
                                                    min="1"
                                                    max="3"
                                                    value={
                                                        templateConfig.transactionDetails?.orgLogoSize === 'small' ? 1 :
                                                        templateConfig.transactionDetails?.orgLogoSize === 'large' ? 3 : 2
                                                    }
                                                    onChange={(e) => {
                                                        const sizeMap = { 1: 'small', 2: 'medium', 3: 'large' };
                                                        handleTransactionDetailsChange('orgLogoSize', sizeMap[e.target.value]);
                                                    }}
                                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                                />
                                            </div>
                                        </>
                                    )}

                                    {/* Show Organisation Name */}
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="showOrgName"
                                            checked={templateConfig.transactionDetails?.showOrgName ?? true}
                                            onChange={(e) => handleTransactionDetailsChange('showOrgName', e.target.checked)}
                                            className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor="showOrgName" className="text-sm text-gray-700">
                                            Show Organisation Name
                                        </label>
                                    </div>

                                    {/* Organisation Name Styling - Color and Font Size in One Row */}
                                    {templateConfig.transactionDetails?.showOrgName && (
                                        <div className="flex gap-3 w-full">
                                            {/* Color Section - 50% */}
                                            <div className="flex-1 w-1/2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Color
                                                </label>
                                                <div className="flex gap-2 items-center">
                                                    <input
                                                        type="text"
                                                        value={templateConfig.transactionDetails?.orgNameColor || '#000000'}
                                                        onChange={(e) => handleTransactionDetailsChange('orgNameColor', e.target.value)}
                                                        className="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                                                        placeholder="#000000"
                                                    />
                                                    <div
                                                        className="w-10 h-10 border border-gray-300 rounded cursor-pointer flex-shrink-0"
                                                        style={{ backgroundColor: templateConfig.transactionDetails?.orgNameColor || '#000000' }}
                                                        onClick={() => {
                                                            const input = document.createElement('input');
                                                            input.type = 'color';
                                                            input.value = templateConfig.transactionDetails?.orgNameColor || '#000000';
                                                            input.onchange = (e) => handleTransactionDetailsChange('orgNameColor', e.target.value);
                                                            input.click();
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Font Size Section - 50% */}
                                            <div className="flex-1 w-1/2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Font Size
                                                </label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        min="8"
                                                        max="24"
                                                        value={templateConfig.transactionDetails?.orgNameFontSize || 12}
                                                        onChange={(e) => handleTransactionDetailsChange('orgNameFontSize', parseInt(e.target.value))}
                                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-600 flex-shrink-0">pt</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Show Organisation Address */}
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="showOrgAddress"
                                            checked={templateConfig.transactionDetails?.showOrgAddress ?? true}
                                            onChange={(e) => handleTransactionDetailsChange('showOrgAddress', e.target.checked)}
                                            className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor="showOrgAddress" className="text-sm text-gray-700">
                                            Show Organisation Address
                                        </label>
                                    </div>

                                    {/* Organization Address Format Button */}
                                    {templateConfig.transactionDetails?.showOrgAddress && (
                                        <button
                                            onClick={() => {
                                                // TODO: Open Organization Address Format Modal
                                                alert('Organization Address Format modal coming soon');
                                            }}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            <Settings className="w-4 h-4" />
                                            Organization Address Format
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Customer Details Section */}
                        <div className="bg-white rounded-lg border border-gray-200">
                            <button
                                onClick={() => toggleSection('customerDetails')}
                                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
                            >
                                <span className="font-semibold text-gray-800">Customer Details</span>
                                {expandedSections.customerDetails ? (
                                    <ChevronDown className="w-4 h-4 text-gray-500" />
                                ) : (
                                    <ChevronRight className="w-4 h-4 text-gray-500" />
                                )}
                            </button>

                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSections.customerDetails ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="px-4 pb-4 space-y-4">
                                    {/* Customer Name Styling */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Customer Name
                                        </label>

                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    Font Colour
                                                </label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="color"
                                                        value={templateConfig.transactionDetails?.customerNameColor || '#333333'}
                                                        onChange={(e) => handleTransactionDetailsChange('customerNameColor', e.target.value)}
                                                        className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={templateConfig.transactionDetails?.customerNameColor || '#333333'}
                                                        onChange={(e) => handleTransactionDetailsChange('customerNameColor', e.target.value)}
                                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                        placeholder="#333333"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    Font Size (pt)
                                                </label>
                                                <input
                                                    type="number"
                                                    min="8"
                                                    max="18"
                                                    value={templateConfig.transactionDetails?.customerNameFontSize || 9}
                                                    onChange={(e) => handleTransactionDetailsChange('customerNameFontSize', parseInt(e.target.value))}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bill To */}
                                    <div>
                                        <div className="flex items-center mb-2">
                                            <input
                                                type="checkbox"
                                                id="showBillTo"
                                                checked={templateConfig.transactionDetails?.showBillTo ?? true}
                                                onChange={(e) => handleTransactionDetailsChange('showBillTo', e.target.checked)}
                                                className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <label htmlFor="showBillTo" className="text-sm font-medium text-gray-700">
                                                Bill To
                                            </label>
                                        </div>
                                        {templateConfig.transactionDetails?.showBillTo && (
                                            <input
                                                type="text"
                                                value={templateConfig.transactionDetails?.billToLabel || 'Bill To'}
                                                onChange={(e) => handleTransactionDetailsChange('billToLabel', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                placeholder="Bill To"
                                            />
                                        )}
                                    </div>

                                    {/* Ship To */}
                                    <div>
                                        <div className="flex items-center mb-2">
                                            <input
                                                type="checkbox"
                                                id="showShipTo"
                                                checked={templateConfig.transactionDetails?.showShipTo ?? false}
                                                onChange={(e) => handleTransactionDetailsChange('showShipTo', e.target.checked)}
                                                className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <label htmlFor="showShipTo" className="text-sm font-medium text-gray-700">
                                                Ship To
                                            </label>
                                        </div>
                                        {templateConfig.transactionDetails?.showShipTo && (
                                            <input
                                                type="text"
                                                value={templateConfig.transactionDetails?.shipToLabel || 'Ship To'}
                                                onChange={(e) => handleTransactionDetailsChange('shipToLabel', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                placeholder="Ship To"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Document Details Section */}
                        <div className="bg-white rounded-lg border border-gray-200">
                            <button
                                onClick={() => toggleSection('documentDetails')}
                                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
                            >
                                <span className="font-semibold text-gray-800">Document Details</span>
                                {expandedSections.documentDetails ? (
                                    <ChevronDown className="w-4 h-4 text-gray-500" />
                                ) : (
                                    <ChevronRight className="w-4 h-4 text-gray-500" />
                                )}
                            </button>

                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSections.documentDetails ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="px-4 pb-4 space-y-4">
                                    {/* Show Document Title */}
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="showDocumentTitle"
                                            checked={templateConfig.transactionDetails?.showDocumentTitle ?? true}
                                            onChange={(e) => handleTransactionDetailsChange('showDocumentTitle', e.target.checked)}
                                            className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor="showDocumentTitle" className="text-sm text-gray-700">
                                            Show Document Title
                                        </label>
                                    </div>

                                    {/* Document Title Styling */}
                                    {templateConfig.transactionDetails?.showDocumentTitle && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Document Title
                                                </label>
                                                <input
                                                    type="text"
                                                    value={templateConfig.transactionDetails?.documentTitleText || 'Quote'}
                                                    onChange={(e) => handleTransactionDetailsChange('documentTitleText', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Quote"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Font Size (pt)
                                                </label>
                                                <input
                                                    type="number"
                                                    min="14"
                                                    max="48"
                                                    value={templateConfig.transactionDetails?.documentTitleFontSize || 28}
                                                    onChange={(e) => handleTransactionDetailsChange('documentTitleFontSize', parseInt(e.target.value))}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Font Colour
                                                </label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="color"
                                                        value={templateConfig.transactionDetails?.documentTitleColor || '#034287'}
                                                        onChange={(e) => handleTransactionDetailsChange('documentTitleColor', e.target.value)}
                                                        className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={templateConfig.transactionDetails?.documentTitleColor || '#034287'}
                                                        onChange={(e) => handleTransactionDetailsChange('documentTitleColor', e.target.value)}
                                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                        placeholder="#034287"
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* Phone and Fax Number Fields */}
                                    <div className="flex gap-3 w-full">
                                        {/* Phone Field - 50% */}
                                        <div className="flex-1 w-1/2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Phone
                                            </label>
                                            <input
                                                type="text"
                                                value={templateConfig.transactionDetails?.phone || ''}
                                                onChange={(e) => handleTransactionDetailsChange('phone', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                                                placeholder="Phone"
                                            />
                                        </div>

                                        {/* Fax Number Field - 50% */}
                                        <div className="flex-1 w-1/2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Fax Number
                                            </label>
                                            <input
                                                type="text"
                                                value={templateConfig.transactionDetails?.fax || ''}
                                                onChange={(e) => handleTransactionDetailsChange('fax', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                                                placeholder="Fax"
                                            />
                                        </div>
                                    </div>

                                    {/* Document Information */}
                                    <div className="border-t border-gray-200 pt-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Document Information
                                        </label>

                                        <div className="space-y-3">
                                            {/* Number Field */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center flex-1">
                                                    <input
                                                        type="checkbox"
                                                        id="showNumberField"
                                                        checked={templateConfig.transactionDetails?.showNumberField ?? true}
                                                        onChange={(e) => handleTransactionDetailsChange('showNumberField', e.target.checked)}
                                                        className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                    <label htmlFor="showNumberField" className="text-xs text-gray-700">
                                                        Number Field
                                                    </label>
                                                </div>
                                                {templateConfig.transactionDetails?.showNumberField && (
                                                    <input
                                                        type="text"
                                                        value={templateConfig.transactionDetails?.numberFieldLabel || 'Quote#'}
                                                        onChange={(e) => handleTransactionDetailsChange('numberFieldLabel', e.target.value)}
                                                        className="w-32 px-2 py-1 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                        placeholder="Quote#"
                                                    />
                                                )}
                                            </div>

                                            {/* Date Field */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center flex-1">
                                                    <input
                                                        type="checkbox"
                                                        id="showDateField"
                                                        checked={templateConfig.transactionDetails?.showDateField ?? true}
                                                        onChange={(e) => handleTransactionDetailsChange('showDateField', e.target.checked)}
                                                        className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                    <label htmlFor="showDateField" className="text-xs text-gray-700">
                                                        Date Field
                                                    </label>
                                                </div>
                                                {templateConfig.transactionDetails?.showDateField && (
                                                    <input
                                                        type="text"
                                                        value={templateConfig.transactionDetails?.dateFieldLabel || 'Quote Date'}
                                                        onChange={(e) => handleTransactionDetailsChange('dateFieldLabel', e.target.value)}
                                                        className="w-32 px-2 py-1 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                        placeholder="Quote Date"
                                                    />
                                                )}
                                            </div>

                                            {/* Expiry Date */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center flex-1">
                                                    <input
                                                        type="checkbox"
                                                        id="showExpiryDate"
                                                        checked={templateConfig.transactionDetails?.showExpiryDate ?? true}
                                                        onChange={(e) => handleTransactionDetailsChange('showExpiryDate', e.target.checked)}
                                                        className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                    <label htmlFor="showExpiryDate" className="text-xs text-gray-700">
                                                        Expiry Date
                                                    </label>
                                                </div>
                                                {templateConfig.transactionDetails?.showExpiryDate && (
                                                    <input
                                                        type="text"
                                                        value={templateConfig.transactionDetails?.expiryDateLabel || 'Expiry Date'}
                                                        onChange={(e) => handleTransactionDetailsChange('expiryDateLabel', e.target.value)}
                                                        className="w-32 px-2 py-1 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                        placeholder="Expiry Date"
                                                    />
                                                )}
                                            </div>

                                            {/* VAT Number */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center flex-1">
                                                    <input
                                                        type="checkbox"
                                                        id="showVATNumber"
                                                        checked={templateConfig.transactionDetails?.showVATNumber ?? true}
                                                        onChange={(e) => handleTransactionDetailsChange('showVATNumber', e.target.checked)}
                                                        className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                    <label htmlFor="showVATNumber" className="text-xs text-gray-700">
                                                        Contact's VAT Number
                                                    </label>
                                                </div>
                                                {templateConfig.transactionDetails?.showVATNumber && (
                                                    <input
                                                        type="text"
                                                        value={templateConfig.transactionDetails?.vatNumberLabel || 'VAT No.'}
                                                        onChange={(e) => handleTransactionDetailsChange('vatNumberLabel', e.target.value)}
                                                        className="w-32 px-2 py-1 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                        placeholder="VAT No."
                                                    />
                                                )}
                                            </div>

                                            {/* Reference Field */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center flex-1">
                                                    <input
                                                        type="checkbox"
                                                        id="showReferenceField"
                                                        checked={templateConfig.transactionDetails?.showReferenceField ?? true}
                                                        onChange={(e) => handleTransactionDetailsChange('showReferenceField', e.target.checked)}
                                                        className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                    <label htmlFor="showReferenceField" className="text-xs text-gray-700">
                                                        Reference Field
                                                    </label>
                                                </div>
                                                {templateConfig.transactionDetails?.showReferenceField && (
                                                    <input
                                                        type="text"
                                                        value={templateConfig.transactionDetails?.referenceFieldLabel || 'Reference#'}
                                                        onChange={(e) => handleTransactionDetailsChange('referenceFieldLabel', e.target.value)}
                                                        className="w-32 px-2 py-1 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                        placeholder="Reference#"
                                                    />
                                                )}
                                            </div>

                                            {/* Salesperson */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center flex-1">
                                                    <input
                                                        type="checkbox"
                                                        id="showSalesperson"
                                                        checked={templateConfig.transactionDetails?.showSalesperson ?? true}
                                                        onChange={(e) => handleTransactionDetailsChange('showSalesperson', e.target.checked)}
                                                        className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                    <label htmlFor="showSalesperson" className="text-xs text-gray-700">
                                                        Salesperson
                                                    </label>
                                                </div>
                                                {templateConfig.transactionDetails?.showSalesperson && (
                                                    <input
                                                        type="text"
                                                        value={templateConfig.transactionDetails?.salespersonLabel || 'Sales person'}
                                                        onChange={(e) => handleTransactionDetailsChange('salespersonLabel', e.target.value)}
                                                        className="w-32 px-2 py-1 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                        placeholder="Sales person"
                                                    />
                                                )}
                                            </div>

                                            {/* Project */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center flex-1">
                                                    <input
                                                        type="checkbox"
                                                        id="showProject"
                                                        checked={templateConfig.transactionDetails?.showProject ?? false}
                                                        onChange={(e) => handleTransactionDetailsChange('showProject', e.target.checked)}
                                                        className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                    <label htmlFor="showProject" className="text-xs text-gray-700">
                                                        Project
                                                    </label>
                                                </div>
                                                {templateConfig.transactionDetails?.showProject && (
                                                    <input
                                                        type="text"
                                                        value={templateConfig.transactionDetails?.projectLabel || 'Project Name'}
                                                        onChange={(e) => handleTransactionDetailsChange('projectLabel', e.target.value)}
                                                        className="w-32 px-2 py-1 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                        placeholder="Project Name"
                                                    />
                                                )}
                                            </div>

                                            {/* Subject */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center flex-1">
                                                    <input
                                                        type="checkbox"
                                                        id="showSubject"
                                                        checked={templateConfig.transactionDetails?.showSubject ?? true}
                                                        onChange={(e) => handleTransactionDetailsChange('showSubject', e.target.checked)}
                                                        className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                    <label htmlFor="showSubject" className="text-xs text-gray-700">
                                                        Subject
                                                    </label>
                                                </div>
                                                {templateConfig.transactionDetails?.showSubject && (
                                                    <input
                                                        type="text"
                                                        value={templateConfig.transactionDetails?.subjectLabel || 'Subject'}
                                                        onChange={(e) => handleTransactionDetailsChange('subjectLabel', e.target.value)}
                                                        className="w-32 px-2 py-1 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                        placeholder="Subject"
                                                    />
                                                )}
                                            </div>

                                            {/* Add Attention Content Button */}
                                            <button
                                                onClick={() => {
                                                    setIsAttentionModalOpen(true);
                                                    // Auto-enable attention content when opening modal
                                                    if (!templateConfig.transactionDetails?.showAttentionContent) {
                                                        handleTransactionDetailsChange('showAttentionContent', true);
                                                    }
                                                }}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors mt-3"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Add Attention Content
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Table Tab */}
                {activeTab === 'table' && (
                    <div className="p-4 space-y-4">
                        {/* Table Properties Header */}
                        <div className="bg-white rounded-lg border border-gray-200">
                            <div className="px-4 py-3">
                                <h2 className="font-semibold text-gray-800">Table Properties</h2>
                            </div>
                        </div>

                        {/* Sub-tabs */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setTableSubTab('labels')}
                                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
                                    tableSubTab === 'labels'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                Labels
                            </button>
                            <button
                                onClick={() => setTableSubTab('layout')}
                                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
                                    tableSubTab === 'layout'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                Layout
                            </button>
                        </div>

                        {/* Labels Tab Content */}
                        {tableSubTab === 'labels' && (
                            <div className="space-y-3">
                                {/* Column Configuration */}
                                {templateConfig.table?.columns?.length > 0 ? templateConfig.table.columns.map((column) => (
                                    <div key={column.id} className="bg-white rounded-lg border border-gray-200 p-4">
                                        <div className="flex items-start gap-3">
                                            {/* Checkbox */}
                                            <input
                                                type="checkbox"
                                                checked={column.visible}
                                                onChange={(e) => handleColumnChange(column.id, 'visible', e.target.checked)}
                                                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />

                                            <div className="flex-1 space-y-3">
                                                {/* Field Name */}
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                                        FIELD
                                                    </label>
                                                    <div className="text-sm font-medium text-gray-800">
                                                        {column.id === 'lineItemNumber' ? 'Line Item Number' :
                                                         column.id === 'item' ? 'Item' :
                                                         column.id === 'description' ? 'Description' :
                                                         column.id === 'customFields' ? 'Custom Fields' :
                                                         column.id === 'quantity' ? 'Quantity' :
                                                         column.id === 'rate' ? 'Rate' :
                                                         column.id === 'taxableAmount' ? 'Taxable Amount' :
                                                         column.id === 'vatRate' ? 'VAT Rate' :
                                                         column.id === 'vatAmount' ? 'VAT Amount' :
                                                         column.id === 'discount' ? 'Discount' :
                                                         column.id === 'amount' ? 'Amount' : column.id}
                                                    </div>
                                                </div>

                                                {/* Width and Label */}
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                                            WIDTH(%)
                                                        </label>
                                                        <input
                                                            type="number"
                                                            min="5"
                                                            max="50"
                                                            value={column.width}
                                                            onChange={(e) => handleColumnChange(column.id, 'width', parseInt(e.target.value))}
                                                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                                            LABEL
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={column.label}
                                                            onChange={(e) => handleColumnChange(column.id, 'label', e.target.value)}
                                                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Show Unit checkbox for Quantity */}
                                                {column.id === 'quantity' && (
                                                    <div className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            id={`showUnit-${column.id}`}
                                                            checked={column.showUnit || false}
                                                            onChange={(e) => handleColumnChange(column.id, 'showUnit', e.target.checked)}
                                                            className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                        />
                                                        <label htmlFor={`showUnit-${column.id}`} className="text-xs text-gray-700">
                                                            Show Unit
                                                        </label>
                                                    </div>
                                                )}

                                                {/* Add tax to amount checkbox for Amount */}
                                                {column.id === 'amount' && (
                                                    <div className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            id={`addTaxToAmount-${column.id}`}
                                                            checked={column.addTaxToAmount || false}
                                                            onChange={(e) => handleColumnChange(column.id, 'addTaxToAmount', e.target.checked)}
                                                            className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                        />
                                                        <label htmlFor={`addTaxToAmount-${column.id}`} className="text-xs text-gray-700">
                                                            Add tax to amount
                                                        </label>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                                        <p className="text-sm text-gray-500">No table columns configured. Please refresh the page.</p>
                                    </div>
                                )}

                                {/* Enable/Disable Custom Item Format Toggle */}
                                {templateConfig.table?.itemTemplate?.content && (
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-3">
                                        <span className="text-sm text-gray-700">Enable Custom Item Format</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={templateConfig.table?.itemTemplate?.enabled || false}
                                                onChange={(e) => onConfigChange({
                                                    ...templateConfig,
                                                    table: {
                                                        ...templateConfig.table,
                                                        itemTemplate: {
                                                            ...templateConfig.table?.itemTemplate,
                                                            enabled: e.target.checked
                                                        }
                                                    }
                                                })}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                )}

                                {/* Customize Item Name & Description Button */}
                                {templateConfig.table?.columns?.length > 0 && (
                                <button
                                    className="w-full px-4 py-2 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition flex items-center justify-center gap-2"
                                    onClick={() => setIsItemModalOpen(true)}
                                >
                                    <Settings className="w-4 h-4" />
                                    Customize Item Name & Description
                                </button>
                                )}
                            </div>
                        )}

                        {/* Layout Tab Content */}
                        {tableSubTab === 'layout' && (
                            <div className="space-y-4">
                                {/* Table Border */}
                                <div className="bg-white rounded-lg border border-gray-200 p-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Table Border
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            value={templateConfig.table?.borderColor || '#adadad'}
                                            onChange={(e) => handleTableChange('borderColor', e.target.value)}
                                            className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={templateConfig.table?.borderColor || '#adadad'}
                                            onChange={(e) => handleTableChange('borderColor', e.target.value)}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                            placeholder="#adadad"
                                        />
                                    </div>
                                </div>

                                {/* Table Header */}
                                <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
                                    <h3 className="text-sm font-semibold text-gray-800">Table Header</h3>

                                    {/* Font Size */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Font Size
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                min="6"
                                                max="16"
                                                value={templateConfig.table?.headerFontSize || 9}
                                                onChange={(e) => handleTableChange('headerFontSize', parseInt(e.target.value))}
                                                className="w-20 px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-500">pt</span>
                                        </div>
                                    </div>

                                    {/* Background Colour */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Background Colour
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="color"
                                                value={templateConfig.table?.headerBackgroundColor || '#064384'}
                                                onChange={(e) => handleTableChange('headerBackgroundColor', e.target.value)}
                                                className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={templateConfig.table?.headerBackgroundColor || '#064384'}
                                                onChange={(e) => handleTableChange('headerBackgroundColor', e.target.value)}
                                                className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                placeholder="#064384"
                                            />
                                        </div>
                                    </div>

                                    {/* Font Colour */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Font Colour
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="color"
                                                value={templateConfig.table?.headerFontColor || '#ffffff'}
                                                onChange={(e) => handleTableChange('headerFontColor', e.target.value)}
                                                className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={templateConfig.table?.headerFontColor || '#ffffff'}
                                                onChange={(e) => handleTableChange('headerFontColor', e.target.value)}
                                                className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                placeholder="#ffffff"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Item Row */}
                                <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
                                    <h3 className="text-sm font-semibold text-gray-800">Item Row</h3>

                                    {/* Font Size */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Font Size
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                min="6"
                                                max="16"
                                                value={templateConfig.table?.rowFontSize || 9}
                                                onChange={(e) => handleTableChange('rowFontSize', parseInt(e.target.value))}
                                                className="w-20 px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-500">pt</span>
                                        </div>
                                    </div>

                                    {/* Background Colour */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Background Colour
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="color"
                                                value={templateConfig.table?.rowBackgroundColor || '#ffffff'}
                                                onChange={(e) => handleTableChange('rowBackgroundColor', e.target.value)}
                                                className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={templateConfig.table?.rowBackgroundColor || '#ffffff'}
                                                onChange={(e) => handleTableChange('rowBackgroundColor', e.target.value)}
                                                className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                placeholder="#ffffff"
                                            />
                                        </div>
                                    </div>

                                    {/* Font Colour */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Font Colour
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="color"
                                                value={templateConfig.table?.rowFontColor || '#000000'}
                                                onChange={(e) => handleTableChange('rowFontColor', e.target.value)}
                                                className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={templateConfig.table?.rowFontColor || '#000000'}
                                                onChange={(e) => handleTableChange('rowFontColor', e.target.value)}
                                                className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                placeholder="#000000"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Item Description */}
                                <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
                                    <h3 className="text-sm font-semibold text-gray-800">Item Description</h3>

                                    {/* Font Size */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Font Size
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                min="6"
                                                max="14"
                                                value={templateConfig.table?.descriptionFontSize || 8}
                                                onChange={(e) => handleTableChange('descriptionFontSize', parseInt(e.target.value))}
                                                className="w-20 px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-500">pt</span>
                                        </div>
                                    </div>

                                    {/* Font Colour */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Font Colour
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="color"
                                                value={templateConfig.table?.descriptionFontColor || '#333333'}
                                                onChange={(e) => handleTableChange('descriptionFontColor', e.target.value)}
                                                className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={templateConfig.table?.descriptionFontColor || '#333333'}
                                                onChange={(e) => handleTableChange('descriptionFontColor', e.target.value)}
                                                className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                placeholder="#333333"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Total Tab */}
                {activeTab === 'total' && (
                    <div className="p-4 space-y-4">
                        {/* Total Section Collapsible */}
                        <div className="bg-white rounded-lg border border-gray-200">
                            <button
                                onClick={() => toggleSection('totalSection')}
                                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
                            >
                                <span className="font-semibold text-gray-800">Total Section</span>
                                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${expandedSections.totalSection ? 'rotate-180' : ''}`} />
                            </button>

                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSections.totalSection ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="px-4 pb-4 space-y-4">
                                    {/* Sub-tabs */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setTotalSubTab('labels')}
                                            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
                                                totalSubTab === 'labels'
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            Labels
                                        </button>
                                        <button
                                            onClick={() => setTotalSubTab('layout')}
                                            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
                                                totalSubTab === 'layout'
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            Layout
                                        </button>
                                    </div>

                                    {/* Labels Tab Content */}
                                    {totalSubTab === 'labels' && (
                                        <div className="space-y-3">
                                            {/* Show Total Section */}
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="showTotalSection"
                                                    checked={templateConfig.total?.showTotalSection ?? true}
                                                    onChange={(e) => handleTotalChange('showTotalSection', e.target.checked)}
                                                    className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                                <label htmlFor="showTotalSection" className="text-sm font-medium text-gray-700">
                                                    Show Total Section
                                                </label>
                                            </div>

                                            {/* Sub Total */}
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex items-center flex-1">
                                                    <input
                                                        type="checkbox"
                                                        id="showSubTotal"
                                                        checked={templateConfig.total?.subTotal?.visible ?? true}
                                                        onChange={(e) => handleTotalLabelChange('subTotal', 'visible', e.target.checked)}
                                                        className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                    <label htmlFor="showSubTotal" className="text-sm text-gray-700">
                                                        Sub Total
                                                    </label>
                                                </div>
                                                {templateConfig.total?.subTotal?.visible && (
                                                    <input
                                                        type="text"
                                                        value={templateConfig.total?.subTotal?.label || 'Sub Total'}
                                                        onChange={(e) => handleTotalLabelChange('subTotal', 'label', e.target.value)}
                                                        className="w-40 px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                        placeholder="Sub Total"
                                                    />
                                                )}
                                            </div>

                                            {/* Discount */}
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex items-center flex-1">
                                                    <input
                                                        type="checkbox"
                                                        id="showDiscount"
                                                        checked={templateConfig.total?.discount?.visible ?? true}
                                                        onChange={(e) => handleTotalLabelChange('discount', 'visible', e.target.checked)}
                                                        className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                    <label htmlFor="showDiscount" className="text-sm text-gray-700">
                                                        Discount
                                                    </label>
                                                </div>
                                                {templateConfig.total?.discount?.visible && (
                                                    <input
                                                        type="text"
                                                        value={templateConfig.total?.discount?.label || 'Discount'}
                                                        onChange={(e) => handleTotalLabelChange('discount', 'label', e.target.value)}
                                                        className="w-40 px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                        placeholder="Discount"
                                                    />
                                                )}
                                            </div>

                                            {/* Show Tax Details */}
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex items-center flex-1">
                                                    <input
                                                        type="checkbox"
                                                        id="showTaxDetails"
                                                        checked={templateConfig.total?.taxDetails?.visible ?? true}
                                                        onChange={(e) => handleTotalLabelChange('taxDetails', 'visible', e.target.checked)}
                                                        className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                    <label htmlFor="showTaxDetails" className="text-sm text-gray-700">
                                                        Show Tax Details
                                                    </label>
                                                </div>
                                                {templateConfig.total?.taxDetails?.visible && (
                                                    <input
                                                        type="text"
                                                        value={templateConfig.total?.taxDetails?.label || 'VAT'}
                                                        onChange={(e) => handleTotalLabelChange('taxDetails', 'label', e.target.value)}
                                                        className="w-40 px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                        placeholder="VAT"
                                                    />
                                                )}
                                            </div>

                                            {/* Total */}
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex items-center flex-1">
                                                    <input
                                                        type="checkbox"
                                                        id="showTotal"
                                                        checked={templateConfig.total?.total?.visible ?? true}
                                                        onChange={(e) => handleTotalLabelChange('total', 'visible', e.target.checked)}
                                                        className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                    <label htmlFor="showTotal" className="text-sm text-gray-700">
                                                        Total
                                                    </label>
                                                </div>
                                                {templateConfig.total?.total?.visible && (
                                                    <input
                                                        type="text"
                                                        value={templateConfig.total?.total?.label || 'Total'}
                                                        onChange={(e) => handleTotalLabelChange('total', 'label', e.target.value)}
                                                        className="w-40 px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                        placeholder="Total"
                                                    />
                                                )}
                                            </div>

                                            {/* Currency Symbol */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Currency Symbol
                                                </label>
                                                <select
                                                    value={templateConfig.total?.currencyPosition || 'before'}
                                                    onChange={(e) => handleTotalChange('currencyPosition', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="before">Before amount</option>
                                                    <option value="after">After amount</option>
                                                </select>
                                            </div>

                                            {/* Show Quantity */}
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="showQuantity"
                                                    checked={templateConfig.total?.showQuantity ?? false}
                                                    onChange={(e) => handleTotalChange('showQuantity', e.target.checked)}
                                                    className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                                <label htmlFor="showQuantity" className="text-sm text-gray-700">
                                                    Show Quantity
                                                </label>
                                            </div>

                                            {/* Show amount in words */}
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="showAmountInWords"
                                                    checked={templateConfig.total?.showAmountInWords ?? false}
                                                    onChange={(e) => handleTotalChange('showAmountInWords', e.target.checked)}
                                                    className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                                <label htmlFor="showAmountInWords" className="text-sm text-gray-700">
                                                    Show amount in words
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    {/* Layout Tab Content */}
                                    {totalSubTab === 'layout' && (
                                        <div className="space-y-4">
                                            {/* Total(Subtotal, Tax) Section */}
                                            <div className="space-y-3">
                                                <h3 className="text-sm font-semibold text-gray-800">Total(Subtotal, Tax)</h3>

                                                {/* Font Size */}
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        Font Size
                                                    </label>
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="number"
                                                            min="8"
                                                            max="16"
                                                            value={templateConfig.total?.totalSectionFontSize || 10}
                                                            onChange={(e) => handleTotalChange('totalSectionFontSize', parseInt(e.target.value))}
                                                            className="w-20 px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                        />
                                                        <span className="text-sm text-gray-500">pt</span>
                                                    </div>
                                                </div>

                                                {/* Font Colour */}
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        Font Colour
                                                    </label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="color"
                                                            value={templateConfig.total?.totalSectionFontColor || '#000000'}
                                                            onChange={(e) => handleTotalChange('totalSectionFontColor', e.target.value)}
                                                            className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={templateConfig.total?.totalSectionFontColor || '#000000'}
                                                            onChange={(e) => handleTotalChange('totalSectionFontColor', e.target.value)}
                                                            className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                            placeholder="#000000"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Background Colour */}
                                                <div>
                                                    <div className="flex items-center mb-2">
                                                        <input
                                                            type="checkbox"
                                                            id="totalSectionBgEnabled"
                                                            checked={templateConfig.total?.totalSectionBgEnabled ?? false}
                                                            onChange={(e) => handleTotalChange('totalSectionBgEnabled', e.target.checked)}
                                                            className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                        />
                                                        <label htmlFor="totalSectionBgEnabled" className="text-xs font-medium text-gray-700">
                                                            Background Colour
                                                        </label>
                                                    </div>
                                                    {templateConfig.total?.totalSectionBgEnabled && (
                                                        <div className="flex gap-2">
                                                            <input
                                                                type="color"
                                                                value={templateConfig.total?.totalSectionBgColor || '#ffffff'}
                                                                onChange={(e) => handleTotalChange('totalSectionBgColor', e.target.value)}
                                                                className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={templateConfig.total?.totalSectionBgColor || '#ffffff'}
                                                                onChange={(e) => handleTotalChange('totalSectionBgColor', e.target.value)}
                                                                className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                                placeholder="#ffffff"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Balance Due Section */}
                                            <div className="space-y-3">
                                                <h3 className="text-sm font-semibold text-gray-800">Balance Due</h3>

                                                {/* Font Size */}
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        Font Size
                                                    </label>
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="number"
                                                            min="8"
                                                            max="20"
                                                            value={templateConfig.total?.balanceDueFontSize || 12}
                                                            onChange={(e) => handleTotalChange('balanceDueFontSize', parseInt(e.target.value))}
                                                            className="w-20 px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                        />
                                                        <span className="text-sm text-gray-500">pt</span>
                                                    </div>
                                                </div>

                                                {/* Font Colour */}
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        Font Colour
                                                    </label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="color"
                                                            value={templateConfig.total?.balanceDueFontColor || '#000000'}
                                                            onChange={(e) => handleTotalChange('balanceDueFontColor', e.target.value)}
                                                            className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={templateConfig.total?.balanceDueFontColor || '#000000'}
                                                            onChange={(e) => handleTotalChange('balanceDueFontColor', e.target.value)}
                                                            className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                            placeholder="#000000"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Background Colour */}
                                                <div>
                                                    <div className="flex items-center mb-2">
                                                        <input
                                                            type="checkbox"
                                                            id="balanceDueBgEnabled"
                                                            checked={templateConfig.total?.balanceDueBgEnabled ?? false}
                                                            onChange={(e) => handleTotalChange('balanceDueBgEnabled', e.target.checked)}
                                                            className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                        />
                                                        <label htmlFor="balanceDueBgEnabled" className="text-xs font-medium text-gray-700">
                                                            Background Colour
                                                        </label>
                                                    </div>
                                                    {templateConfig.total?.balanceDueBgEnabled && (
                                                        <div className="flex gap-2">
                                                            <input
                                                                type="color"
                                                                value={templateConfig.total?.balanceDueBgColor || '#f7f8f5'}
                                                                onChange={(e) => handleTotalChange('balanceDueBgColor', e.target.value)}
                                                                className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={templateConfig.total?.balanceDueBgColor || '#f7f8f5'}
                                                                onChange={(e) => handleTotalChange('balanceDueBgColor', e.target.value)}
                                                                className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                                placeholder="#f7f8f5"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Taxes Section */}
                        <div className="bg-white rounded-lg border border-gray-200">
                            <button
                                onClick={() => toggleSection('taxesSection')}
                                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
                            >
                                <span className="font-semibold text-gray-800">Taxes</span>
                                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${expandedSections.taxesSection ? 'rotate-180' : ''}`} />
                            </button>

                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSections.taxesSection ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="px-4 pb-4 space-y-3">
                                    {/* Show Tax Breakdown */}
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="showTaxBreakdown"
                                            checked={templateConfig.total?.showTaxBreakdown ?? false}
                                            onChange={(e) => handleTotalChange('showTaxBreakdown', e.target.checked)}
                                            className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor="showTaxBreakdown" className="text-sm text-gray-700">
                                            Show Tax Breakdown Table
                                        </label>
                                    </div>

                                    {/* Tax Breakdown Label */}
                                    {templateConfig.total?.showTaxBreakdown && (
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Tax Breakdown Label
                                            </label>
                                            <input
                                                type="text"
                                                value={templateConfig.total?.taxBreakdownLabel || 'Tax Breakdown'}
                                                onChange={(e) => handleTotalChange('taxBreakdownLabel', e.target.value)}
                                                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                placeholder="Tax Breakdown"
                                            />
                                        </div>
                                    )}

                                    {/* Show Tax Rate Column */}
                                    {templateConfig.total?.showTaxBreakdown && (
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="showTaxRate"
                                                checked={templateConfig.total?.showTaxRate ?? true}
                                                onChange={(e) => handleTotalChange('showTaxRate', e.target.checked)}
                                                className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <label htmlFor="showTaxRate" className="text-sm text-gray-700">
                                                Show Tax Rate Column
                                            </label>
                                        </div>
                                    )}

                                    {/* Show Taxable Amount Column */}
                                    {templateConfig.total?.showTaxBreakdown && (
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="showTaxableAmountInBreakdown"
                                                checked={templateConfig.total?.showTaxableAmountInBreakdown ?? true}
                                                onChange={(e) => handleTotalChange('showTaxableAmountInBreakdown', e.target.checked)}
                                                className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <label htmlFor="showTaxableAmountInBreakdown" className="text-sm text-gray-700">
                                                Show Taxable Amount Column
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Other Details Tab */}
                {activeTab === 'other' && (
                    <div className="p-4 space-y-4">
                        {/* Document Summary Section */}
                        <div className="bg-white rounded-lg border border-gray-200">
                            <button
                                onClick={() => toggleSection('documentSummary')}
                                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
                            >
                                <span className="font-semibold text-gray-800">Document Summary</span>
                                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${expandedSections.documentSummary ? 'rotate-180' : ''}`} />
                            </button>

                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSections.documentSummary ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="px-4 pb-4 space-y-4">
                                    {/* Notes Subsection */}
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-semibold text-gray-800">Notes</h4>

                                        {/* Label */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Label
                                            </label>
                                            <input
                                                type="text"
                                                value={templateConfig.otherDetails?.notesLabel || 'Notes'}
                                                onChange={(e) => handleOtherDetailsChange('notesLabel', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        {/* Font Size */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Font Size
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    min="6"
                                                    max="14"
                                                    value={templateConfig.otherDetails?.notesFontSize || 8}
                                                    onChange={(e) => handleOtherDetailsChange('notesFontSize', parseInt(e.target.value))}
                                                    className="w-20 px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-gray-500">pt</span>
                                            </div>
                                        </div>

                                        {/* Add Bank Details Button (Non-functional) */}
                                        <button
                                            className="w-full px-4 py-2 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition flex items-center justify-center gap-2"
                                            disabled
                                        >
                                            <Settings className="w-4 h-4" />
                                            Add your bank details
                                        </button>
                                    </div>

                                    {/* Terms & Conditions Subsection */}
                                    <div className="space-y-3 pt-4 border-t border-gray-200">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="showTerms"
                                                checked={templateConfig.otherDetails?.showTerms ?? true}
                                                onChange={(e) => handleOtherDetailsChange('showTerms', e.target.checked)}
                                                className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <label htmlFor="showTerms" className="text-sm font-semibold text-gray-800">
                                                Terms & Conditions
                                            </label>
                                        </div>

                                        {/* Label */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Label
                                            </label>
                                            <input
                                                type="text"
                                                value={templateConfig.otherDetails?.termsLabel || 'Terms & Conditions'}
                                                onChange={(e) => handleOtherDetailsChange('termsLabel', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        {/* Font Size */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Font Size
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    min="6"
                                                    max="14"
                                                    value={templateConfig.otherDetails?.termsFontSize || 8}
                                                    onChange={(e) => handleOtherDetailsChange('termsFontSize', parseInt(e.target.value))}
                                                    className="w-20 px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-gray-500">pt</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Signature Subsection */}
                                    <div className="space-y-3 pt-4 border-t border-gray-200">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="showSignature"
                                                checked={templateConfig.otherDetails?.showSignature ?? false}
                                                onChange={(e) => handleOtherDetailsChange('showSignature', e.target.checked)}
                                                className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <label htmlFor="showSignature" className="text-sm font-semibold text-gray-800">
                                                Signature
                                            </label>
                                        </div>

                                        {templateConfig.otherDetails?.showSignature && (
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    Label
                                                </label>
                                                <input
                                                    type="text"
                                                    value={templateConfig.otherDetails?.signatureLabel || 'Authorized Signature'}
                                                    onChange={(e) => handleOtherDetailsChange('signatureLabel', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Annexure Section */}
                        <div className="bg-white rounded-lg border border-gray-200">
                            <button
                                onClick={() => toggleSection('annexure')}
                                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
                            >
                                <span className="font-semibold text-gray-800">Annexure</span>
                                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${expandedSections.annexure ? 'rotate-180' : ''}`} />
                            </button>

                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSections.annexure ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="px-4 pb-4 space-y-3">
                                    <p className="text-xs text-gray-600 leading-relaxed">
                                        Click <strong>Add Annexure Content</strong> to enter additional information apart from your Terms & Conditions. It can include by-laws, clauses and other details pertaining to your organization. This will be included on a separate page at the end of every Quote.
                                    </p>

                                    {/* Add Annexure Content Button (Non-functional) */}
                                    <button
                                        className="w-full px-4 py-2 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition flex items-center justify-center gap-2"
                                        disabled
                                    >
                                        <Settings className="w-4 h-4" />
                                        Add Annexure Content
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Other tabs content */}
                {activeTab !== 'general' && activeTab !== 'header' && activeTab !== 'transaction' && activeTab !== 'table' && activeTab !== 'total' && activeTab !== 'other' && (
                    <div className="p-4">
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <p className="text-sm text-gray-500">
                                {tabs.find(t => t.id === activeTab)?.label.replace('\n', ' ')} settings coming soon...
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Header Content Modal */}
            <HeaderContentModal
                isOpen={isHeaderModalOpen}
                onClose={() => setIsHeaderModalOpen(false)}
                initialContent={templateConfig.header?.customContent || ''}
                onSave={(content) => {
                    onConfigChange({
                        ...templateConfig,
                        header: {
                            ...templateConfig.header,
                            customContent: content
                        }
                    });
                }}
                onPreview={(content) => {
                    // Apply content for preview - update both customContent and enableCustomContent in a single state update
                    onConfigChange({
                        ...templateConfig,
                        header: {
                            ...templateConfig.header,
                            customContent: content,
                            enableCustomContent: true
                        }
                    });
                }}
            />

            {/* Footer Content Modal */}
            <FooterContentModal
                isOpen={isFooterModalOpen}
                onClose={() => setIsFooterModalOpen(false)}
                initialContent={templateConfig.footer?.customContent || ''}
                onSave={(content) => {
                    onConfigChange({
                        ...templateConfig,
                        footer: {
                            ...templateConfig.footer,
                            customContent: content
                        }
                    });
                }}
                onPreview={(content) => {
                    // Apply content for preview - update both customContent and enableCustomContent in a single state update
                    onConfigChange({
                        ...templateConfig,
                        footer: {
                            ...templateConfig.footer,
                            customContent: content,
                            enableCustomContent: true
                        }
                    });
                }}
            />

            {/* Attention Content Modal */}
            <AttentionContentModal
                isOpen={isAttentionModalOpen}
                onClose={() => setIsAttentionModalOpen(false)}
                initialContent={templateConfig.transactionDetails?.attentionContent || ''}
                onSave={(content) => {
                    onConfigChange({
                        ...templateConfig,
                        transactionDetails: {
                            ...templateConfig.transactionDetails,
                            attentionContent: content,
                            showAttentionContent: true
                        }
                    });
                }}
            />

            {/* Item Description Modal */}
            <ItemDescriptionModal
                isOpen={isItemModalOpen}
                onClose={() => setIsItemModalOpen(false)}
                initialContent={templateConfig.table?.itemTemplate?.content || ''}
                onSave={(content) => {
                    onConfigChange({
                        ...templateConfig,
                        table: {
                            ...templateConfig.table,
                            itemTemplate: {
                                ...templateConfig.table?.itemTemplate,
                                content: content
                            }
                        }
                    });
                }}
                onPreview={(content) => {
                    onConfigChange({
                        ...templateConfig,
                        table: {
                            ...templateConfig.table,
                            itemTemplate: {
                                enabled: true,
                                content: content
                            }
                        }
                    });
                }}
            />
        </div>
    );
};

export default TemplateEditorSidebar;
