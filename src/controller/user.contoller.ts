import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { User } from '../models';
import {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions,
} from '../utils';
import {
  NotFoundError,
  BadRequest,
  AuthenticationError,
} from '../error/customError';
import { IUser } from '../models/user.model';

interface CustomRequest extends Request {
  user: IUser;
}
const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  const users = await User.find({ role: 'user' }).select('-password');
  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (
  req: CustomRequest | any,
  res: Response ,
): Promise<void> => {
  const user = await User.findOne({ _id: req.params.id }).select('-password') as any;
  const plainUser = user.toObject(); 
  const {
    passwordToken,
    passwordTokenExpirationDate,
    verificationToken,
    __v,
    ...userDocument
  } = plainUser as IUser;
  if (!user) {
    throw new NotFoundError(`No user with id : ${req.params.id}`);
  }
  checkPermissions(req.user, user._id);
  res.status(StatusCodes.OK).json({ user: userDocument });
};

const showCurrentUser = async (
  req: CustomRequest,
  res: Response,
): Promise<void> => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUser = async (req: CustomRequest, res: Response): Promise<void> => {
  const { email, name } = req.body;
  if (!email || !name) {
    throw new BadRequest('Please provide all values');
  }
  const user = (await User.findOne({ _id: req.user.userId })) as any;

  user.email = email;
  user.name = name;

  await user.save();

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user, tokenUser } as any);
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const updateUserPassword = async (
  req: CustomRequest,
  res: Response,
): Promise<void> => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new BadRequest('Please provide both values');
  }
  const user = (await User.findOne({ _id: req.user.userId })) as any;

  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new AuthenticationError('Invalid Credentials');
  }
  user.password = newPassword;

  await user.save();
  res.status(StatusCodes.OK).json({ msg: 'Success! Password Updated.' });
};

export {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
