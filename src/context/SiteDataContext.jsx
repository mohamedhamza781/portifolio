import React, { createContext, useContext, useEffect, useState } from 'react';
import { profileData as defaultProfile } from '../data/profile';
import { getProfile, getSettings } from '../services/portfolioService';

const defaultSettings = {
  navbar: { logo: '', logoFull: '', links: [] },
  hero: { greeting: '', roles: [], ctaPrimary: { label: '', href: '#projects' }, ctaSecondary: { label: '', href: '#contact' }, showSocials: true, showScrollIndicator: true },
  about: { sectionTitle: 'About Me', sectionSubtitle: 'Who I Am', highlights: [], availability: '', yearsOfExperience: '' },
  contact: {},
  footer: {},
};

const SiteDataContext = createContext({
  profile: defaultProfile,
  settings: defaultSettings,
  loading: true,
});

export const useSiteData = () => useContext(SiteDataContext);

/**
 * Fetches the Profile and Site Settings documents ONCE for the whole
 * public site and shares them via context. Previously Hero, About,
 * Contact, Footer, and Navbar each fetched both independently — up to 8
 * duplicate network requests per page load for identical data. This
 * provider cuts that down to exactly 2 requests, made once, on mount.
 */
export const SiteDataProvider = ({ children }) => {
  const [profile, setProfile] = useState(defaultProfile);
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([getProfile(), getSettings()]).then(([profileRes, settingsRes]) => {
      if (cancelled) return;
      if (profileRes.status === 'fulfilled' && profileRes.value.data) {
        setProfile(profileRes.value.data);
      }
      if (settingsRes.status === 'fulfilled' && settingsRes.value.data) {
        setSettings((prev) => ({ ...prev, ...settingsRes.value.data }));
      }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <SiteDataContext.Provider value={{ profile, settings, loading }}>
      {children}
    </SiteDataContext.Provider>
  );
};