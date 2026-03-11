import { Property, CreatePropertyDto, PropertyFilters } from '../../shared/types';
export declare class PropertiesService {
    create(userId: string, dto: CreatePropertyDto): Property;
    getPublic(filters: PropertyFilters): Property[];
    getAllByUser(userId: string): Property[];
    getByIdPublic(id: string): Property;
    getById(id: string, userId: string): Property;
    update(id: string, userId: string, dto: Partial<CreatePropertyDto>): Property;
    delete(id: string, userId: string): void;
    getByIdInternal(id: string): Property | undefined;
}
export declare const propertiesService: PropertiesService;
//# sourceMappingURL=properties.service.d.ts.map