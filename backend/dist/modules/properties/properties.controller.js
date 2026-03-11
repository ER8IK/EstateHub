import { propertiesService } from './properties.service';
export class PropertiesController {
    getPublic(req, res, next) {
        try {
            const filters = {
                type: req.query.type,
                status: req.query.status,
                city: req.query.city,
                minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
                maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
            };
            const properties = propertiesService.getPublic(filters);
            res.status(200).json({ success: true, data: properties });
        }
        catch (error) {
            next(error);
        }
    }
    getByIdPublic(req, res, next) {
        try {
            const { id } = req.params;
            const property = propertiesService.getByIdPublic(id);
            res.status(200).json({ success: true, data: property });
        }
        catch (error) {
            next(error);
        }
    }
    create(req, res, next) {
        try {
            const userId = req.user.userId;
            const dto = req.body;
            if (!dto.title || !dto.type || !dto.status || !dto.city || !dto.address || !dto.price || !dto.area) {
                res.status(400).json({ success: false, message: 'Заполните все обязательные поля' });
                return;
            }
            const property = propertiesService.create(userId, dto);
            res.status(201).json({ success: true, data: property });
        }
        catch (error) {
            next(error);
        }
    }
    getAll(req, res, next) {
        try {
            const userId = req.user.userId;
            const properties = propertiesService.getAllByUser(userId);
            res.status(200).json({ success: true, data: properties });
        }
        catch (error) {
            next(error);
        }
    }
    getById(req, res, next) {
        try {
            const userId = req.user.userId;
            const { id } = req.params;
            const property = propertiesService.getById(id, userId);
            res.status(200).json({ success: true, data: property });
        }
        catch (error) {
            next(error);
        }
    }
    update(req, res, next) {
        try {
            const userId = req.user.userId;
            const { id } = req.params;
            const property = propertiesService.update(id, userId, req.body);
            res.status(200).json({ success: true, data: property });
        }
        catch (error) {
            next(error);
        }
    }
    delete(req, res, next) {
        try {
            const userId = req.user.userId;
            const { id } = req.params;
            propertiesService.delete(id, userId);
            res.status(200).json({ success: true, message: 'Удалено' });
        }
        catch (error) {
            next(error);
        }
    }
}
export const propertiesController = new PropertiesController();
//# sourceMappingURL=properties.controller.js.map