import { useState } from 'react';
import { Plus, Edit2, Trash2, Tag } from 'lucide-react';
import { Category } from '../../App';

interface CategoriesTabProps {
  categories: Category[];
  onAddCategory: (category: Category) => void;
  onUpdateCategory: (categoryId: string, updates: Partial<Category>) => void;
  onDeleteCategory: (categoryId: string) => void;
}

export function CategoriesTab({ categories, onAddCategory, onUpdateCategory, onDeleteCategory }: CategoriesTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [iconType, setIconType] = useState<'emoji' | 'upload'>('emoji');
  const [formData, setFormData] = useState({
    name: '',
    icon: '📦'
  });

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', icon: '📦' });
    setIconType('emoji');
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, icon: category.icon });
    setIconType('emoji');
    setIsModalOpen(true);
  };

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, icon: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.icon) {
      alert('Please fill in all fields');
      return;
    }

    if (editingCategory) {
      onUpdateCategory(editingCategory.id, formData);
    } else {
      // Generate ID from name
      const id = formData.name.toLowerCase().replace(/\s+/g, '-');
      onAddCategory({
        id,
        ...formData
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (categoryId: string, categoryName: string) => {
    if (confirm(`Are you sure you want to delete "${categoryName}"? Products in this category will be moved to "other".`)) {
      onDeleteCategory(categoryId);
    }
  };

  const commonIcons = ['⌨️', '🖱️', '🎧', '📐', '📷', '🎮', '💻', '🖥️', '⚡', '🔊', '📱', '🎯', '🚀', '⭐', '💎', '🔥'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-1">Categories Management</h2>
          <p className="text-gray-600">{categories.length} categories total</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center shadow-lg border border-purple-100">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Tag className="w-10 h-10 text-purple-400" />
          </div>
          <p className="text-gray-500 mb-4">No categories yet</p>
          <button
            onClick={openAddModal}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105"
          >
            Add Your First Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(category => (
            <div key={category.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-all group">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                  {category.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="mb-1 truncate">{category.name}</h3>
                  <p className="text-sm text-gray-500">ID: {category.id}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(category)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border-2 border-purple-200 text-purple-600 rounded-xl hover:bg-purple-50 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category.id, category.name)}
                  className="flex items-center justify-center px-3 py-2 border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <h3 className="text-2xl mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Category Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="e.g., Gaming Keyboards"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Icon *</label>
                
                {/* Icon Type Selector */}
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setIconType('emoji')}
                    className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
                      iconType === 'emoji'
                        ? 'border-purple-600 bg-purple-50 text-purple-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    Emoji
                  </button>
                  <button
                    type="button"
                    onClick={() => setIconType('upload')}
                    className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
                      iconType === 'upload'
                        ? 'border-purple-600 bg-purple-50 text-purple-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    Upload Icon
                  </button>
                </div>

                {iconType === 'emoji' ? (
                  <input
                    type="text"
                    value={formData.icon.startsWith('data:') ? '📦' : formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-2xl text-center"
                    placeholder="📦"
                    maxLength={2}
                    required
                  />
                ) : (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleIconUpload}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Upload an icon image (recommended: square, 64x64px)
                    </p>
                  </div>
                )}

                {/* Icon Preview */}
                {formData.icon && (
                  <div className="mt-3 flex justify-center">
                    {formData.icon.startsWith('data:') ? (
                      <div className="w-16 h-16 border-2 border-purple-200 rounded-xl overflow-hidden">
                        <img src={formData.icon} alt="Icon preview" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 border-2 border-purple-200 rounded-xl flex items-center justify-center text-3xl">
                        {formData.icon}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {iconType === 'emoji' && (
                <div>
                  <label className="block text-sm mb-3">Quick Select:</label>
                  <div className="grid grid-cols-8 gap-2">
                    {commonIcons.map(icon => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon })}
                        className={`aspect-square text-2xl border-2 rounded-lg hover:bg-purple-50 transition-colors ${
                          formData.icon === icon ? 'border-purple-600 bg-purple-50' : 'border-gray-200'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105"
                >
                  {editingCategory ? 'Update Category' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}