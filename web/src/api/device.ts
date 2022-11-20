import { Device, DeviceResponse } from "../serverTypes";
import { req } from "./api";

export function create(device: Partial<Device>) {
  return req<DeviceResponse>("/device", {
    method: "POST",
    body: JSON.stringify(device),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function getList() {
  return req<Device[]>("/device");
}
