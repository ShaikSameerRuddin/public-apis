import { AuthenticationError } from '../error/customError';

export const checkPermissions = (requestUser: any, resourceUserId: string): void => {
  // console.log(requestUser);
  // console.log(resourceUserId);
  // console.log(typeof resourceUserId);
  if (requestUser.role === 'admin') return;
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new AuthenticationError(
    'Not authorized to access this route'
  );
};


