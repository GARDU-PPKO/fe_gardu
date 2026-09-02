/**
 * Validator functions for forms in FE Gardu
 */

export interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

/**
 * Validasi Nama Lengkap
 */
export const validateFullName = (name: string, isRequired = true): ValidationResult => {
  const trimmed = (name || '').trim();
  if (!trimmed) {
    return {
      isValid: !isRequired,
      error: isRequired ? 'Nama lengkap wajib diisi' : null,
    };
  }
  if (trimmed.length < 3) {
    return {
      isValid: false,
      error: 'Nama lengkap minimal 3 karakter',
    };
  }
  if (trimmed.length > 100) {
    return {
      isValid: false,
      error: 'Nama lengkap maksimal 100 karakter',
    };
  }
  return { isValid: true, error: null };
};

/**
 * Validasi Nomor WhatsApp
 */
export const validatePhone = (phone: string, isRequired = true): ValidationResult => {
  const trimmed = (phone || '').trim();
  if (!trimmed) {
    return {
      isValid: !isRequired,
      error: isRequired ? 'Nomor WhatsApp wajib diisi' : null,
    };
  }

  // Cek apakah diawali 08, 628, atau +628
  const isValidPrefix = trimmed.startsWith('08') || trimmed.startsWith('628') || trimmed.startsWith('+628');
  if (!isValidPrefix) {
    return {
      isValid: false,
      error: 'Nomor WhatsApp harus diawali 08 (contoh: 081234567890)',
    };
  }

  // Hitung jumlah angka
  const digitsOnly = trimmed.replace(/\D/g, '');
  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    return {
      isValid: false,
      error: 'Nomor WhatsApp harus terdiri dari 10-15 digit',
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validasi Kontak Darurat (Nomor HP)
 */
export const validateEmergencyContact = (contact: string, isRequired = false): ValidationResult => {
  const trimmed = (contact || '').trim();
  if (!trimmed) {
    return {
      isValid: !isRequired,
      error: isRequired ? 'Kontak darurat wajib diisi' : null,
    };
  }

  const digitsOnly = trimmed.replace(/\D/g, '');
  const isValidPrefix = digitsOnly.startsWith('08') || digitsOnly.startsWith('628');
  if (!isValidPrefix) {
    return {
      isValid: false,
      error: 'Kontak darurat harus diawali 08 (contoh: 081234567890)',
    };
  }

  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    return {
      isValid: false,
      error: 'Kontak darurat harus terdiri dari 10-15 digit angka',
    };
  }

  return { isValid: true, error: null };
};

