export const SITE_CONFIG = {
  phone: {
    e164: '+233552989900',
    display: '+233 (0) 55 298 9900',
  },
  whatsappNumber: '233552989900',
  whatsappBaseUrl: 'https://wa.me/233552989900',
  email: 'info@dialatherapistgh.com',
  facebookUrl: 'https://facebook.com/DATGhana',
  instagramUrl: 'https://instagram.com/dialatherapistgh',
  address: 'Accra, Ghana',
  businessHours: {
    monToFri: '8:00 AM - 5:00 PM',
    saturday: '9:00 AM - 2:00 PM',
    sunday: 'Closed',
  },
} as const;

export type SiteConfig = typeof SITE_CONFIG;
