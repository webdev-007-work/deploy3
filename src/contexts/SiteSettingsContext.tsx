
import React, { createContext, useContext, useEffect, useState } from "react";
import { getSiteSettings, SiteSettings } from "@/services/supabaseService";

interface SiteSettingsContextType {
  settings: SiteSettings | null;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(
  undefined
);

export function SiteSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSettings = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching site settings...");
      const data = await getSiteSettings();
      console.log("Site settings fetched:", data);
      setSettings(data);
    } catch (error) {
      console.error("Failed to fetch site settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  // Update document title when settings change
  useEffect(() => {
    if (settings) {
      // Update document title
      const title = `${settings.brand_name} - AI-Powered Blogging Platform | Latest Articles & Insights`;
      document.title = title;
    }
  }, [settings]);

  // Inject head and body scripts when settings change
  useEffect(() => {
    if (settings) {
      // Remove existing custom head scripts
      const existingHeadScripts = document.querySelectorAll('[data-custom-head-script]');
      existingHeadScripts.forEach(script => script.remove());

      // Remove existing custom body scripts
      const existingBodyScripts = document.querySelectorAll('[data-custom-body-script]');
      existingBodyScripts.forEach(script => script.remove());

      // Inject head scripts
      if (settings.head_scripts && settings.head_scripts.trim()) {
        console.log("Injecting head scripts:", settings.head_scripts);
        
        // Create a temporary div to parse HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = settings.head_scripts;
        
        // Insert all elements from head scripts into document head
        Array.from(tempDiv.children).forEach(element => {
          const clonedElement = element.cloneNode(true) as Element;
          clonedElement.setAttribute('data-custom-head-script', 'true');
          document.head.appendChild(clonedElement);
        });

        // Also handle text nodes (like scripts without tags)
        if (tempDiv.textContent && tempDiv.textContent.trim()) {
          const scriptElement = document.createElement('script');
          scriptElement.textContent = tempDiv.textContent;
          scriptElement.setAttribute('data-custom-head-script', 'true');
          document.head.appendChild(scriptElement);
        }
      }

      // Inject body scripts
      if (settings.body_scripts && settings.body_scripts.trim()) {
        console.log("Injecting body scripts:", settings.body_scripts);
        
        // Create a temporary div to parse HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = settings.body_scripts;
        
        // Insert all elements from body scripts into document body
        Array.from(tempDiv.children).forEach(element => {
          const clonedElement = element.cloneNode(true) as Element;
          clonedElement.setAttribute('data-custom-body-script', 'true');
          document.body.appendChild(clonedElement);
        });

        // Also handle text nodes (like scripts without tags)
        if (tempDiv.textContent && tempDiv.textContent.trim()) {
          const scriptElement = document.createElement('script');
          scriptElement.textContent = tempDiv.textContent;
          scriptElement.setAttribute('data-custom-body-script', 'true');
          document.body.appendChild(scriptElement);
        }
      }
    }
  }, [settings]);

  const contextValue = React.useMemo(
    () => ({
      settings,
      isLoading,
      refreshSettings,
    }),
    [settings, isLoading]
  );

  return (
    <SiteSettingsContext.Provider value={contextValue}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (context === undefined) {
    throw new Error(
      "useSiteSettings must be used within a SiteSettingsProvider"
    );
  }
  return context;
}
