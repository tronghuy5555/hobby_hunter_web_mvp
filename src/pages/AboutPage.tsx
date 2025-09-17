import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background-primary py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">About HobbyHunter</h1>
          <p className="text-gray-400">
            Learn more about our platform and mission
          </p>
        </div>

        <div className="space-y-8">
          {/* Mission Section */}
          <div className="bg-background-secondary rounded-xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              HobbyHunter bridges the gap between digital and physical collectibles. 
              We believe that the excitement of opening card packs should be accessible anywhere, 
              while still providing the option to own physical cards.
            </p>
          </div>

          {/* How It Works */}
          <div className="bg-background-secondary rounded-xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                  💳
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Purchase Credits</h3>
                <p className="text-gray-400">
                  Buy credits securely with PayPal to purchase card packs
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                  📦
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Open Packs</h3>
                <p className="text-gray-400">
                  Experience the thrill with our animated pack opening system
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                  🚚
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Ship Physical Cards</h3>
                <p className="text-gray-400">
                  Convert your digital cards into high-quality physical collectibles
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-background-secondary rounded-xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">Features</h2>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start space-x-3">
                <span className="text-green-400 text-xl">✓</span>
                <span>Animated pack opening with skip options</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-green-400 text-xl">✓</span>
                <span>Card collection with expiry countdown system</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-green-400 text-xl">✓</span>
                <span>Secure PayPal payment integration</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-green-400 text-xl">✓</span>
                <span>Physical card shipping service</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-green-400 text-xl">✓</span>
                <span>Mobile-optimized responsive design</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-green-400 text-xl">✓</span>
                <span>Real-time notifications and updates</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="bg-background-secondary rounded-xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
            <p className="text-gray-300 mb-4">
              Have questions or feedback? We'd love to hear from you!
            </p>
            <div className="space-y-2 text-gray-400">
              <p>📧 Email: support@hobbyhunter.com</p>
              <p>💬 Discord: HobbyHunter Community</p>
              <p>🐦 Twitter: @HobbyHunterApp</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;