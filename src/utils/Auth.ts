import { getCurrentUser } from "../services/userService";
import { User } from "../types/userType";

const TOKEN_KEY = 'jwt_token_with_activity';

type TokenWithActivity = {
  token: string;
  lastActivity: number;
};

export const saveToken = (token: string) => {
  const tokenWithActivity: TokenWithActivity = {
    token,
    lastActivity: Date.now(),
  };
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokenWithActivity));
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

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const parseJwt = (token: string): any => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};
