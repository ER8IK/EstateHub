"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propertiesController = exports.PropertiesController = void 0;
const properties_service_1 = require("./properties.service");
class PropertiesController {
    getPublic(req, res, next) {
        try {
            const filters = {
                type: req.query.type,
                status: req.query.status,
                city: req.query.city,
                minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
                maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
            };
            const properties = properties_service_1.propertiesService.getPublic(filters);
            res.status(200).json({ success: true, data: properties });
        }
        catch (error) {
            next(error);
        }
    }
    getByIdPublic(req, res, next) {
        try {
            const { id } = req.params;
            const property = properties_service_1.propertiesService.getByIdPublic(id);
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
            const property = properties_service_1.propertiesService.create(userId, dto);
            res.status(201).json({ success: true, data: property });
        }
        catch (error) {
            next(error);
        }
    }
    getAll(req, res, next) {
        try {
            const userId = req.user.userId;
            const properties = properties_service_1.propertiesService.getAllByUser(userId);
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
            const property = properties_service_1.propertiesService.getById(id, userId);
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
            const property = properties_service_1.propertiesService.update(id, userId, req.body);
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
            properties_service_1.propertiesService.delete(id, userId);
            res.status(200).json({ success: true, message: 'Удалено' });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PropertiesController = PropertiesController;
exports.propertiesController = new PropertiesController();
//# sourceMappingURL=properties.controller.js.map