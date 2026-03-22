import { useState, useEffect } from 'react';
import { useLang } from '../context/LanguageContext';

let imagesCache = null;

export function clearImagesCache() {
  imagesCache = null;
}

export function useImages() {
  const { lang } = useLang();
  const [images, setImages] = useState(imagesCache || {});

  useEffect(() => {
    if (imagesCache) return;
    fetch('/api/content?tab=images')
      .then(res => res.json())
      .then(data => { imagesCache = data; setImages(data); })
      .catch(() => {});
  }, []);

  const getImageUrl = (key) => {
    const entry = images[key];
    if (!entry) return null;
    // Direct URL from Vercel Blob (or any hosted URL)
    if (entry.url) return entry.url;
    // Legacy fallback: Google Drive proxy
    if (entry.fileId) return `/api/image?id=${entry.fileId}`;
    return null;
  };

  const getAltText = (key) => {
    const entry = images[key];
    if (!entry) return '';
    return entry[lang] || entry.he || '';
  };

  return { getImageUrl, getAltText };
}
