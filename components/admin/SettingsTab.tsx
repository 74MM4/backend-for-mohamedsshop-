import { useState, useEffect } from 'react';
import { Mail, Lock, Save, AlertCircle, Store as StoreIcon, Image as ImageIcon, Trash2, Plus, Facebook, Instagram, Twitter, Phone } from 'lucide-react';
import { EmailConfig, StoreConfig } from '../../App';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface SettingsTabProps {
  emailConfig: EmailConfig;
  onUpdateEmailConfig: (config: EmailConfig) => void;
  storeConfig: StoreConfig;
  onUpdateStoreConfig: (config: StoreConfig) => void;
}

export function SettingsTab({ emailConfig, onUpdateEmailConfig, storeConfig, onUpdateStoreConfig }: SettingsTabProps) {
  const [emailFormData, setEmailFormData] = useState<EmailConfig>(emailConfig);
  const [storeFormData, setStoreFormData] = useState<StoreConfig>(storeConfig);
  const [emailSaved, setEmailSaved] = useState(false);
  const [storeSaved, setStoreSaved] = useState(false);
  const [newAdUrl, setNewAdUrl] = useState('');
  const [adUploadType, setAdUploadType] = useState<'url' | 'upload'>('url');

  const handleEmailSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateEmailConfig(emailFormData);
    setEmailSaved(true);
    setTimeout(() => setEmailSaved(false), 3000);
  };

  const handleStoreSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStoreConfig(storeFormData);
    setStoreSaved(true);
    setTimeout(() => setStoreSaved(false), 3000);
  };

  const handleAddAd = () => {
    if (!newAdUrl.trim()) {
      alert('Please provide an image URL or upload an image');
      return;
    }
    const next = {
      ...storeFormData,
      ads: [...(storeFormData.ads || []), newAdUrl]
    };
    setStoreFormData(next);
    setNewAdUrl('');
  };

  const handleRemoveAd = (index: number) => {
    const next = {
      ...storeFormData,
      ads: (storeFormData.ads || []).filter((_, i) => i !== index)
    };
    setStoreFormData(next);
  };

  const handleAdImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAdUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Keep email form in sync with prop
  useEffect(() => {
    setEmailFormData(emailConfig);
  }, [emailConfig]);

  // Keep local store form in sync when prop changes (but allow edits locally before save)
  useEffect(() => {
    setStoreFormData(storeConfig);
  }, [storeConfig]);

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl mb-1">Store Settings</h2>
        <p className="text-gray-600">Configure your store and email settings</p>
      </div>

      {/* Advertisement Carousel Management */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-purple-100">
        <h3 className="text-xl mb-6">Advertisement Carousel</h3>

        {/* Current Ads */}
        <div className="mb-6">
          <label className="block text-sm mb-3">Current Ads ({(storeConfig.ads || []).length})</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(storeConfig.ads || []).map((ad, index) => (
              <div key={index} className="relative group rounded-xl overflow-hidden border-2 border-gray-200">
                <div className="aspect-video bg-gray-100">
                  <ImageWithFallback
                    src={ad}
                    alt={`Ad ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => handleRemoveAd(index)}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Add New Ad */}
        <div className="space-y-4">
          <label className="block text-sm">Add New Advertisement</label>
          
          {/* Upload Type Selector */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setAdUploadType('url')}
              className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
                adUploadType === 'url'
                  ? 'border-purple-600 bg-purple-50 text-purple-600'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              Image URL
            </button>
            <button
              type="button"
              onClick={() => setAdUploadType('upload')}
              className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
                adUploadType === 'upload'
                  ? 'border-purple-600 bg-purple-50 text-purple-600'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              Upload File
            </button>
          </div>

            {adUploadType === 'url' ? (
            <div className="flex gap-2">
              <input
                type="url"
                value={newAdUrl}
                onChange={(e) => setNewAdUrl(e.target.value)}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="https://example.com/ad-image.jpg"
              />
              <button
                onClick={handleAddAd}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add
              </button>
            </div>
          ) : (
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleAdImageUpload}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
              {newAdUrl && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">Preview:</p>
                  <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden mb-2">
                    <ImageWithFallback src={newAdUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <button
                    onClick={handleAddAd}
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Advertisement
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Store Address Configuration */}
      <form onSubmit={handleStoreSave} className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-purple-100">
        <h3 className="text-xl mb-6">Store Information</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm mb-2">
              <div className="flex items-center gap-2">
                <StoreIcon className="w-4 h-4" />
                Store Address
              </div>
            </label>
            <textarea
              value={storeConfig.address}
              onChange={(e) => onUpdateStoreConfig({ ...storeConfig, address: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none"
              rows={3}
              placeholder="Enter your store address for pickup orders..."
            />
            <p className="text-xs text-gray-500 mt-2">
              This address will be shown to customers who choose pickup at store
            </p>
          </div>

          {/* Social Media Links */}
          <div className="space-y-4">
            <h4 className="text-sm">Social Media & Contact</h4>
            
            <div>
              <label className="block text-xs mb-2">
                <div className="flex items-center gap-2">
                  <Facebook className="w-4 h-4" />
                  Facebook URL
                </div>
              </label>
              <input
                type="url"
                value={storeConfig.socialMedia.facebook}
                onChange={(e) => onUpdateStoreConfig({
                  ...storeConfig,
                  socialMedia: { ...storeConfig.socialMedia, facebook: e.target.value }
                })}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="https://facebook.com/yourpage"
              />
            </div>

            <div>
              <label className="block text-xs mb-2">
                <div className="flex items-center gap-2">
                  <Instagram className="w-4 h-4" />
                  Instagram URL
                </div>
              </label>
              <input
                type="url"
                value={storeConfig.socialMedia.instagram}
                onChange={(e) => onUpdateStoreConfig({
                  ...storeConfig,
                  socialMedia: { ...storeConfig.socialMedia, instagram: e.target.value }
                })}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="https://instagram.com/yourpage"
              />
            </div>

            <div>
              <label className="block text-xs mb-2">
                <div className="flex items-center gap-2">
                  <Twitter className="w-4 h-4" />
                  Twitter URL
                </div>
              </label>
              <input
                type="url"
                value={storeConfig.socialMedia.twitter}
                onChange={(e) => onUpdateStoreConfig({
                  ...storeConfig,
                  socialMedia: { ...storeConfig.socialMedia, twitter: e.target.value }
                })}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="https://twitter.com/yourpage"
              />
            </div>

            <div>
              <label className="block text-xs mb-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </div>
              </label>
              <input
                type="tel"
                value={storeConfig.socialMedia.phone}
                onChange={(e) => onUpdateStoreConfig({
                  ...storeConfig,
                  socialMedia: { ...storeConfig.socialMedia, phone: e.target.value }
                })}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="+216 12 345 678"
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105"
          >
            <Save className="w-5 h-5" />
            {storeSaved ? 'Saved!' : 'Save Store Settings'}
          </button>
        </div>
      </form>

      {/* Email Configuration Form */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-2xl p-6">
        <div className="flex gap-3">
          <AlertCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-green-900">
            <p className="font-semibold mb-2">✓ Email System Ready</p>
            <p className="mb-2">
              Your email configuration is active and will automatically send:
            </p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Order confirmation codes to customers</li>
              <li>Order confirmation emails with details</li>
              <li>Email verification for new accounts</li>
            </ul>
          </div>
        </div>
      </div>

      <form onSubmit={handleEmailSave} className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-purple-100">
        <h3 className="text-xl mb-6">Email Configuration</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm mb-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Sender Email Address
              </div>
            </label>
            <input
              type="email"
              value={emailFormData.email}
              onChange={(e) => setEmailFormData({ ...emailFormData, email: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="your-email@gmail.com"
            />
            <p className="text-xs text-gray-500 mt-2">The email address that will send all customer emails</p>
          </div>

          <div>
            <label className="block text-sm mb-2">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Gmail App Password
              </div>
            </label>
            <input
              type="password"
              value={emailFormData.appPassword}
              onChange={(e) => setEmailFormData({ ...emailFormData, appPassword: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Enter app password"
            />
            <p className="text-xs text-gray-500 mt-2">
              Get this from: Google Account → Security → 2-Step Verification → App passwords → Select Mail & Windows
            </p>
          </div>

          {emailFormData.email && emailFormData.appPassword && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <p className="text-sm text-green-800">✓ Credentials configured. Emails will be sent from <strong>{emailFormData.email}</strong></p>
            </div>
          )}

          <button
            type="submit"
            className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105"
          >
            <Save className="w-5 h-5" />
            {emailSaved ? 'Saved!' : 'Save Email Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
}