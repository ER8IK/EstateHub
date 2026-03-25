import { Request, Response, NextFunction } from 'express';
import { uploadToOneDrive } from '../../shared/utils/onedrive.utils';

export class TicketsController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user!;
      const { summary, priority, pageUrl, inventoryTitle } = req.body;

      if (!summary || !priority) {
        res.status(400).json({ success: false, message: 'summary и priority обязательны' });
        return;
      }

      const ticket = {
        reportedBy: {
          userId: user.userId,
          email: user.email,
        },
        summary,
        priority,
        inventory: inventoryTitle || null,
        link: pageUrl || null,
        createdAt: new Date().toISOString(),
      };

      const fileName = `ticket_${Date.now()}.json`;
      const webUrl = await uploadToOneDrive(fileName, JSON.stringify(ticket, null, 2));

      res.status(201).json({
        success: true,
        data: { ticket, fileUrl: webUrl },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const ticketsController = new TicketsController();