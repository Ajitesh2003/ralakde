// QuoteContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchDocumentData, TEMPLATES, updateLiveQuoteData } from './../Utils/API';

const QuoteContext = createContext(null);

export const useQuoteContext = () => useContext(QuoteContext);

export const QuoteProvider = ({ children }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES.SPREADSHEET);

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

    const value = {
        data,
        loading,
        selectedTemplate,
        setSelectedTemplate,
        updateQuoteData,
    };

    return (
        <QuoteContext.Provider value={value}>
            {children}
        </QuoteContext.Provider>
    );
};