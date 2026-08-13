import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, BookOpen, AlertCircle, Building, CheckCircle2 } from 'lucide-react';
import * as authService from '../services/authService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    studentId: '',
    department: '',
    year: '1',
    phone: '',
    termsAccepted: false
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms';
    
    if (formData.role === 'student') {
      if (!formData.studentId.trim()) newErrors.studentId = 'Student ID is required';
      if (!formData.department) newErrors.department = 'Department is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await register(formData);
      toast.success('Account created successfully!');
      if (formData.role === 'admin' || formData.role === 'faculty' || formData.role === 'coordinator') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setErrors({ form: msg });
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl -z-10"></div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 text-center mb-8">
        <Link to="/" className="inline-block text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400 mb-2">
          Campus Connect
        </Link>
        <h2 className="text-3xl font-bold text-white">Create your account</h2>
        <p className="mt-2 text-sm text-slate-400">Join the campus community today</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl z-10">
        <div className="bg-slate-900/80 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-3xl sm:px-10 border border-slate-800">
          
          {errors.form && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
              <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={18} />
              <p className="text-red-400 text-sm">{errors.form}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Role Selection */}
            <div className="flex gap-4 p-1 bg-slate-950 rounded-xl border border-slate-800">
              {['student', 'faculty', 'coordinator'].map(role => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role }))}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg capitalize transition-colors ${formData.role === role ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  {role}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Common Fields */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-slate-500" />
                  </div>
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2.5 bg-slate-950 border ${errors.name ? 'border-red-500' : 'border-slate-800'} rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={16} className="text-slate-500" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2.5 bg-slate-950 border ${errors.email ? 'border-red-500' : 'border-slate-800'} rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500`}
                    placeholder="john@college.edu"
                  />
                </div>
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={16} className="text-slate-500" />
                  </div>
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2.5 bg-slate-950 border ${errors.password ? 'border-red-500' : 'border-slate-800'} rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CheckCircle2 size={16} className="text-slate-500" />
                  </div>
                  <input
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2.5 bg-slate-950 border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-800'} rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
              
              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium text-slate-300">Phone Number (Optional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={16} className="text-slate-500" />
                  </div>
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              {/* Student Only Fields */}
              {formData.role === 'student' && (
                <>
                  <div className="space-y-1 md:col-span-2 pt-4 border-t border-slate-800">
                    <h3 className="text-lg font-medium text-white mb-2">Student Details</h3>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-300">Student ID / Roll No</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <BookOpen size={16} className="text-slate-500" />
                      </div>
                      <input
                        name="studentId"
                        type="text"
                        value={formData.studentId}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-3 py-2.5 bg-slate-950 border ${errors.studentId ? 'border-red-500' : 'border-slate-800'} rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500`}
                        placeholder="e.g. CS20B101"
                      />
                    </div>
                    {errors.studentId && <p className="text-red-400 text-xs mt-1">{errors.studentId}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-300">Department</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building size={16} className="text-slate-500" />
                      </div>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-3 py-2.5 bg-slate-950 border ${errors.department ? 'border-red-500' : 'border-slate-800'} rounded-xl text-white focus:outline-none focus:border-indigo-500 appearance-none`}
                      >
                        <option value="">Select Department</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Mechanical">Mechanical</option>
                        <option value="Civil">Civil</option>
                      </select>
                    </div>
                    {errors.department && <p className="text-red-400 text-xs mt-1">{errors.department}</p>}
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-sm font-medium text-slate-300">Year of Study</label>
                    <div className="flex gap-4">
                      {['1', '2', '3', '4'].map(yr => (
                        <label key={yr} className="flex items-center">
                          <input
                            type="radio"
                            name="year"
                            value={yr}
                            checked={formData.year === yr}
                            onChange={handleChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-700 bg-slate-950"
                          />
                          <span className="ml-2 text-sm text-slate-300">Year {yr}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="termsAccepted"
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-slate-950"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-slate-400">
                  I agree to the <a href="#" className="text-indigo-400 hover:underline">Terms of Service</a> and <a href="#" className="text-indigo-400 hover:underline">Privacy Policy</a>
                </label>
                {errors.termsAccepted && <p className="text-red-400 text-xs mt-1">{errors.termsAccepted}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300">
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
