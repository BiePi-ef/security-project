
import { useState } from 'react';
import './Register.css';

export default function Register() {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');

  // Validation rules
  const validatePassword = (pwd: string): string[] => {
    const issues = [];
    if (pwd.length < 12) issues.push('Password must be at least 12 characters');
    if (!/[A-Z]/.test(pwd)) issues.push('Password must contain at least one uppercase letter');
    if (!/[a-z]/.test(pwd)) issues.push('Password must contain at least one lowercase letter');
    if (!/[0-9]/.test(pwd)) issues.push('Password must contain at least one number');
    if (!/[!@#$%^&*()_+\-=;:|,.<>?]/.test(pwd)) issues.push('Password must contain at least one special character');
    return issues;
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    // Validation
    if (!formData.userName.trim()) {
      newErrors.userName = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordIssues = validatePassword(formData.password);
      if (passwordIssues.length > 0) {
        newErrors.password = passwordIssues.join('; ');
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setApiError('');

    // tdo CORS compatible requests
    try {
      const response = await fetch('http://localhost:3001/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:5173'
        },
        body: JSON.stringify({
          userName: formData.userName,
          email: formData.email,
          password: formData.password,
          role: 'user',
        }),
        
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setApiError('Email already in use');
        } else if (data.message) {
          setApiError(data.message);
        } else {
          setApiError('Registration failed. Please try again.');
        }
        console.log(apiError)
        setLoading(false);
        return;
      }

      setSuccess(true);
      setFormData({ userName: '', email: '', password: '', confirmPassword: '' });
      setErrors({});

      // Redirect to login after 2 seconds
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>Create Account</h1>

        {success && (
          <div className="success-message">
            ✓ Registration successful! Redirecting to login...
          </div>
        )}

        {apiError && (
          <div className="error-message">
            ✗ {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="userName">Full Name</label>
            <input
              id="userName"
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder="John Doe"
            />
            {errors.userName && <span className="error">{errors.userName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••••••"
            />
            {errors.password && (
              <span className="error">{errors.password}</span>
            )}
            <div className="password-requirements">
              <p>Password must contain:</p>
              <ul>
                <li className={formData.password.length >= 12 ? 'valid' : ''}>
                  ✓ At least 12 characters
                </li>
                <li className={/[A-Z]/.test(formData.password) ? 'valid' : ''}>
                  ✓ At least one uppercase letter (A-Z)
                </li>
                <li className={/[a-z]/.test(formData.password) ? 'valid' : ''}>
                  ✓ At least one lowercase letter (a-z)
                </li>
                <li className={/[0-9]/.test(formData.password) ? 'valid' : ''}>
                  ✓ At least one number (0-9)
                </li>
                <li className={/[!@#$%^&*()_+\-=;:|,.<>?]/.test(formData.password) ? 'valid' : ''}>
                  ✓ At least one special character (!@#$%^&*...)
                </li>
              </ul>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••••••"
            />
            {errors.confirmPassword && (
              <span className="error">{errors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <div className="login-link">
          Already have an account? <a href="/login">Login here</a>
        </div>
      </div>
    </div>
  );
}