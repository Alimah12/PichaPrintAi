'use client';

import { useState } from 'react';
import { HistoryItem, GenerationOutput } from '../types';

interface BuildOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentOutput: GenerationOutput | null;
}

declare global {
  interface Window {
    emailjs: any;
    ENV: {
      EMAILJS_PUBLIC_KEY: string;
      EMAILJS_SERVICE_ID: string;
      EMAILJS_TEMPLATE_ID: string;
      API_URL: string;
    };
  }
}

export default function BuildOrderModal({ isOpen, onClose, currentOutput }: BuildOrderModalProps) {
  const [formData, setFormData] = useState({
    from_name: '',
    customer_email: '',
    customer_phone: '',
    customer_location: '',
    preferred_contact: 'email',
    quantity: 1,
    special_requests: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Load EmailJS
  useState(() => {
    if (typeof window !== 'undefined' && window.ENV?.EMAILJS_PUBLIC_KEY && window.ENV.EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY_HERE') {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
      script.async = true;
      script.onload = () => {
        if (window.emailjs) {
          window.emailjs.init(window.ENV.EMAILJS_PUBLIC_KEY);
        }
      };
      document.body.appendChild(script);
    }
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (!window.emailjs) {
        throw new Error('EmailJS not loaded yet. Please try again.');
      }
      
      const baseUrl = window.ENV?.API_URL || process.env.NEXT_PUBLIC_API_URL;
      const files = (currentOutput?.downloads?.individual_files || {}) as Record<string, { url: string } | undefined>;
      
      const templateParams = {
        from_name: formData.from_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone || 'Not provided',
        customer_location: formData.customer_location || 'Not provided',
        preferred_contact: formData.preferred_contact,
        device_name: currentOutput?.device_name || 'Unnamed Device',
        quantity: formData.quantity,
        generated_at: new Date(currentOutput?.generated_at || Date.now()).toLocaleString(),
        special_requests: formData.special_requests || 'None',
        original_prompt: currentOutput?.original_prompt || 'No prompt available',
        stl_url: files.stl?.url ? (files.stl.url.startsWith('http') ? files.stl.url : `${baseUrl}${files.stl.url}`) : 'Not available',
        scad_url: files.scad?.url ? (files.scad.url.startsWith('http') ? files.scad.url : `${baseUrl}${files.scad.url}`) : 'Not available',
        circuit_url: files.circuit?.url ? (files.circuit.url.startsWith('http') ? files.circuit.url : `${baseUrl}${files.circuit.url}`) : 'Not available',
        firmware_url: files.firmware?.url ? (files.firmware.url.startsWith('http') ? files.firmware.url : `${baseUrl}${files.firmware.url}`) : 'Not available',
        bom_url: files.bom?.url ? (files.bom.url.startsWith('http') ? files.bom.url : `${baseUrl}${files.bom.url}`) : 'Not available',
        reply_to: formData.customer_email
      };
      
      await window.emailjs.send(
        window.ENV.EMAILJS_SERVICE_ID,
        window.ENV.EMAILJS_TEMPLATE_ID,
        templateParams
      );
      
      setSubmitSuccess(true);
      
      setTimeout(() => {
        setSubmitSuccess(false);
        onClose();
        setFormData({
          from_name: '',
          customer_email: '',
          customer_phone: '',
          customer_location: '',
          preferred_contact: 'email',
          quantity: 1,
          special_requests: ''
        });
      }, 2000);
      
    } catch (err) {
      console.error('Build order error:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit build order');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className={`fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-auto transform transition-all">
        {!submitSuccess ? (
          <>
            <div className="p-6 border-b border-white/20 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Build Your Device</h3>
                <p className="text-sm text-gray-500 mt-1">Submit order for hardware fulfillment</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-emerald-50 rounded-full transition-colors">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input 
                      type="text" 
                      required
                      value={formData.from_name}
                      onChange={(e) => setFormData({...formData, from_name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input 
                      type="email" 
                      required
                      value={formData.customer_email}
                      onChange={(e) => setFormData({...formData, customer_email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input 
                      type="tel"
                      value={formData.customer_phone}
                      onChange={(e) => setFormData({...formData, customer_phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm"
                      placeholder="+1 234 567 890"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input 
                      type="text"
                      value={formData.customer_location}
                      onChange={(e) => setFormData({...formData, customer_location: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm"
                      placeholder="City, Country"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Contact</label>
                    <select 
                      value={formData.preferred_contact}
                      onChange={(e) => setFormData({...formData, preferred_contact: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm"
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                    <input 
                      type="number"
                      min="1"
                      required
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
                  <textarea 
                    value={formData.special_requests}
                    onChange={(e) => setFormData({...formData, special_requests: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none text-sm"
                    placeholder="Any specific requirements, customization needs..."
                  />
                </div>
                
                <div className="bg-white/5 backdrop-blur-md rounded-lg p-4 text-xs text-gray-600 space-y-2 border border-white/20">
                  <p className="font-medium text-gray-900">Order Summary:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <span>Device:</span>
                    <span className="font-medium">{currentOutput?.device_name || 'Unnamed'}</span>
                    <span>Files included:</span>
                    <span>STL, SCAD, Circuit, Firmware, BOM</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/20">
                    <p className="font-medium text-gray-900 mb-2">Fulfillment Process:</p>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Once your STL design will be 3D printed, assembled, tested, and shipped to you within 72 hours.
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/20">
                    <p className="font-medium text-gray-900 mb-2">Pricing:</p>
                    <p className="text-lg font-bold text-emerald-600">
                      $0.15 USD per gram
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Final cost calculated based on material weight after printing.
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/20">
                    <p className="font-medium text-gray-900 mb-2">Download Files:</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (currentOutput?.stlData) {
                            const blob = new Blob([currentOutput.stlData], { type: 'application/sla' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `${currentOutput.device_name}.stl`;
                            a.click();
                            URL.revokeObjectURL(url);
                          }
                        }}
                        className="px-3 py-1.5 text-xs bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg hover:scale-105 transition-all shadow-lg shadow-emerald-500/25"
                      >
                        Download STL
                      </button>
                      <button
                        onClick={() => {
                          if (currentOutput?.scadContent) {
                            const blob = new Blob([currentOutput.scadContent], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `${currentOutput.device_name}.scad`;
                            a.click();
                            URL.revokeObjectURL(url);
                          }
                        }}
                        className="px-3 py-1.5 text-xs border border-gray-200 text-gray-700 rounded-lg hover:bg-emerald-50 transition-colors"
                      >
                        Download SCAD
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex gap-3">
                <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-emerald-50 transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg hover:scale-105 transition-all font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25"
                >
                  {isSubmitting ? (
                    <>
                      <div className="flex gap-1">
                        <span className="loading-dot w-1 h-1 bg-white rounded-full"></span>
                        <span className="loading-dot w-1 h-1 bg-white rounded-full"></span>
                        <span className="loading-dot w-1 h-1 bg-white rounded-full"></span>
                      </div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      Place Build Order
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-checkmark">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Order Submitted!</h3>
            <p className="text-gray-600 text-sm">We'll contact you shortly to confirm your build.</p>
          </div>
        )}
      </div>
    </div>
  );
}