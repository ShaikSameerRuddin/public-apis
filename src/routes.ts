import { Express, Request, Response } from 'express';
import {
  forgotPasswordUrl,
  healthCheckUrl,
  loginUrl,
  logoutUrl,
  registerUrl,
  resetPasswordUrl,
  verifyEmailUrl,
  version,
} from './helpers/urls';
import {
  forgotPassword,
  login,
  logout,
  register,
  resetPassword,
  verifyEmail,
} from './controller/user.contoller';
import { authenticateUser } from './middleware';

export const routes = (app: Express, express: any) => {
  const router = express.Router();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  /**
   * @openapi
   * /api/v1/healthCheck:
   *  get:
   *     tags:
   *     - healthCheck
   *     description: Responds if the app is up and running
   *     responses:
   *       200:
   *         description: App is up and running
   */
  app.get(healthCheckUrl, (req: Request, res: Response) => {
    res.send('Hello, boss! we are working good');
  });

  //auth
  /**
   * @openapi
   * /api/v1/register:
   *  post:
   *     tags:
   *     - Auth
   *     description: Register a new user
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *               name:
   *                 type: string
   *               password:
   *                 type: string
   *             required:
   *               - email
   *               - name
   *               - password
   *     responses:
   *       201:
   *         description: User registered successfully
   *       400:
   *         description: Bad request, email already exists or invalid input
   */
  app.post(registerUrl, register);
  /**
   * @openapi
   * /api/v1/login:
   *  post:
   *     tags:
   *     - Auth
   *     description: Log in to the application
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 default: sameerruddinshaik@gmail.com
   *               password:
   *                 type: string
   *                 default: Sameer1234@R
   *             required:
   *               - email
   *               - password
   *     responses:
   *       200:
   *         description: User logged in successfully
   *       400:
   *         description: Bad request, invalid credentials or missing information
   */
  app.post(loginUrl, login);
  /**
   * @openapi
   * /api/v1/logout:
   *  delete:
   *     tags:
   *     - Auth
   *     description: Log out from the application
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User logged out successfully
   *       401:
   *         description: Unauthorized request, authentication required
   */

  app.delete(logoutUrl, [authenticateUser], logout);
  /**
   * @openapi
   * /api/v1/verify-email:
   *  post:
   *     tags:
   *     - Auth
   *     description: Verify the user's email
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               verificationToken:
   *                 type: string
   *               email:
   *                 type: string
   *             required:
   *               - verificationToken
   *               - email
   *     responses:
   *       200:
   *         description: Email verified successfully
   *       400:
   *         description: Bad request, verification failed
   */
  app.post(verifyEmailUrl, verifyEmail);
  /**
   * @openapi
   * /api/v1/reset-password:
   *  post:
   *     tags:
   *     - Auth
   *     description: Reset the password for the user
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               token:
   *                 type: string
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *             required:
   *               - token
   *               - email
   *               - password
   *     responses:
   *       200:
   *         description: Password reset successful
   *       400:
   *         description: Bad request, missing token, email, or password
   */
  app.post(resetPasswordUrl, resetPassword);
  /**
   * @openapi
   * /api/v1/forgot-password:
   *  post:
   *     tags:
   *     - Auth
   *     description: Request a password reset for the user
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *             required:
   *               - email
   *     responses:
   *       200:
   *         description: Email sent for password reset
   *       400:
   *         description: Bad request, invalid email or missing information
   */
  app.post(forgotPasswordUrl, forgotPassword);
};
