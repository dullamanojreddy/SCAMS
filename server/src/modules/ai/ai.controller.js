import { aiService } from './ai.service.js';
import { ApiResponse } from '../../shared/utils/response.js';

export class AIController {
  async chat(req, res, next) {
    try {
      const { message, conversationId, contextData } = req.body;
      const response = await aiService.processChat({
        message,
        conversationId,
        user: req.user,
        contextData,
      });
      return ApiResponse.success(res, response, 'AI response generated');
    } catch (error) {
      next(error);
    }
  }

  async confirmAction(req, res, next) {
    try {
      const { actionId } = req.params;
      const result = await aiService.confirmAction(actionId, req.user);
      return ApiResponse.success(res, result, 'Action confirmed and processed');
    } catch (error) {
      next(error);
    }
  }

  async cancelAction(req, res, next) {
    try {
      const { actionId } = req.params;
      const result = await aiService.cancelAction(actionId, req.user);
      return ApiResponse.success(res, result, 'Action discarded');
    } catch (error) {
      next(error);
    }
  }
}

export const aiController = new AIController();
