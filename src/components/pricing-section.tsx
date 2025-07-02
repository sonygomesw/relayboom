"use client";

import React, { useState } from "react";
import { IconCheck, IconRocket } from "@tabler/icons-react";
import OnboardingModal from "@/components/onboarding-modal";

export default function PricingSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [isAnnual, setIsAnnual] = useState(false);

  const handleGetStarted = (planName: string) => {
    setSelectedPlan(planName);
    setIsModalOpen(true);
  };

  const plans = [
    {
      name: "STARTER",
      price: "€349",
      priceAnnual: "€279",
      period: "/month",
      periodAnnual: "/month (billed annually)",
      description: "Ideal for: New creators, small businesses, service testing",
      features: [
        "60 posts/month on our active accounts",
        "3 platforms: TikTok + Instagram Reels + YouTube Shorts", 
        "Optimized hashtags for your niche",
        "Publishing at peak hours",
        "Monthly report: basic statistics",
        "Standard email support"
      ],
      popular: false,
      buttonText: "Get started",
      buttonStyle: "bg-gray-900 text-white hover:bg-gray-800"
    },
    {
      name: "ESSENTIAL", 
      price: "€799",
      priceAnnual: "€639",
      period: "/month",
      periodAnnual: "/month (billed annually)",
      description: "Ideal for: Creators with 10K-100K followers who want to boost their visibility",
      features: [
        "150 posts/month across our premium accounts",
        "3 platforms: TikTok + Instagram Reels + YouTube Shorts",
        "Trending and viral hashtag optimization", 
        "Peak hour publishing schedule",
        "Detailed monthly report: views, likes, shares, growth",
        "Priority email support within 24h"
      ],
      popular: true,
      buttonText: "Get started", 
      buttonStyle: "bg-gray-900 text-white hover:bg-gray-800"
    },
    {
      name: "PROFESSIONAL",
      price: "€1,999",
      priceAnnual: "€1,599", 
      period: "/month",
      periodAnnual: "/month (billed annually)",
      description: "Ideal for: Established influencers, independent artists, medium brands",
      features: [
        "300 posts/month (doubled)",
        "Dedicated personal manager with direct WhatsApp contact", 
        "Advanced cross-platform distribution: perfect timing coordination",
        "Content optimization: personalized advice on what to post",
        "Weekly report with insights and action plan",
        "Performance guarantee: +100% views or 1 month refunded",
        "Priority access to new features",
        "Priority support: response within 2h on weekdays"
      ],
      popular: false,
      buttonText: "Get started",
      buttonStyle: "bg-gray-900 text-white hover:bg-gray-800"
    },
    {
      name: "BRAND BOOSTER",
      price: "€4,999",
      priceAnnual: "€3,999",
      period: "/month",
      periodAnnual: "/month (billed annually)",
      description: "Ideal for: Growing brands, established companies, marketing agencies",
              features: [
          "600 posts/month across premium business accounts",
          "Professional brand content creation: 15 videos/month",
          "Custom B2B growth strategy: personalized by our experts",
          "Premium distribution network: high-authority business accounts",
          "Multi-channel campaign orchestration: coordinated launches",
          "Dedicated account manager: 24/7 direct WhatsApp line",
          "Monthly strategy consultation: 1h call with growth director",
          "Business network access: partnerships & collaboration opportunities"
        ],
      popular: false,
      buttonText: "Get started",
      buttonStyle: "bg-gray-900 text-white hover:bg-gray-800",
      premium: true
    },
    {
      name: "GROWTH ENGINE",
      price: "€12,999",
      priceAnnual: "€10,399",
      period: "/month",
      periodAnnual: "/month (billed annually)",
      description: "Enterprise solution for market domination",
              features: [
          "1200 posts/month (enterprise-level volume)",
          "Dedicated growth team: 5 specialists assigned to your brand",
          "Omnichannel domination: TikTok, Instagram, YouTube, LinkedIn",
          "Custom enterprise dashboard: real-time analytics & ROI tracking",
          "White-label solutions: co-branded content distribution",
          "Executive reporting: monthly C-suite presentations",
          "Market intelligence: competitor analysis & trend forecasting",
          "Priority feature access: beta testing new growth tools"
        ],
      popular: false,
      buttonText: "Contact Us",
      buttonStyle: "bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-500 hover:to-orange-600",
      premium: true
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          {/* Promesse business très visible */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-8 rounded-2xl inline-block mb-8 shadow-lg">
            <p className="text-xl md:text-2xl font-bold flex items-center justify-center gap-3">
              <IconRocket className="w-7 h-7" />
              Turn TikTok into a growth machine for your brand
            </p>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Turn TikTok into a growth machine for your brand.
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Choose the perfect plan for virality, visibility & volume — done for you.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-10">
          <div className="bg-gray-100 rounded-full p-1 flex">
            <button 
              onClick={() => setIsAnnual(false)}
              className={`px-8 py-2 rounded-full text-sm font-medium transition-colors ${
                !isAnnual 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setIsAnnual(true)}
              className={`px-8 py-2 rounded-full text-sm font-medium transition-colors ${
                isAnnual 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annual (save 20%)
            </button>
          </div>
        </div>

        {/* Standard Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          {plans.filter(plan => !plan.premium).map((plan, index) => (
            <div
              key={plan.name}
              className={`bg-white rounded-2xl border transition-all duration-300 hover:shadow-lg ${
                plan.popular 
                  ? 'border-purple-200 shadow-lg relative' 
                  : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-xs font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="p-8">
                {/* Header */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline mb-4">
                    <span className="text-4xl font-bold text-gray-900">
                      {isAnnual ? plan.priceAnnual : plan.price}
                    </span>
                    <span className="text-gray-500 ml-1">
                      {isAnnual ? plan.periodAnnual : plan.period}
                    </span>
                  </div>
                  {isAnnual && (
                    <div className="mb-2">
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                        Save 20% annually
                      </span>
                    </div>
                  )}
                  <p className="text-gray-600 text-sm leading-relaxed">{plan.description}</p>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <IconCheck size={16} className="text-gray-900 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Button */}
                <button 
                  onClick={() => handleGetStarted(plan.name)}
                  className={`w-full py-3 px-6 rounded-lg font-medium text-sm transition-colors ${plan.buttonStyle}`}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Premium Plans Row */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.filter(plan => plan.premium).map((plan, index) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl shadow-2xl p-8 border transition-all duration-300 hover:shadow-3xl ${
                plan.name === 'BRAND BOOSTER' 
                  ? 'bg-gradient-to-br from-purple-600 to-purple-700 border-purple-400'
                  : 'bg-gradient-to-br from-blue-600 to-blue-700 border-blue-500'
              }`}
            >
              <div className="text-center mb-6">
                <h3 className="text-3xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-center justify-center mb-3">
                  <span className="text-5xl font-bold text-white">
                    {isAnnual ? plan.priceAnnual : plan.price}
                  </span>
                  <span className="text-gray-300 ml-2">
                    {isAnnual ? plan.periodAnnual : plan.period}
                  </span>
                </div>
                {isAnnual && (
                  <div className="mb-3">
                    <span className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                      SAVE 20% ANNUALLY
                    </span>
                  </div>
                )}
                <p className="text-gray-300">{plan.description}</p>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start">
                    <IconCheck size={16} className="text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-200 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => plan.name === 'GROWTH ENGINE' ? alert('Contact us for custom pricing') : handleGetStarted(plan.name)}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${plan.buttonStyle}`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Bottom text */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Need a custom solution? We create tailored strategies for unique requirements.
          </p>
        </div>
      </div>

      <OnboardingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        selectedPlan={selectedPlan}
      />
    </section>
  );
} 