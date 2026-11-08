import { createServerFn } from "@tanstack/react-start";
import {
  listAdminProperties,
  listAdminLeads,
  setAdminPropertyPublished,
  deleteAdminProperty,
} from "./admin.server";

export const getAdminProperties = createServerFn({ method: "GET" })
  .handler(async () => listAdminProperties());

export const getAdminLeads = createServerFn({ method: "GET" })
  .handler(async () => listAdminLeads());

export const updateAdminPropertyPublished = createServerFn({ method: "POST" })
  .validator((data: { id: string; published: boolean }) => data)
  .handler(async ({ data }) => {
    await setAdminPropertyPublished(data.id, data.published);
    return { success: true };
  });

export const removeAdminProperty = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await deleteAdminProperty(data.id);
    return { success: true };
  });

import {
  saveAdminProperty,
  createCloudinaryUploadSignature,
} from "./admin.server";

export const saveAdminPropertyFn = createServerFn({ method: "POST" })
  .validator((data: Parameters<typeof saveAdminProperty>[0]) => data)
  .handler(async ({ data }) => saveAdminProperty(data));

export const getCloudinaryUploadSignature = createServerFn({ method: "POST" })
  .handler(async () => createCloudinaryUploadSignature());
