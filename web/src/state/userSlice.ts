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
  users: { [key: string]: User };
  errorMsg: string;
  token: string;
  currentUser?: Nullable<User>;
}

// Define the initial state using that type
const initialState: UserState = {
  users: {},
  errorMsg: "",
  token: "",
};

// Thunks

const createUserThunk = createAsyncThunk(
  "user/create",
  (userReq: CreateUserRequest) => createUser(userReq)
);

const updateUserThunk = createAsyncThunk(
  "user/update",
  ({ id, user }: { id: string; user: Partial<User> }) => updateUser(id, user)
);

const getUserThunk = createAsyncThunk("user/get", (id: string) => getUser(id));

const removeUserThunk = createAsyncThunk("user/remove", (id: string) =>
  removeUser(id)
);

const getUserListThunk = createAsyncThunk("user/getList", () => getUserList());

const authThunk = createAsyncThunk("user/auth", (body: AuthRequest) =>
  authApi(body)
);

const authWithTokenThunk = createAsyncThunk("user/authWithToken", () =>
  authWithToken()
);

// Reducers

const createReducer = (
  state: UserState,
  action: PayloadAction<CreateUserResponse>
) => {
  state.users = {
    ...state.users,
    [action.payload.user._id.toString()]: action.payload.user,
  };
};

const updateReducer = (
  state: UserState,
  action: PayloadAction<UserResponse>
) => {
  state.users = {
    ...state.users,
    [action.payload.user._id.toString()]: action.payload.user,
  };
};

const getReducer = (state: UserState, action: PayloadAction<UserResponse>) => {
  state.users = {
    ...state.users,
    [action.payload.user._id.toString()]: action.payload.user,
  };
};

const removeReducer = (
  state: UserState,
  action: PayloadAction<UserResponse>
) => {
  delete state.users[action.payload.user._id.toString()];
};

const getListReducer = (
  state: UserState,
  action: PayloadAction<UserListResponse>
) => {
  state.users = action.payload.users.reduce(
    (prev: { [key: string]: User }, cur) => {
      prev[cur._id.toString()] = cur;
      return prev;
    },
    {}
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
    builder.addCase(createUserThunk.fulfilled, createReducer);
    builder.addCase(updateUserThunk.fulfilled, updateReducer);
    builder.addCase(getUserThunk.fulfilled, getReducer);
    builder.addCase(removeUserThunk.fulfilled, removeReducer);
    builder.addCase(getUserListThunk.fulfilled, getListReducer);
    builder.addCase(authThunk.fulfilled, authReducer);
    builder.addCase(authWithTokenThunk.fulfilled, authReducer);
  },
});

export const { auth, create, get, getList, logout, remove, update } =
  userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const users = (state: RootState) => state.users.users;
export const currentUser = (state: RootState) => state.users.currentUser;
export const token = (state: RootState) => state.users.token;

export {
  authThunk,
  createUserThunk,
  getUserThunk,
  getUserListThunk,
  removeUserThunk,
  updateUserThunk,
  authWithTokenThunk,
};

export default userSlice.reducer;
