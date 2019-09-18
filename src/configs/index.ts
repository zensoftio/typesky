export const BACKEND_PORT = 5000;

export const API_HOST = process.env.API_URL || `http://localhost:${BACKEND_PORT}`;

export const config = Object.freeze(
  {
    remoteApi: API_HOST,
    tokenApi: `${API_HOST}/api/auth/login`,
    refreshTokenApi: `${API_HOST}/api/auth/token`
  }
);
