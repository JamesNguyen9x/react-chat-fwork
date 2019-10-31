import Cookies from 'js-cookie';

export const JWT_TOKEN = process.env.JWT_TOKEN || 'fwork-token';

const expires = 1;
export function getSessionToken () {
  return Cookies.get(JWT_TOKEN);
}

export function resetSessionToken () {
  Cookies.remove(JWT_TOKEN);
}

export function setSessionToken (token) {
  Cookies.set(JWT_TOKEN, token, {
    expires
    // secure: process.env.NODE_ENV === 'production',
  });
}
export function getLocalToken () {
  return localStorage.getItem(JWT_TOKEN);
}
export function removeLocalToken () {
  return localStorage.removeItem(JWT_TOKEN);
}
export function setLocalToken (token) {
  localStorage.setItem(JWT_TOKEN, token);
}

export function getToken () {
  return getSessionToken();
}

export function removeToken () {
  return resetSessionToken() || removeLocalToken();
}
