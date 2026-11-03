import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";
import {
  isAdminAuthenticated,
  loginAdmin,
  logoutAdmin,
} from "./auth.server";

export const adminLogin = createServerFn({ method: "POST" })
  .validator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    const ip = getRequestIP({ xForwardedFor: true }) ?? "unknown";
    const authenticated = await loginAdmin(data.password, ip);

    return { authenticated };
  });

export const getAdminSession = createServerFn({ method: "GET" })
  .handler(async () => {
    return { authenticated: isAdminAuthenticated() };
  });

export const adminLogout = createServerFn({ method: "POST" })
  .handler(async () => {
    logoutAdmin();
    return { success: true };
  });
