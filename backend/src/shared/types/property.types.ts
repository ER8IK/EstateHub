export type PropertyType = 'apartment' | 'house' | 'commercial' | 'land';
export type PropertyStatus = 'sale' | 'rent' | 'sold';

export interface Property {
  id: string;
  userId: string;
  title: string;
  type: PropertyType;
  status: PropertyStatus;    
  city: string;              
  address: string;
  description?: string;      
  price: number;
  area: number;
  rentPerMonth?: number;
  createdAt: Date;
}

export interface CreatePropertyDto {
  title: string;
  type: PropertyType;
  status: PropertyStatus;    
  city: string;              
  address: string;
  description?: string;      
  price: number;
  area: number;
  rentPerMonth?: number;
}

export interface PropertyFilters {
  type?: PropertyType;
  status?: PropertyStatus;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
}