import React, { useState, useEffect } from 'react';

interface ServiceLogoProps {
  name: string;
  logo?: string;
  domain?: string;
  color: string;
  className?: string;
}

export const ServiceLogo: React.FC<ServiceLogoProps> = ({ name, logo, domain, color, className = "w-full h-full" }) => {
  // Stratégie de chargement d'image
  // 1. Logo direct fourni (Souvent un SVG de Simple Icons)
  // 2. Logo via Clearbit (Basé sur le domaine) - Très propre pour les entreprises
  // 3. Logo via Google Favicon (Basé sur le domaine) - Fallback fiable
  // 4. Initiales (Si rien n'est trouvé, pour éviter les faux positifs d'avatars Twitter)

  const [currentSrc, setCurrentSrc] = useState<string | null>(null);
  const [loadStage, setLoadStage] = useState<number>(0); // 0: Init, 1: Primary, 2: Secondary, 3: Fallback Text

  useEffect(() => {
    // Reset state when props change
    setLoadStage(0);
    
    if (logo && logo.length > 0) {
      // Si on a un logo explicite (SVG du preset), on l'utilise directement
      setCurrentSrc(logo);
      setLoadStage(1);
    } else if (domain) {
      // Si on a un domaine, on tente Clearbit en premier
      setCurrentSrc(`https://logo.clearbit.com/${domain}`);
      setLoadStage(1);
    } else {
      // Si on a rien (utilisateur a tapé un nom sans matcher un preset et sans domaine devinable)
      // On passe direct aux initiales pour éviter de chercher n'importe quoi sur le web
      setLoadStage(3);
    }
  }, [logo, domain, name]);

  const handleError = () => {
    if (loadStage === 1) {
      // Echec de la première tentative (ex: Clearbit n'a pas le logo)
      // On essaie Google Favicon en haute résolution si on a un domaine
      if (domain) {
        setCurrentSrc(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
        setLoadStage(2);
      } else {
        setLoadStage(3);
      }
    } else if (loadStage === 2) {
      // Echec de Google Favicon (rare mais possible) -> Initiales
      setLoadStage(3);
    }
  };

  // Rendu du Fallback (Initiales)
  if (loadStage === 3 || !currentSrc) {
    return (
      <div 
        className={`flex items-center justify-center font-bold text-white uppercase ${className}`}
        style={{ backgroundColor: color }}
      >
        {name ? name.substring(0, 2) : '?'}
      </div>
    );
  }

  return (
    <img 
      src={currentSrc} 
      alt={name} 
      className={`object-cover bg-white ${className}`}
      onError={handleError}
    />
  );
};