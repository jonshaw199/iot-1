import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
  Org,
  CreateOrgRequest,
  OrgResponse,
  OrgListResponse,
} from "../serverTypes";
import {
  getOrgList as getOrgListApi,
  createOrg as createOrgApi,
} from "../api/org";
import type { RootState } from "../state/store";

// Define a type for the slice state
interface OrgState {
  orgs: Map<string, Org>;
  errorMsg: string;
}

// Define the initial state using that type
const initialState: OrgState = {
  orgs: new Map(),
  errorMsg: "",
};

// Thunks

const createOrgThunk = createAsyncThunk("org/create", (org: CreateOrgRequest) =>
  createOrgApi(org)
);

const getOrgListThunk = createAsyncThunk("org/getList", () => getOrgListApi());

// Reducers

const createOrgReducer = (
  state: OrgState,
  action: PayloadAction<OrgResponse>
) => {
  state.orgs = new Map(state.orgs).set(
    action.payload.org._id.toString(),
    action.payload.org
  );
};

const getOrgListReducer = (
  state: OrgState,
  action: PayloadAction<OrgListResponse>
) => {
  state.orgs = action.payload.orgs.reduce(
    (prev, cur) => prev.set(cur._id, cur),
    new Map()
  );
};

export const orgSlice = createSlice({
  name: "org",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    createOrg: createOrgReducer,
    getOrgList: getOrgListReducer,
  },
  extraReducers: (builder) => {
    builder.addCase(createOrgThunk.fulfilled, createOrgReducer);
    builder.addCase(getOrgListThunk.fulfilled, getOrgListReducer);
  },
});

export const { createOrg, getOrgList } = orgSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const orgs = (state: RootState) => state.orgs.orgs;

export { createOrgThunk, getOrgListThunk };

export default orgSlice.reducer;
