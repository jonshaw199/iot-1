import { Reducer, createContext } from "react";

import { Action } from "../types";
import { AuthRequest, Nullable, User } from "../serverTypes";
import {
  getList,
  get,
  create,
  remove,
  update,
  auth,
  authWithToken,
} from "../api/user";
import useReducerWithActions from "../hooks/useReducerWithActions";

enum UserActionType {
  GET_LIST = "GET_LIST",
  GET = "GET",
  UPDATE = "UPDATE",
  CREATE = "CREATE",
  REMOVE = "REMOVE",
  AUTH = "AUTH",
  LOGOUT = "LOGOUT",
}

type UserPayload = {
  user?: User;
  users?: User[];
  token?: string;
};

type UserState = {
  users: Map<string, User>;
  errorMsg: string;
  token: string;
  currentUser?: Nullable<User>;
};

const initialUserState: UserState = {
  users: new Map(),
  errorMsg: "",
  token: "",
};

type UserActionCreators = {
  getList: () => Promise<Action<UserPayload>>;
  get: (id: string) => Promise<Action<UserPayload>>;
  create: (user: Partial<User>) => Promise<Action<UserPayload>>;
  update: (id: string, user: Partial<User>) => Promise<Action<UserPayload>>;
  remove: (id: string) => Promise<Action<UserPayload>>;
  auth: (cred: AuthRequest) => Promise<Action<UserPayload>>;
  logout: () => Action;
  authWithToken: () => Nullable<Promise<Action<UserPayload>>>;
};

const userActionCreators: UserActionCreators = {
  getList: () =>
    getList().then((users) => ({
      type: UserActionType.GET_LIST,
      payload: { users },
    })),
  get: (id: string) =>
    get(id).then(({ user }) => ({
      type: UserActionType.GET,
      payload: { user },
    })),
  create: (user: Partial<User>) =>
    create(user).then(({ user, token }) => ({
      type: UserActionType.CREATE,
      payload: { user, token },
    })),
  update: (id: string, user: Partial<User>) =>
    update(id, user).then(({ user }) => ({
      type: UserActionType.UPDATE,
      payload: { user },
    })),
  remove: (id: string) =>
    remove(id).then(({ user }) => ({
      type: UserActionType.REMOVE,
      payload: { user },
    })),
  auth: (cred: AuthRequest) =>
    auth(cred).then(({ token, user }) => ({
      type: UserActionType.AUTH,
      payload: { token, user },
    })),
  logout: () => ({ type: UserActionType.LOGOUT }),
  authWithToken: () =>
    authWithToken().then(({ token, user }) => ({
      type: UserActionType.AUTH,
      payload: { token, user },
    })),
};

const userReducer: Reducer<UserState, Action<UserPayload>> = (
  state,
  action
) => {
  state.errorMsg = "";
  try {
    switch (action.type) {
      case UserActionType.CREATE:
      case UserActionType.GET:
      case UserActionType.UPDATE:
        if (action.payload?.user) {
          state = {
            ...state,
            users: new Map(state.users).set(
              action.payload.user._id.toString(),
              action.payload.user
            ),
          };
          // token on create?
        } else {
          throw new Error("No user");
        }
        break;
      case UserActionType.REMOVE:
        if (action.payload?.user) {
          state = { ...state, users: new Map(state.users) };
          state.users.delete(action.payload.user._id.toString());
        } else {
          throw new Error("No user removed");
        }
        break;
      case UserActionType.GET_LIST:
        if (action.payload?.users) {
          state = {
            ...state,
            users: action.payload.users.reduce(
              (prev, cur) => prev.set(cur._id, cur),
              new Map()
            ),
          };
        } else {
          throw new Error("No user list");
        }
        break;
      case UserActionType.AUTH:
        if (action.payload?.token) {
          state = {
            ...state,
            token: action.payload.token,
            currentUser: action.payload.user,
          };
          localStorage.setItem("token", action.payload.token);
        } else {
          localStorage.removeItem("token");
          throw new Error("No token");
        }
        break;
      case UserActionType.LOGOUT:
        state = { ...state, token: "" };
        localStorage.removeItem("token");
        break;
    }
  } catch (e) {
    if (typeof e === "string") {
      state.errorMsg = e;
    }
  }
  return state;
};

export function useUserState() {
  return useReducerWithActions<UserState, UserPayload, UserActionCreators>({
    reducer: userReducer,
    initialState: initialUserState,
    actionCreators: userActionCreators,
  });
}

export const GlobalUserContext = createContext({
  ...initialUserState,
  ...userActionCreators,
});
