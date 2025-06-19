const REFRESH_TOKEN_KEY = 'refresh_token';
const TOKEN_KEY = 'jwt_token_with_activity';

type TokenWithActivity = {
  token: string;
  lastActivity: number;
};

export const saveTokens = (token: string, refreshToken: string) => {
  const tokenWithActivity: TokenWithActivity = {
    token,
    lastActivity: Date.now(),
  };
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokenWithActivity));
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const getToken = (): string | null => {
  const tokenStr = localStorage.getItem(TOKEN_KEY);
  if (!tokenStr) return null;
  try {
    const { token } = JSON.parse(tokenStr) as TokenWithActivity;
    return token;
  } catch {
    return null;
  }
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refresh_token');
};

export const updateTokenActivity = () => {
  const tokenStr = localStorage.getItem(TOKEN_KEY);
  if (!tokenStr) return;
  try {
    const tokenObj = JSON.parse(tokenStr) as TokenWithActivity;
    tokenObj.lastActivity = Date.now();
    localStorage.setItem(TOKEN_KEY, JSON.stringify(tokenObj));
  } catch {}
};

export const getTokenLastActivity = (): number | null => {
  const tokenStr = localStorage.getItem(TOKEN_KEY);
  if (!tokenStr) return null;
  try {
    const { lastActivity } = JSON.parse(tokenStr) as TokenWithActivity;
    return lastActivity;
  } catch {
    return null;
  }
};

export const removeTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const parseJwt = (token: string): any => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};
