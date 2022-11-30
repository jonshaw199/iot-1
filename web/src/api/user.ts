import {
  UserResponse,
  User,
  AuthResponse,
  AuthRequest,
  CreateUserResponse,
  UserRequest,
  UserListResponse,
} from "../serverTypes";
import { req } from "./api";

export function createUser(user: UserRequest) {
  return req<CreateUserResponse>("/user", {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function updateUser(id: string, user: Partial<User>) {
  return req<UserResponse>(`/user${id}`, {
    method: "PUT",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function removeUser(id: string) {
  return req<UserResponse>(`/user/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function getUserList() {
  return req<UserListResponse>("/user");
}

export function getUser(id: string) {
  return req<UserResponse>(`/user/${id}`);
}

export function auth(body: AuthRequest) {
  return req<AuthResponse>("/user/authenticate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

export function authWithToken() {
  return req<AuthResponse>("/user/authWithToken", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
}
