"use client";
import { useEffect, useState } from "react";
import { SelectPicker } from "rsuite";
import { getCookie, hasCookie, setCookie } from 'cookies-next';

const languages = [
    {label: 'English', value:'/auto/en'},
    {label: 'हिन्दी', value:'/auto/hi'},
    {label: `Русский`, value:'/auto/ru'},
    {label: 'Polski', value:'/auto/pl'}
];

const TranslateProvider = ({ children }) => {
    const [selected, setSelected] = useState(null);
    const [scriptLoaded, setScriptLoaded] = useState(false);
    
    useEffect(() => {
        // Initialize with current cookie value or default to English
        if(hasCookie('googtrans')){
            setSelected(getCookie('googtrans'))
        }
        else{
            setCookie('googtrans', '/auto/en', { path: '/' });
            setSelected('/auto/en')
        }
        
        // Check if script is already loaded
        if (!scriptLoaded && !window.google?.translate) {
            const addScript = document.createElement('script');
            addScript.setAttribute('src', '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
            addScript.onload = () => {
                console.log("Google Translate script loaded");
                setScriptLoaded(true);
            };
            addScript.onerror = () => {
                console.error("Failed to load Google Translate script");
            };
            document.body.appendChild(addScript);
            
            // Define the callback function for Google Translate
            window.googleTranslateElementInit = () => {
                try {
                    new window.google.translate.TranslateElement({
                        pageLanguage: 'auto',
                        autoDisplay: false,
                        includedLanguages: "hi,ru,en,pl,mr",
                        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
                    }, 'google_translate_element');
                    console.log("Google Translate element initialized");
                } catch (err) {
                    console.error("Error initializing Google Translate:", err);
                }
            };
        }
    }, [scriptLoaded]);

    const langChange = (e, _, evt) => {
        if (!e) return;
        
        console.log("Language changed to:", e);
        evt.preventDefault();
        
        try {
            // Set both domain and path to ensure cookie is properly set
            const cookieOptions = { 
                path: '/',
                domain: window.location.hostname
            };
            
            // Set cookie with decodeURI to handle special characters
            setCookie('googtrans', decodeURI(e), cookieOptions);
            setSelected(e);
            
            // This additional cookie setting helps in some browsers
            document.cookie = `googtrans=${encodeURIComponent(e)}; path=/; domain=${window.location.hostname}`;
            document.cookie = `googtrans=${encodeURIComponent(e)}; path=/`;
            
            // Force reload to apply changes
            window.location.reload();
        } catch (err) {
            console.error("Error setting language cookie:", err);
        }
    }

    return (
        <>
            {/* Make sure this element exists for Google Translate to work with */}
            <div 
                id="google_translate_element" 
                style={{
                    width:'0px',
                    height:'0px',
                    position:'absolute',
                    left:'50%',
                    zIndex:-99999
                }}
            ></div>
            
            {/* Language selector */}
            <div 
                className="translate-picker-container" 
                style={{ 
                    position: 'absolute', 
                    top: '20px', 
                    right: '20px', 
                    zIndex: 1000,
                    backgroundColor: 'white',
                    padding: '5px',
                    borderRadius: '4px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }}
                onClick={(e) => e.stopPropagation()} // Prevent clicks from propagating
            >
                <SelectPicker 
                    data={languages} 
                    style={{ width: 120 }}  // Increased width for better visibility
                    placement="bottomEnd"
                    cleanable={false}
                    value={selected}
                    searchable={false}
                    className={'notranslate'}
                    menuClassName={'notranslate'}
                    onSelect={(value, item, event) => langChange(value, item, event)}
                    renderMenuItem={(label) => <div style={{padding: '5px'}}>{label}</div>}
                    placeholder="Language"
                /> 
            </div>
            
            {children}
        </>
    );
};

export default TranslateProvider;