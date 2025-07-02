"use client";

import React, { useState } from "react";
import { IconX, IconSparkles } from "@tabler/icons-react";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan?: string;
}

export default function OnboardingModal({ isOpen, onClose, selectedPlan }: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    niche: '',
    tiktokLink: '',
    instagramLink: '',
    objective: '',
    plan: selectedPlan || 'STARTER'
  });

  const niches = [
    'Music & Entertainment',
    'Gaming & Tech',
    'Lifestyle & Fashion',
    'Business & Finance',
    'Fitness & Health',
    'Food & Travel',
    'Comedy & Memes',
    'Education & DIY',
    'Other'
  ];

  const objectives = [
    'Gain more followers',
    'Increase brand awareness',
    'Drive sales/conversions',
    'Go viral consistently',
    'Build personal brand',
    'Promote my business'
  ];

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleSubmit = () => {
    // Ici on redirigerait vers Stripe ou traiterait le paiement
    console.log('Form submitted:', formData);
    alert('Redirecting to secure payment...');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <IconX size={24} />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconSparkles className="text-purple-600" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Get Started in 60 Seconds</h2>
          <p className="text-gray-600 mt-2">Tell us about your content goals</p>
        </div>

        {/* Progress bar */}
        <div className="flex mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1">
              <div className={`h-2 rounded-full ${step >= i ? 'bg-purple-600' : 'bg-gray-200'}`} />
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What's your niche?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {niches.map((niche) => (
                  <button
                    key={niche}
                    onClick={() => setFormData({...formData, niche})}
                    className={`p-3 text-sm rounded-lg border transition-colors ${
                      formData.niche === niche 
                        ? 'border-purple-600 bg-purple-50 text-purple-700' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {niche}
                  </button>
                ))}
              </div>
            </div>
            
            <button 
              onClick={handleNext}
              disabled={!formData.niche}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                TikTok Profile (optional)
              </label>
              <input
                type="url"
                placeholder="https://tiktok.com/@username"
                value={formData.tiktokLink}
                onChange={(e) => setFormData({...formData, tiktokLink: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram Profile (optional)
              </label>
              <input
                type="url"
                placeholder="https://instagram.com/username"
                value={formData.instagramLink}
                onChange={(e) => setFormData({...formData, instagramLink: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>
            
            <button 
              onClick={handleNext}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700"
            >
              Continue
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What's your main objective?
              </label>
              <div className="space-y-2">
                {objectives.map((objective) => (
                  <button
                    key={objective}
                    onClick={() => setFormData({...formData, objective})}
                    className={`w-full p-3 text-left rounded-lg border transition-colors ${
                      formData.objective === objective 
                        ? 'border-purple-600 bg-purple-50 text-purple-700' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {objective}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Selected Plan:</p>
              <p className="font-semibold text-gray-900">{formData.plan}</p>
            </div>
            
            <button 
              onClick={handleSubmit}
              disabled={!formData.objective}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Proceed to Payment →
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 