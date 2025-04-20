import React, { useState } from 'react';
import ItemForm from './ItemForm';
import ItemCard from './ItemCard';
import { findMatches } from '../../utils/lost-found-utils';

export interface Item {
  id: string;
  type: 'lost' | 'found';
  description: string;
  timestamp: Date;
  location?: string;
  contactInfo?: string;
}

const LostAndFound: React.FC = () => {
  const [items, setItems] = useState<Item[]>([
    {
      id: '1',
      type: 'lost',
      description: 'Black backpack with laptop inside, lost near the library',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      location: 'Main Library',
      contactInfo: 'john@example.com',
    },
    {
      id: '2',
      type: 'found',
      description: 'Blue water bottle found in Science Building room 103',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      location: 'Science Building',
      contactInfo: 'sara@example.com',
    },
  ]);
  
  const [filter, setFilter] = useState<'all' | 'lost' | 'found'>('all');

  const handleAddItem = (newItem: Omit<Item, 'id' | 'timestamp'>) => {
    const item: Item = {
      ...newItem,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    
    setItems((prev) => [...prev, item]);
  };

  const filteredItems = items.filter((item) => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  // Find matches for each item
  const itemsWithMatches = filteredItems.map((item) => {
    const matches = findMatches(item, items);
    return { ...item, matches };
  });

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
        <h2 className="font-bold text-lg">Lost & Found Assistant</h2>
        <p className="text-sm text-blue-100">Report lost items or items you've found</p>
      </div>

      <div className="p-6">
        <ItemForm onSubmit={handleAddItem} />

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Items ({filteredItems.length})</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('lost')}
                className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                  filter === 'lost'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                Lost
              </button>
              <button
                onClick={() => setFilter('found')}
                className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                  filter === 'found'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                Found
              </button>
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No items to display. Submit a new lost or found item.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {itemsWithMatches.map((item) => (
                <ItemCard key={item.id} item={item} matches={item.matches} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LostAndFound;