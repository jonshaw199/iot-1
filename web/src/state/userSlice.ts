import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
  CreateUserResponse,
  Nullable,
  User,
  UserResponse,
  UserListResponse,
  AuthResponse,
  CreateUserRequest,
  AuthRequest,
} from "../serverTypes";
import {
  getUserList,
  getUser,
  createUser,
  removeUser,
  updateUser,
  auth as authApi,
  authWithToken,
} from "../api/user";
import type { RootState } from "../state/store";

// Define a type for the slice state
interface UserState {
  users: Map<string, User>;
  errorMsg: string;
  token: string;
  currentUser?: Nullable<User>;
}

// Define the initial state using that type
const initialState: UserState = {
  users: new Map(),
  errorMsg: "",
  token: "",
};

const createThunk = createAsyncThunk(
  "user/create",
  (userReq: CreateUserRequest) => createUser(userReq)
);

const updateThunk = createAsyncThunk(
  "user/update",
  ({ id, user }: { id: string; user: Partial<User> }) => updateUser(id, user)
);

const getThunk = createAsyncThunk("user/get", (id: string) => getUser(id));

const removeThunk = createAsyncThunk("user/remove", (id: string) =>
  removeUser(id)
);

const getListThunk = createAsyncThunk("user/getList", () => getUserList());

const authThunk = createAsyncThunk("user/auth", (body: AuthRequest) =>
  authApi(body)
);

const authWithTokenThunk = createAsyncThunk("user/authWithToken", () =>
  authWithToken()
);

const createReducer = (
  state: UserState,
  action: PayloadAction<CreateUserResponse>
) => {
  state.users = new Map(state.users).set(
    action.payload.user._id.toString(),
    action.payload.user
  );
};

const updateReducer = (
  state: UserState,
  action: PayloadAction<UserResponse>
) => {
  state.users = new Map(state.users).set(
    action.payload.user._id.toString(),
    action.payload.user
  );
};

const getReducer = (state: UserState, action: PayloadAction<UserResponse>) => {
  state.users = new Map(state.users).set(
    action.payload.user._id.toString(),
    action.payload.user
  );
};

const removeReducer = (
  state: UserState,
  action: PayloadAction<UserResponse>
) => {
  state.users = new Map(state.users).set(
    action.payload.user._id.toString(),
    action.payload.user
  );
};

const getListReducer = (
  state: UserState,
  action: PayloadAction<UserListResponse>
) => {
  state.users = action.payload.users.reduce(
    (prev, cur) => prev.set(cur._id, cur),
    new Map()
  );
};

const authReducer = (state: UserState, action: PayloadAction<AuthResponse>) => {
  state.token = action.payload.token;
  state.currentUser = action.payload.user;
  localStorage.setItem("token", state.token);
};

const logoutReducer = (state: UserState, action: PayloadAction) => {
  state.token = "";
  localStorage.removeItem("token");
};

export const userSlice = createSlice({
  name: "user",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    create: createReducer,
    update: updateReducer,
    get: getReducer,
    remove: removeReducer,
    getList: getListReducer,
    auth: authReducer,
    logout: logoutReducer,
  },
  extraReducers: (builder) => {
    builder.addCase(createThunk.fulfilled, createReducer);
    builder.addCase(updateThunk.fulfilled, updateReducer);
    builder.addCase(getThunk.fulfilled, getReducer);
    builder.addCase(removeThunk.fulfilled, removeReducer);
    builder.addCase(getListThunk.fulfilled, getListReducer);
    builder.addCase(authThunk.fulfilled, authReducer);
    builder.addCase(authWithTokenThunk.fulfilled, authReducer);
  },
});

export const { auth, create, get, getList, logout, remove, update } =
  userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value;

export default userSlice.reducer;
