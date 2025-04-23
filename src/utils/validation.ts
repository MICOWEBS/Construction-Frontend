interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateEmail(email: string): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Please enter a valid email';
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return null;
}

export function validateName(name: string): string | null {
  if (!name) return 'Name is required';
  if (name.length < 2) return 'Name must be at least 2 characters';
  return null;
}

export function validateRole(role: string): string | null {
  if (!role) return 'Role is required';
  if (!['buyer', 'vendor', 'rider'].includes(role)) {
    return 'Please select a valid role';
  }
  return null;
}

export function validateProduct(data: {
  title: string;
  description: string;
  price: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.title) {
    errors.title = 'Title is required';
  } else if (data.title.length < 3) {
    errors.title = 'Title must be at least 3 characters';
  }

  if (!data.description) {
    errors.description = 'Description is required';
  } else if (data.description.length < 10) {
    errors.description = 'Description must be at least 10 characters';
  }

  if (!data.price) {
    errors.price = 'Price is required';
  } else {
    const price = parseFloat(data.price);
    if (isNaN(price)) {
      errors.price = 'Price must be a number';
    } else if (price <= 0) {
      errors.price = 'Price must be greater than 0';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateLoginForm(data: {
  email: string;
  password: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateRegisterForm(data: {
  name: string;
  email: string;
  password: string;
  role: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  const nameError = validateName(data.name);
  if (nameError) errors.name = nameError;

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;

  const roleError = validateRole(data.role);
  if (roleError) errors.role = roleError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
} 