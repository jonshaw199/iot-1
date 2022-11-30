import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
  OrgListResponse,
  Device,
  CreateDeviceRequest,
  DeviceResponse,
  DeviceListResponse,
} from "../serverTypes";
import {
  createDevice as createDeviceApi,
  getDeviceList as getDeviceListApi,
} from "../api/device";
import type { RootState } from "../state/store";

// Define a type for the slice state
interface DeviceState {
  devices: Map<string, Device>;
  errorMsg: string;
}

// Define the initial state using that type
const initialState: DeviceState = {
  devices: new Map(),
  errorMsg: "",
};

// Thunks

const createDeviceThunk = createAsyncThunk(
  "device/create",
  (device: CreateDeviceRequest) => createDeviceApi(device)
);

const getDeviceListThunk = createAsyncThunk("device/getList", () =>
  getDeviceListApi()
);

// Reducers

const createDeviceReducer = (
  state: DeviceState,
  action: PayloadAction<DeviceResponse>
) => {
  state.devices = new Map(state.devices).set(
    action.payload.device._id.toString(),
    action.payload.device
  );
};

const getDeviceListReducer = (
  state: DeviceState,
  action: PayloadAction<DeviceListResponse>
) => {
  state.devices = action.payload.devices.reduce(
    (prev, cur) => prev.set(cur._id, cur),
    new Map()
  );
};

export const deviceSlice = createSlice({
  name: "device",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    createDevice: createDeviceReducer,
    getDeviceList: getDeviceListReducer,
  },
  extraReducers: (builder) => {
    builder.addCase(createDeviceThunk.fulfilled, createDeviceReducer);
    builder.addCase(getDeviceListThunk.fulfilled, getDeviceListReducer);
  },
});

export const { createDevice, getDeviceList } = deviceSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const devices = (state: RootState) => state.devices.devices;

export { createDeviceThunk, getDeviceListThunk };

export default deviceSlice.reducer;
