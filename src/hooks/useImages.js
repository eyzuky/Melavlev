import { useState, useEffect } from 'react';
import { useLang } from '../context/LanguageContext';

let imagesCache = null;

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
    if (!entry || !entry.fileId) return null;
    return `/api/image?id=${entry.fileId}`;
  };

  const getAltText = (key) => {
    const entry = images[key];
    if (!entry) return '';
    return entry[lang] || entry.he || '';
  };

  return { getImageUrl, getAltText };
}
