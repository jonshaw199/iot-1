import {
  OrgResponse,
  OrgListResponse,
  Org,
  CreateOrgRequest,
} from "../serverTypes";
import { req } from "./api";

export function createOrg(org: CreateOrgRequest) {
  return req<OrgResponse>("/org", {
    method: "POST",
    body: JSON.stringify(org),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function getOrgList() {
  return req<OrgListResponse>("/org");
}
