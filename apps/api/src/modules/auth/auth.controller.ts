import { Request, Response } from 'express';
import { authService } from './auth.service';
import { sendSuccess } from '../../common/utils/response';

export class AuthController {
  public async register(req: Request, res: Response) {
    const result = await authService.register({
      ...req.body,
      ipAddress: req.ip,
    });
    return sendSuccess(res, result, 'Registration successful', 201);
  }

  public async login(req: Request, res: Response) {
    const { loginIdentifier, password } = req.body;
    const result = await authService.login(loginIdentifier, password, req.ip);
    return sendSuccess(res, result, 'Login successful');
  }

  public async refreshToken(req: Request, res: Response) {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshToken(refreshToken);
    return sendSuccess(res, tokens, 'Tokens refreshed successfully');
  }

  public async getProfile(req: Request, res: Response) {
    const profile = await authService.getProfile(req.user!.id);
    return sendSuccess(res, profile, 'Profile retrieved');
  }
}

export const authController = new AuthController();
