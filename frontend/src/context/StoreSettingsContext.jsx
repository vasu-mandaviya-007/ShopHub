import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoreSettings } from '../config/adminApi';
// import { getStoreSettings } from '../apis/adminApi'; // Tumhara API function


// 1. Context Create Kiya
const StoreSettingsContext = createContext();

// 2. Custom Hook banaya taaki components me use karna aasan ho
export const useStoreSettings = () => useContext(StoreSettingsContext);

export const StoreSettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(null);
    const [loadingSettings, setLoadingSettings] = useState(true);

    // Ye function DB se fresh settings layega
    const fetchSettings = async () => {
        setLoadingSettings(true);
        try {
            // const data = await getStoreSettings();
            // if (data.success && data.store) {
            //     setSettings(data.store);
            // }
        } catch (error) {
            console.error("Failed to fetch global store settings:", error);
        } finally {
            setLoadingSettings(false);
        }
    };

    // App load hote hi ek baar fetch call hogi
    useEffect(() => {
        fetchSettings();
    }, []);

    // 3. Provider return kiya jo pure app ko data dega
    return (
        <StoreSettingsContext.Provider value={{ settings, loadingSettings, refreshSettings: fetchSettings }}>
            {children}
        </StoreSettingsContext.Provider>
    );
};