import { Request, Response, NextFunction } from 'express';
import { AuthenticationError, CustomAPIError } from '../error/customError';
import { isTokenValid, attachCookiesToResponse } from '../utils';
import { Token } from '../models';
import { IUser } from '../models/user.model';

interface AuthenticatedRequest extends Request {
  user: IUser;
}

const authenticateUser = async (
  req: Request | any,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { refreshToken, accessToken } = req.signedCookies;

  try {
    if (accessToken) {
      const payload = isTokenValid(accessToken);
      req.user = payload.user;
      return next();
    }
    const payload = isTokenValid(refreshToken);

    const existingToken = await Token.findOne({
      user: payload.user.userId,
      refreshToken: payload.refreshToken,
    });

    if (!existingToken || !existingToken?.isValid) {
      throw new AuthenticationError('Authentication Invalid');
    }

    attachCookiesToResponse({
      res,
      user: payload.user,
      refreshToken: existingToken.refreshToken,
    });

    req.user = payload.user;
    next();
  } catch (error) {
    next(error)
  }
};

const authorizePermissions = (...roles: string[]) => {
  return (req: AuthenticatedRequest | any, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      throw new AuthenticationError('Unauthorized to access this route');
    }
    next();
  };
};

export { authenticateUser, authorizePermissions };
