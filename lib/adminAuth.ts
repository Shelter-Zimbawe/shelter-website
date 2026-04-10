import { NextRequest } from "next/server";

export const ADMIN_SESSION_COOKIE = "admin_session";

function getAdminSecret() {
  return process.env.ADMIN_SECRET || "";
}

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "";
}

export function isAdminConfigured() {
  return Boolean(getAdminSecret() && getAdminPassword());
}

export function createAdminSessionValue() {
  return getAdminSecret();
}

export function isValidAdminSession(sessionValue?: string | null) {
  if (!sessionValue || !isAdminConfigured()) return false;
  return sessionValue === getAdminSecret();
}

export function isValidAdminPassword(password: string) {
  if (!isAdminConfigured()) return false;
  return password === getAdminPassword();
}

export function hasAdminSession(request: NextRequest) {
  return isValidAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
}
