import { CreateOrgResponse, Org } from "../serverTypes";
import { req } from "./api";

export function create(org: Partial<Org>) {
  return req<CreateOrgResponse>("/org", {
    method: "POST",
    body: JSON.stringify(org),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function getList() {
  return req<Org[]>("/org");
}
