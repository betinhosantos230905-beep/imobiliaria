import { createServerFn } from "@tanstack/react-start";
import {
  createPublicLead,
  type NewLeadInput,
} from "./leads.server";

export const submitLead = createServerFn({ method: "POST" })
  .validator((data: NewLeadInput) => data)
  .handler(async ({ data }) => {
    await createPublicLead(data);
    return { success: true };
  });
