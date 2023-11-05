import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { attachCookiesToResponse, createTokenUser, hashString } from '../utils';
import crypto from 'crypto';
import { User } from '../models';
import { Token } from '../models';
import { sendVerificationEmail, sendResetPasswordEmail } from '../emails';
import { AuthenticationError, BadRequest } from '../error/customError';

const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, name, password } = req.body;

    const emailAlreadyExists = await User.findOne({ email });
    if (emailAlreadyExists) {
      throw new BadRequest('Email already exists');
    }

    // first registered user is an admin
    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? 'admin' : 'user';

    const verificationToken = crypto.randomBytes(40).toString('hex');

    const user = await User.create({
      name,
      email,
      password,
      role,
      verificationToken,
    });
    const origin = 'http://localhost:4000';
    // const newOrigin = 'https://react-node-user-workflow-front-end.netlify.app';

    // const tempOrigin = req.get('origin');
    // const protocol = req.protocol;
    // const host = req.get('host');
    // const forwardedHost = req.get('x-forwarded-host');
    // const forwardedProtocol = req.get('x-forwarded-proto');

    await sendVerificationEmail({
      name: user.name,
      email: user.email,
      verificationToken: user.verificationToken,
      origin,
    });
    // send verification token back only while testing in postman!!!
    res.status(StatusCodes.CREATED).json({
      msg: 'Success! Please check your email to verify account',
    });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { verificationToken, email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw new AuthenticationError('Verification Failed');
    }

    if (user.verificationToken !== verificationToken) {
      throw new AuthenticationError('Verification Failed');
    }

    (user.isVerified = true), (user.verified = Date.now());
    user.verificationToken = '';

    await user.save();

    res.status(StatusCodes.OK).json({ msg: 'Email Verified' });
  } catch (error) {
    next(error);
  }
};

const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequest('Please provide email and password');
    }
    const user = await User.findOne({ email });

    if (!user) {
      throw new AuthenticationError('Invalid Credentials');
    }
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      throw new AuthenticationError('Invalid Credentials');
    }
    if (!user.isVerified) {
      throw new AuthenticationError('Please verify your email');
    }
    const tokenUser = createTokenUser(user);

    // create refresh token
    let refreshToken = '';
    // check for existing token
    const existingToken = await Token.findOne({ user: user._id });

    if (existingToken) {
      const { isValid } = existingToken;
      if (!isValid) {
        throw new AuthenticationError('Invalid Credentials');
      }
      refreshToken = existingToken.refreshToken;
      const { accessToken, refreshToken: sendRefreshToken } =
        attachCookiesToResponse({ res, user: tokenUser, refreshToken });
      res
        .status(StatusCodes.OK)
        .json({ user: tokenUser, accessToken, refreshToken: sendRefreshToken });
      return;
    }

    refreshToken = crypto.randomBytes(40).toString('hex');
    const userAgent = req.headers['user-agent'];
    const ip = req.ip;
    const userToken = { refreshToken, ip, userAgent, user: user._id };

    await Token.create(userToken);

    const { accessToken, refreshToken: sendRefreshToken } =
      attachCookiesToResponse({ res, user: tokenUser, refreshToken });

    res
      .status(StatusCodes.OK)
      .json({ user: tokenUser, accessToken, refreshToken: sendRefreshToken });
  } catch (error) {
    next(error);
  }
};

interface CustomRequest extends Request {
  user?: { userId: string };
}

const logout = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (userId) {
      await Token.findOneAndDelete({ user: userId });
    }

    res.cookie('accessToken', 'logout', {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res.cookie('refreshToken', 'logout', {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
  } catch (error) {}
};

const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new BadRequest('Please provide valid email');
    }

    const user = await User.findOne({ email });

    if (user) {
      const passwordToken = crypto.randomBytes(70).toString('hex');
      // send email
      const origin = 'http://localhost:4000';
      await sendResetPasswordEmail({
        name: user.name,
        email: user.email,
        token: passwordToken,
        origin,
      });

      const tenMinutes = 1000 * 60 * 10;
      const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

      user.passwordToken = hashString(passwordToken);
      user.passwordTokenExpirationDate = passwordTokenExpirationDate;
      await user.save();
    }

    res
      .status(StatusCodes.OK)
      .json({ msg: 'Please check your email for reset password link' });
  } catch (error) {
    console.log("🚀 ~ file: user.contoller.ts:215 ~ error:", error)
    next(error);
  }
};

const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { token, email, password } = req.body;
    if (!token || !email || !password) {
      throw new BadRequest('Please provide all values');
    }
    const user = await User.findOne({ email });

    if (user) {
      const currentDate = new Date();

      if (
        user.passwordToken === hashString(token) &&
        user.passwordTokenExpirationDate > currentDate
      ) {
        user.password = password;
        user.passwordToken = null;
        user.passwordTokenExpirationDate = null;
        await user.save();
      }
    }

    res
      .status(StatusCodes.OK)
      .json({ msg: 'Password is successfully changed' });
  } catch (error) {
    next(error);
  }
};

export { register, login, logout, verifyEmail, forgotPassword, resetPassword };
