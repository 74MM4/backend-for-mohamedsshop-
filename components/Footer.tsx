import { Facebook, Instagram, Twitter, Phone, MapPin, ArrowUp } from 'lucide-react';
import { StoreConfig } from '../App';

interface FooterProps {
  storeConfig: StoreConfig;
}

export function Footer({ storeConfig }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-purple-900 dark:from-gray-950 dark:to-purple-950 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-xl mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              GamerGear
            </h3>
            <p className="text-gray-300 dark:text-gray-400 text-sm mb-4">
              Your premium destination for gaming peripherals. Quality products, competitive prices, and excellent service.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg mb-4">Contact Us</h3>
            <div className="space-y-3">
              <a
                href={`tel:${storeConfig.socialMedia.phone}`}
                className="flex items-center gap-2 text-gray-300 dark:text-gray-400 hover:text-purple-400 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm">{storeConfig.socialMedia.phone}</span>
              </a>
              <div className="flex items-start gap-2 text-gray-300 dark:text-gray-400">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{storeConfig.address}</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a
                href={storeConfig.socialMedia.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-purple-600 rounded-xl flex items-center justify-center transition-all hover:scale-110"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={storeConfig.socialMedia.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-pink-600 rounded-xl flex items-center justify-center transition-all hover:scale-110"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={storeConfig.socialMedia.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-blue-600 rounded-xl flex items-center justify-center transition-all hover:scale-110"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex items-center justify-between">
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            © {new Date().getFullYear()} GamerGear. All rights reserved.
          </p>

          {/* Back to Top Button */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-purple-600 rounded-xl transition-all hover:scale-105"
          >
            <ArrowUp className="w-4 h-4" />
            <span className="text-sm">Back to Top</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
