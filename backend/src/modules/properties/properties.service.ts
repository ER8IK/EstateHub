import { Property, CreatePropertyDto, PropertyFilters } from '../../shared/types';
import { AppError } from '../../shared/middleware/error.middleware';
import { generateId } from '../../shared/utils/id.utils';

const properties: Property[] = [];

export class PropertiesService {

  create(userId: string, dto: CreatePropertyDto): Property {
    const property: Property = {
      id: generateId(),
      userId,
      title: dto.title,
      type: dto.type,
      status: dto.status,
      city: dto.city,
      address: dto.address,
      description: dto.description,
      price: dto.price,
      area: dto.area,
      rentPerMonth: dto.rentPerMonth,
      createdAt: new Date(),
    };
    properties.push(property);
    return property;
  }

  getPublic(filters: PropertyFilters): Property[] {
    return properties.filter(p => {
      if (p.status === 'sold') return false;
      if (filters.type && p.type !== filters.type) return false;
      if (filters.status && p.status !== filters.status) return false;
      if (filters.city && !p.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
      if (filters.minPrice && p.price < filters.minPrice) return false;
      if (filters.maxPrice && p.price > filters.maxPrice) return false;
      return true;
    });
  }

  getAllByUser(userId: string): Property[] {
    return properties.filter(p => p.userId === userId);
  }

  getByIdPublic(id: string): Property {
    const property = properties.find(p => p.id === id);
    if (!property) throw new AppError('Property not found', 404);
    return property;
  }

  getById(id: string, userId: string): Property {
    const property = properties.find(p => p.id === id);
    if (!property) throw new AppError('Property not found', 404);
    if (property.userId !== userId) throw new AppError('Access denied', 403);
    return property;
  }

  update(id: string, userId: string, dto: Partial<CreatePropertyDto>): Property {
    const property = this.getById(id, userId);
    if (dto.title !== undefined) property.title = dto.title;
    if (dto.type !== undefined) property.type = dto.type;
    if (dto.status !== undefined) property.status = dto.status;
    if (dto.city !== undefined) property.city = dto.city;
    if (dto.address !== undefined) property.address = dto.address;
    if (dto.description !== undefined) property.description = dto.description;
    if (dto.price !== undefined) property.price = dto.price;
    if (dto.area !== undefined) property.area = dto.area;
    if (dto.rentPerMonth !== undefined) property.rentPerMonth = dto.rentPerMonth;
    return property;
  }

  delete(id: string, userId: string): void {
    const property = this.getById(id, userId);
    const index = properties.indexOf(property);
    properties.splice(index, 1);
  }

  getByIdInternal(id: string): Property | undefined {
    return properties.find(p => p.id === id);
  }
}

export const propertiesService = new PropertiesService();