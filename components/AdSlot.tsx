
import React, { useEffect, useRef } from 'react';

interface AdSlotProps {
  adCode?: string;
  className?: string;
}

const AdSlot: React.FC<AdSlotProps> = ({ adCode, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adCode && containerRef.current) {
      containerRef.current.innerHTML = adCode;
      // Explicitly cast to HTMLScriptElement array to fix 'unknown' type errors
      const scripts = Array.from(containerRef.current.getElementsByTagName('script')) as HTMLScriptElement[];
      scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        // Copy all attributes from the old script to the new one
        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
        // Copy the script content
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        // Replace the old script with the new one to trigger execution
        oldScript.parentNode?.replaceChild(newScript, oldScript);
      });
    }
  }, [adCode]);

  if (!adCode) return null;

  return (
    <div 
      ref={containerRef} 
      className={`my-6 flex justify-center min-h-[50px] overflow-hidden ${className || ''}`}
    />
  );
};

export default AdSlot;
