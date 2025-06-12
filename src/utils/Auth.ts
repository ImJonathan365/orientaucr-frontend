import { User } from '../types/userType';

export const saveUserToLocalStorage = (user: User) => {
  const userWithActivity = { ...user, lastActivity: Date.now() };
  localStorage.setItem('user', JSON.stringify(userWithActivity));
};

export const getUserFromLocalStorage = (): (User & { lastActivity?: number }) | null => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) as User & { lastActivity?: number } : null;
};

export const logoutUser = () => {
  localStorage.removeItem('user');
};