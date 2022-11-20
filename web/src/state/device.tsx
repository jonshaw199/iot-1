import { Reducer, createContext } from "react";

import { Action } from "../types";
import { Device } from "../serverTypes";
import { getList, create } from "../api/device";
import useReducerWithActions from "../hooks/useReducerWithActions";

export enum DeviceActionType {
  GET_LIST = "GET_LIST",
  CREATE = "CREATE",
}

type DevicePayload = {
  devices?: Device[];
  device?: Device;
};

type DeviceState = {
  devices: Map<string, Device>;
  errorMsg: string;
};

const initialDeviceState: DeviceState = {
  devices: new Map(),
  errorMsg: "",
};

type DeviceActionCreators = {
  getList: () => Promise<Action<DevicePayload>>;
  create: (device: Partial<Device>) => Promise<Action<DevicePayload>>;
};

const deviceActionCreators: DeviceActionCreators = {
  getList: () =>
    getList().then((devices) => ({
      type: DeviceActionType.GET_LIST,
      payload: { devices },
    })),
  create: (device: Partial<Device>) =>
    create(device).then(({ device }) => ({
      type: DeviceActionType.CREATE,
      payload: { device },
    })),
};

const deviceReducer: Reducer<DeviceState, Action<DevicePayload>> = (
  state,
  action
) => {
  state.errorMsg = "";
  try {
    switch (action.type) {
      case DeviceActionType.CREATE:
        if (action.payload?.device) {
          state = {
            ...state,
            devices: new Map(state.devices).set(
              action.payload.device._id.toString(),
              action.payload.device
            ),
          };
        } else {
          throw new Error("No device");
        }
        break;
      case DeviceActionType.GET_LIST:
        if (action.payload?.devices) {
          state = {
            ...state,
            devices: action.payload.devices.reduce(
              (prev, cur) => prev.set(cur._id, cur),
              new Map()
            ),
          };
        } else {
          throw new Error("No device list");
        }
        break;
    }
  } catch (e) {
    if (typeof e === "string") {
      state.errorMsg = e;
    }
  }
  return state;
};

export function useDeviceState() {
  return useReducerWithActions<
    DeviceState,
    DevicePayload,
    DeviceActionCreators
  >({
    reducer: deviceReducer,
    initialState: initialDeviceState,
    actionCreators: deviceActionCreators,
  });
}

export const GlobalDeviceContext = createContext({
  ...initialDeviceState,
  ...deviceActionCreators,
});
