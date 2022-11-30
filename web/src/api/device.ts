import {
  CreateDeviceRequest,
  DeviceResponse,
  DeviceListResponse,
} from "../serverTypes";
import { req } from "./api";

export function createDevice(device: CreateDeviceRequest) {
  return req<DeviceResponse>("/device", {
    method: "POST",
    body: JSON.stringify(device),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function getDeviceList() {
  return req<DeviceListResponse>("/device");
}
