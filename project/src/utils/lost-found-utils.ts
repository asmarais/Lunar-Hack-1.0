import { Item } from '../components/LostAndFound/LostAndFound';

/**
 * Find potential matches between lost and found items
 */
export const findMatches = (item: Item, allItems: Item[]): Item[] => {
  // Don't match items against themselves
  const otherItems = allItems.filter(other => other.id !== item.id);
  
  // Only match lost items with found items and vice versa
  const potentialMatches = otherItems.filter(other => other.type !== item.type);
  
  if (potentialMatches.length === 0) {
    return [];
  }
  
  // Extract keywords from the item description
  const keywords = extractKeywords(item.description);
  
  // Calculate match scores for each potential match
  const matchesWithScores = potentialMatches.map(match => {
    const score = calculateMatchScore(keywords, match.description);
    return { match, score };
  });
  
  // Sort by score (descending) and filter for minimum match quality
  const goodMatches = matchesWithScores
    .filter(({ score }) => score > 0.2) // Minimum threshold for a match
    .sort((a, b) => b.score - a.score)
    .slice(0, 3) // Return at most 3 matches
    .map(({ match }) => match);
  
  return goodMatches;
};

/**
 * Extract meaningful keywords from text
 */
const extractKeywords = (text: string): string[] => {
  // Convert to lowercase and remove common punctuation
  const processedText = text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
  
  // Split into words
  const words = processedText.split(/\s+/);
  
  // Filter out common stopwords
  const stopwords = new Set([
    'a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'by', 'in',
    'with', 'about', 'is', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
    'i', 'me', 'my', 'mine', 'you', 'your', 'yours', 'he', 'him', 'his', 'she', 'her',
    'hers', 'it', 'its', 'we', 'us', 'our', 'ours', 'they', 'them', 'their', 'theirs'
  ]);
  
  return words.filter(word => word.length > 2 && !stopwords.has(word));
};

/**
 * Calculate how well two texts match
 */
const calculateMatchScore = (keywords: string[], targetText: string): number => {
  const targetLower = targetText.toLowerCase();
  let matchCount = 0;
  
  for (const keyword of keywords) {
    if (targetLower.includes(keyword)) {
      matchCount++;
    }
  }
  
  // Calculate score as the proportion of matching keywords
  return keywords.length > 0 ? matchCount / keywords.length : 0;
};