import { createServerFn } from "@tanstack/react-start";
import {
  listPublishedProperties,
  listFeaturedProperties,
  findPublishedProperty,
} from "./properties.server";

export const getProperties = createServerFn({ method: "GET" })
  .validator((filters: {
    purpose?: string | undefined;
    type?: string | undefined;
    q?: string | undefined;
  }) => filters)
  .handler(async ({ data }) => {
    return listPublishedProperties(data);
  });

export const getFeaturedProperties = createServerFn({ method: "GET" })
  .handler(async () => {
    return listFeaturedProperties();
  });

export const getPropertyById = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data }) => {
    return findPublishedProperty(data);
  });



