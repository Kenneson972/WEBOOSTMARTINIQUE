import React, { useState } from 'react';
import GradualBlur from './GradualBlur';

const LiquidGlassDemo = () => {
  const [activeTab, setActiveTab] = useState('features');

  const features = [
    {
      title: "Fluid Interactions",
      description: "Smooth, liquid-like animations that respond to user interactions",
      icon: "🌊"
    },
    {
      title: "Glass Morphism",
      description: "Modern glassmorphism design with blur effects and transparency",
      icon: "💎"
    },
    {
      title: "Dynamic Backgrounds",
      description: "Interactive liquid backgrounds that adapt to user movement",
      icon: "✨"
    },
    {
      title: "Responsive Design",
      description: "Seamless experience across all devices and screen sizes",
      icon: "📱"
    }
  ];

  const stats = [
    { label: "Performance", value: "99.9%", color: "from-green-400 to-emerald-400" },
    { label: "User Experience", value: "A+", color: "from-blue-400 to-cyan-400" },
    { label: "Innovation", value: "100%", color: "from-purple-400 to-pink-400" },
    { label: "Satisfaction", value: "5★", color: "from-yellow-400 to-orange-400" }
  ];

  return (
    <div className="relative z-10 min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="glass-card backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl mb-8">
            <h2 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Liquid Glass Experience
            </h2>
            <p className="text-white/80 text-xl max-w-3xl mx-auto">
              Immerse yourself in the future of web design with our revolutionary liquid glass theme
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-12">
          <div className="glass-card backdrop-blur-lg bg-white/10 border border-white/20 rounded-full p-2 shadow-2xl">
            <button
              onClick={() => setActiveTab('features')}
              className={`px-6 py-3 rounded-full transition-all duration-300 ${
                activeTab === 'features'
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Features
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-6 py-3 rounded-full transition-all duration-300 ${
                activeTab === 'stats'
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Statistics
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-6 py-3 rounded-full transition-all duration-300 ${
                activeTab === 'gallery'
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Gallery
            </button>
            <button
              onClick={() => setActiveTab('blur')}
              className={`px-6 py-3 rounded-full transition-all duration-300 ${
                activeTab === 'blur'
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Blur Effects
            </button>
          </div>
        </div>

        {/* Content Sections */}
        {activeTab === 'features' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-card backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl hover:scale-105 transition-all duration-300 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="glass-card backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl text-center hover:scale-105 transition-all duration-300"
              >
                <div className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                  {stat.value}
                </div>
                <div className="text-white/80 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="glass-card backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl hover:scale-105 transition-all duration-300 group"
              >
                <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl mb-4 flex items-center justify-center">
                  <div className="text-6xl opacity-50 group-hover:opacity-80 transition-opacity duration-300">
                    {item === 1 ? '🎨' : item === 2 ? '🚀' : item === 3 ? '💫' : item === 4 ? '🌟' : item === 5 ? '🎭' : '🎪'}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Liquid Glass Element {item}
                </h3>
                <p className="text-white/70 text-sm">
                  Experience the magic of liquid glass design
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'blur' && (
          <div className="space-y-8 mb-12">
            {/* Blur Demo Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Bottom Blur Demo */}
              <div className="glass-card backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                <h3 className="text-xl font-bold text-white mb-4">Bottom Gradual Blur</h3>
                <div className="h-48 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-lg mb-4 flex items-center justify-center">
                  <p className="text-white/80 text-center">
                    Content with bottom blur effect
                  </p>
                </div>
                <GradualBlur
                  target="parent"
                  position="bottom"
                  height="3rem"
                  strength={2.5}
                  divCount={5}
                  curve="bezier"
                  exponential={true}
                  opacity={0.9}
                />
              </div>

              {/* Top Blur Demo */}
              <div className="glass-card backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                <h3 className="text-xl font-bold text-white mb-4">Top Gradual Blur</h3>
                <div className="h-48 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-lg mb-4 flex items-center justify-center">
                  <p className="text-white/80 text-center">
                    Content with top blur effect
                  </p>
                </div>
                <GradualBlur
                  target="parent"
                  position="top"
                  height="3rem"
                  strength={2.5}
                  divCount={5}
                  curve="ease-out"
                  exponential={false}
                  opacity={0.9}
                />
              </div>
            </div>

            {/* Full Width Blur Demo */}
            <div className="glass-card backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
              <h3 className="text-xl font-bold text-white mb-4">Multi-Direction Blur</h3>
              <div className="h-64 bg-gradient-to-r from-green-500/30 via-yellow-500/30 to-red-500/30 rounded-lg flex items-center justify-center relative">
                <p className="text-white/80 text-center z-10">
                  Content with blur effects on all sides
                </p>
                <GradualBlur
                  target="parent"
                  position="top"
                  height="2rem"
                  strength={2}
                  divCount={4}
                  curve="linear"
                  opacity={0.8}
                />
                <GradualBlur
                  target="parent"
                  position="bottom"
                  height="2rem"
                  strength={2}
                  divCount={4}
                  curve="linear"
                  opacity={0.8}
                />
                <GradualBlur
                  target="parent"
                  position="left"
                  height="2rem"
                  strength={1.5}
                  divCount={3}
                  curve="ease-in"
                  opacity={0.7}
                />
                <GradualBlur
                  target="parent"
                  position="right"
                  height="2rem"
                  strength={1.5}
                  divCount={3}
                  curve="ease-in"
                  opacity={0.7}
                />
              </div>
            </div>

            {/* Blur Presets Demo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['subtle', 'intense', 'smooth'].map((preset) => (
                <div key={preset} className="glass-card backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-4 shadow-2xl relative overflow-hidden">
                  <h4 className="text-lg font-bold text-white mb-3 capitalize">{preset} Preset</h4>
                  <div className="h-32 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-lg flex items-center justify-center">
                    <p className="text-white/80 text-sm text-center">
                      {preset} blur effect
                    </p>
                  </div>
                  <GradualBlur
                    target="parent"
                    position="bottom"
                    preset={preset}
                    className="gradual-blur-preset"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center">
          <div className="glass-card backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Experience Liquid Glass?
            </h3>
            <p className="text-white/80 text-lg mb-6">
              Join thousands of users who have already transformed their digital experience
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="glass-button px-8 py-4 rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 text-lg font-semibold">
                Start Free Trial
              </button>
              <button className="glass-button px-8 py-4 rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 text-lg font-semibold">
                View Documentation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiquidGlassDemo;
