import { useEffect } from 'react';

export interface PageSEOProps {
  title: string;
  description?: string;
  canonicalPath?: string;
}

export function usePageSEO({ title, description, canonicalPath }: PageSEOProps) {
  useEffect(() => {
    // Update document title
    const fullTitle = title.includes('Dial-A-Therapist Ghana')
      ? title
      : `${title} | Dial-A-Therapist Ghana`;
    document.title = fullTitle;

    // Update meta description
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);

      // Also update OG description
      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) {
        ogDesc.setAttribute('content', description);
      }
    }

    // Update OG title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', fullTitle);
    }

    // Optional canonical url
    if (canonicalPath) {
      let linkCanonical = document.querySelector('link[rel="canonical"]');
      if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.setAttribute('rel', 'canonical');
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.setAttribute('href', window.location.origin + canonicalPath);
    }
  }, [title, description, canonicalPath]);
}

export default usePageSEO;
