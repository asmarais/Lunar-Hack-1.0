import React, { useState } from 'react';
import { Item } from './LostAndFound';
import { MapPin, User } from 'lucide-react';

interface ItemFormProps {
  onSubmit: (item: Omit<Item, 'id' | 'timestamp'>) => void;
}

const ItemForm: React.FC<ItemFormProps> = ({ onSubmit }) => {
  const [type, setType] = useState<'lost' | 'found'>('lost');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (description.trim() === '') return;
    
    onSubmit({
      type,
      description,
      location,
      contactInfo,
    });
    
    // Reset form
    setDescription('');
    setLocation('');
    setContactInfo('');
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-medium mb-4">Submit an Item</h3>
      
      <div className="mb-4">
        <div className="flex rounded-md overflow-hidden border border-gray-300">
          <button
            type="button"
            onClick={() => setType('lost')}
            className={`flex-1 py-2 px-4 text-center transition-colors duration-200 ${
              type === 'lost'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Lost Item
          </button>
          <button
            type="button"
            onClick={() => setType('found')}
            className={`flex-1 py-2 px-4 text-center transition-colors duration-200 ${
              type === 'found'
                ? 'bg-teal-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Found Item
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description*
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={`Describe the ${type} item in detail...`}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            required
          />
        </div>
        
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={type === 'lost' ? "Where did you lose it?" : "Where did you find it?"}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Information
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="contactInfo"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              placeholder="Email or phone number"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <button
          onClick={handleSubmit}
          className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors duration-200 ${
            type === 'lost'
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-teal-600 hover:bg-teal-700'
          }`}
        >
          Submit {type === 'lost' ? 'Lost' : 'Found'} Item
        </button>
      </div>
    </div>
  );
};

export default ItemForm;