import React, { useState } from 'react';
import { Item } from './LostAndFound';
import { Calendar, MapPin, ChevronDown, ChevronUp, User } from 'lucide-react';

interface ItemCardProps {
  item: Item;
  matches: Item[];
}

const ItemCard: React.FC<ItemCardProps> = ({ item, matches }) => {
  const [expanded, setExpanded] = useState(false);
  
  const formattedDate = item.timestamp.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  
  const formattedTime = item.timestamp.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div 
      className={`border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 ${
        item.type === 'lost' ? 'border-blue-200' : 'border-teal-200'
      }`}
    >
      <div className={`px-4 py-3 ${
        item.type === 'lost' ? 'bg-blue-50' : 'bg-teal-50'
      }`}>
        <div className="flex justify-between items-center">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            item.type === 'lost' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-teal-100 text-teal-800'
          }`}>
            {item.type === 'lost' ? 'Lost' : 'Found'} Item
          </span>
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formattedDate} at {formattedTime}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-gray-800 mb-3">{item.description}</p>
        
        {item.location && (
          <div className="flex items-center text-gray-600 mb-2 text-sm">
            <MapPin className="h-4 w-4 mr-1 text-gray-400" />
            <span>{item.location}</span>
          </div>
        )}
        
        {item.contactInfo && (
          <div className="flex items-center text-gray-600 text-sm">
            <User className="h-4 w-4 mr-1 text-gray-400" />
            <span>{item.contactInfo}</span>
          </div>
        )}
        
        {matches.length > 0 && (
          <div className="mt-4 border-t border-gray-100 pt-3">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              {expanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Hide Potential Matches
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Show {matches.length} Potential {matches.length === 1 ? 'Match' : 'Matches'}
                </>
              )}
            </button>
            
            {expanded && (
              <div className="mt-3 space-y-3">
                {matches.map((match) => (
                  <div key={match.id} className="border border-gray-200 rounded p-2 bg-gray-50">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        match.type === 'lost' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-teal-100 text-teal-800'
                      }`}>
                        {match.type === 'lost' ? 'Lost' : 'Found'} Item
                      </span>
                      <span className="text-xs text-gray-500">
                        {match.timestamp.toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800">{match.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemCard;