import React from 'react';
import { RefreshCw, Save, X, ChevronDown, Menu } from 'lucide-react';

const TopActionBar = ({
    onSave,
    onRefresh,
    onClose,
    selectedTheme,
    onThemeChange,
    isSidebarOpen,
    onToggleSidebar,
    availableThemes = [
        { value: 'blue-800', label: 'Blue' },
        { value: 'green-700', label: 'Green' },
        { value: 'purple-800', label: 'Purple' },
        { value: 'red-700', label: 'Red' }
    ]
}) => {
    return (
        <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 z-50 print:hidden">
            {/* Left Side - Toggle Button & Title */}
            <div className="flex items-center space-x-4">
                <button
                    onClick={onToggleSidebar}
                    className="p-2 hover:bg-gray-100 rounded-md transition"
                    title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
                >
                    <Menu className="w-5 h-5 text-gray-700" />
                </button>
                <h1 className="text-lg font-semibold text-gray-800">Edit Template</h1>
            </div>

            {/* Right Side - Controls */}
            <div className="flex items-center space-x-3">
                {/* Theme Selector Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => {}}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition"
                    >
                        <span>Select Colour Theme</span>
                        <ChevronDown className="w-4 h-4" />
                    </button>
                    {/* Dropdown menu - can be expanded later with state */}
                    <select
                        value={selectedTheme}
                        onChange={(e) => onThemeChange(e.target.value)}
                        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    >
                        {availableThemes.map(theme => (
                            <option key={theme.value} value={theme.value}>
                                {theme.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Refresh Preview Button */}
                <button
                    onClick={onRefresh}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border border-gray-300 rounded-md transition"
                >
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh Preview</span>
                </button>

                {/* Save Button */}
                <button
                    onClick={onSave}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition"
                >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                </button>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="flex items-center justify-center w-8 h-8 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-md transition"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default TopActionBar;
