import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
  CreateUserResponse,
  Nullable,
  User,
  UserResponse,
  UserListResponse,
  AuthResponse,
  UserRequest,
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

const createThunk = createAsyncThunk("user/create", (userReq: UserRequest) =>
  createUser(userReq)
);

const updateThunk = createAsyncThunk("user/update", (userReq: UserRequest) =>
  updateUser(userReq)
);

export const userSlice = createSlice({
  name: "user",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    create: (state, action: PayloadAction<CreateUserResponse>) => {
      state.users = new Map(state.users).set(
        action.payload.user._id.toString(),
        action.payload.user
      );
    },
    update: (state, action: PayloadAction<UserResponse>) => {
      state.users = new Map(state.users).set(
        action.payload.user._id.toString(),
        action.payload.user
      );
    },
    get: (state, action: PayloadAction<UserResponse>) => {
      state.users = new Map(state.users).set(
        action.payload.user._id.toString(),
        action.payload.user
      );
    },
    remove: (state, action: PayloadAction<UserResponse>) => {
      state.users = new Map(state.users).set(
        action.payload.user._id.toString(),
        action.payload.user
      );
    },
    getList: (state, action: PayloadAction<UserListResponse>) => {
      state.users = action.payload.users.reduce(
        (prev, cur) => prev.set(cur._id, cur),
        new Map()
      );
    },
    auth: (state, action: PayloadAction<AuthResponse>) => {
      state.token = action.payload.token;
      state.currentUser = action.payload.user;
      localStorage.setItem("token", state.token);
    },
    logout: (state, action: PayloadAction) => {
      state.token = "";
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createThunk.fulfilled, (state, action) => {
      state.users.set(action.payload.user._id.toString(), action.payload.user);
    });
  },
});

export const { auth, create, get, getList, logout, remove, update } =
  userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value;

export default userSlice.reducer;
