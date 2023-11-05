export const version = `/api/v1`;

export const healthCheckUrl = `${version}/healthCheck`;

//auth
export const registerUrl = `${version}/register`;
export const loginUrl = `${version}/login`;
export const logoutUrl = `${version}/logout`;
export const verifyEmailUrl = `${version}/verify-email`;
export const resetPasswordUrl = `${version}/reset-password`;
export const forgotPasswordUrl = `${version}/forgot-password`;

//admin
export const getAllUsersUrl = `${version}/users`
export const getUserById = `${version}/user/:id`