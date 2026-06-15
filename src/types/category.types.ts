import { Category } from './home.types';

export interface ExploreCategory extends Category {
  businessCount: number;
  isTrending?: boolean;
  isPopular?: boolean;
  cardSize: 'large' | 'medium' | 'small';
  gradientColors: [string, string]; 
  tags?: string[];
}

export interface CategoryExploreData {
  featured: ExploreCategory[];
  trending: ExploreCategory[];
  recommended: ExploreCategory[];
  all: ExploreCategory[];
}
