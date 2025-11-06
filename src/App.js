// App.js

import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Import the Context Provider
import { QuoteProvider } from './App/Context.js/NewQuoteContext';

// Import the Screens/Views
import PdfViewerScreen from './App/Screens/PdfViewer'
import NewQuoteForm from './App/Screens/NewQuoteForm'; 
// Assuming NewQuoteForm is now used as a standalone screen/route

// --- Navigation Header/Links Component ---
const AppNavigation = () => (
    <nav className="bg-gray-800 p-4 shadow-lg w-full">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-white hover:text-blue-300 transition">
                Quote Manager
            </Link>
            <div className="space-x-4">
                <Link 
                    to="/new-quote" 
                    className="text-white hover:text-blue-400 font-medium transition px-3 py-1 border border-transparent hover:border-blue-400 rounded"
                >
                    + New Quote Form
                </Link>
                <Link 
                    to="/viewer" 
                    className="text-white hover:text-blue-400 font-medium transition px-3 py-1 border border-transparent hover:border-blue-400 rounded"
                >
                    PDF Viewer
                </Link>
            </div>
        </div>
    </nav>
);

// --- Main Application Component ---
const App = () => {
    
    // We can define a function here to handle navigation, which can be passed to the Form
    // If you need NewQuoteForm to automatically redirect after saving:
    // 1. Get the 'navigate' hook from 'react-router-dom' inside NewQuoteForm.js
    // 2. Call navigate('/viewer') after updateQuoteData() in NewQuoteForm.js

    return (
        <QuoteProvider>
            <Router>
                <div className="min-h-screen bg-gray-100 flex flex-col items-center">
                    
                    {/* Navigation Bar */}
                    <AppNavigation />

                    {/* Router Setup */}
                    <main className="flex-grow w-full flex justify-center p-4">
                        <Routes>
                            {/* Route 1: The Quote Input Form */}
                            <Route 
                                path="/new-quote" 
                                element={<NewQuoteForm />} // NewQuoteForm handles its own saving via context
                            />

                            {/* Route 2: The PDF Viewer Screen (This is the primary display) */}
                            <Route 
                                path="/viewer" 
                                element={<PdfViewerScreen />}
                            />

                            {/* Default Route: Redirect to the Viewer or Form */}
                            <Route 
                                path="/" 
                                element={<PdfViewerScreen />} // Shows viewer by default
                            />
                        </Routes>
                    </main>
                </div>
            </Router>
        </QuoteProvider>
    );
};

export default App;