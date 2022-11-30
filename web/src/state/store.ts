import { configureStore } from "@reduxjs/toolkit";
import {
  TypedUseSelectorHook,
  useDispatch as useDispatchUntyped,
  useSelector as useSelectorUntyped,
} from "react-redux";

import userReducer from "./userSlice";
import orgReducer from "./orgSlice";
import deviceReducer from "./deviceSlice";
import messageRouter from "./messageSlice";

const store = configureStore({
  reducer: {
    users: userReducer,
    orgs: orgReducer,
    devices: deviceReducer,
    messages: messageRouter,
  },
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useDispatch: () => AppDispatch = useDispatchUntyped;
export const useSelector: TypedUseSelectorHook<RootState> = useSelectorUntyped;
