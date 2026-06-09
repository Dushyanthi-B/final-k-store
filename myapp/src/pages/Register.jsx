import React, { useState, useEffect } from 'react';
import '../styles/Register.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import API_URL from '../config/api';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    profile: '',
    gender: '',
    dateOfBirth: '',
    nationality: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [isValid, setIsValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (name === 'email') {
      const gmailRegex = /^[A-Za-z0-9._%+-]+@gmail\.com$/;
      setErrors((p) => ({
        ...p,
        email: gmailRegex.test(value) ? '' : 'Enter a valid Gmail address',
      }));
    }

    if (name === 'password') {
      const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      setErrors((p) => ({
        ...p,
        password: strong.test(value)
          ? ''
          : 'Min 8 chars, include upper, lower, number',
      }));
    }
  };

  useEffect(() => {
    const noErrors = !errors.email && !errors.password;
    const requiredOk =
      formData.username &&
      formData.email &&
      formData.password &&
      formData.gender &&
      formData.dateOfBirth &&
      formData.nationality;
    setIsValid(noErrors && requiredOk);
  }, [errors, formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/register`,
        formData
      );
      if (response.data?.token) {
        if (formData.rememberMe) {
          localStorage.setItem('token', response.data.token);
        } else {
          sessionStorage.setItem('token', response.data.token);
        }
      }
      alert('Registration successful! Please log in to continue.');
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="auth-stage">
      <div className="auth-card register-container">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            name="username"
            placeholder="Username"
            required
            className="form-field"
            value={formData.username}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="form-field"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <small style={{ color: '#d4380d' }}>{errors.email}</small>}

          <div className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              required
              className="form-field"
              value={formData.password}
              onChange={handleChange}
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>
          {errors.password && <small style={{ color: '#d4380d' }}>{errors.password}</small>}

          <input
            type="text"
            name="profile"
            placeholder="Profile Description"
            className="form-field"
            value={formData.profile}
            onChange={handleChange}
          />

          <select
            name="gender"
            value={formData.gender}
            className="form-field"
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="date"
            name="dateOfBirth"
            className="form-field"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="nationality"
            placeholder="Nationality"
            className="form-field"
            value={formData.nationality}
            onChange={handleChange}
            required
          />

          <div className="remember">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
            />
            <label>Remember Me</label>
          </div>

          <button className="btn btn-primary" type="submit" disabled={!isValid}>
            Register
          </button>
        </form>

        <div className="login-link">
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
          <p>
            <Link to="/">Go to Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
