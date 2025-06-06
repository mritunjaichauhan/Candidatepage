// Validation utilities for API endpoints
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Basic phone validation - adjust regex based on your requirements
  const phoneRegex = /^[\d\s\-\+\(\)]{10,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const generateUniqueCode = (name: string, timestamp?: number): string => {
  const namePrefix = name.replace(/\s+/g, '').substring(0, 3).toUpperCase();
  const ts = timestamp || Date.now();
  return `${namePrefix}${ts.toString().slice(-4)}`;
};

export const sanitizeString = (str: string): string => {
  return str.trim().replace(/\s+/g, ' ');
};

export const validateInfluencerData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('Name is required and must be a non-empty string');
  }

  if (!data.email || typeof data.email !== 'string' || !validateEmail(data.email)) {
    errors.push('Valid email address is required');
  }

  if (!data.phone || typeof data.phone !== 'string' || !validatePhone(data.phone)) {
    errors.push('Valid phone number is required');
  }

  if (data.unique_code && (typeof data.unique_code !== 'string' || data.unique_code.trim().length === 0)) {
    errors.push('Unique code must be a non-empty string if provided');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}; 