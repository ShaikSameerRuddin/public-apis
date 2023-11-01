import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { IUser } from '../models/user.model';

interface UserPayload {
  user: any; // Adjust the type of user as per your user schema
  refreshToken?: any; // Adjust the type of refreshToken as per your schema
}

export const createJWT = ({ payload }: { payload: UserPayload }): string => {
  const token = jwt.sign(payload, process.env.JWT_SECRET as string);
  return token;
};

export const isTokenValid = (token: string): any =>
  jwt.verify(token, process.env.JWT_SECRET as string);

export const attachCookiesToResponse = ({
  res,
  user,
  refreshToken,
}: {
  res: Response;
  user: any;
  refreshToken: any;
}): { accessToken: string; refreshToken: string } => {
  const accessTokenJWT = createJWT({ payload: { user } });
  const refreshTokenJWT = createJWT({ payload: { user, refreshToken } });

  const oneDay = 1000 * 60 * 60 * 24;
  const longerExp = 1000 * 60 * 60 * 24 * 30;

  res.cookie('accessToken', accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    expires: new Date(Date.now() + oneDay),
  });

  res.cookie('refreshToken', refreshTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    expires: new Date(Date.now() + longerExp),
  });
  return { accessToken: accessTokenJWT, refreshToken: refreshTokenJWT };
};

export const createTokenUser = (user: IUser) => {
  return { name: user.name, userId: user._id, role: user.role };
};
