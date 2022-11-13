import {
  UserResponse,
  User,
  AuthResponse,
  AuthRequest,
  CreateUserResponse,
} from "../serverTypes";
import { req } from "./api";

export function create(user: Partial<User>) {
  return req<CreateUserResponse>("/user", {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function update(id: string, user: Partial<User>) {
  return req<UserResponse>(`/user${id}`, {
    method: "PUT",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function remove(id: string) {
  return req<UserResponse>(`/user/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function getList() {
  return req<User[]>("/user");
}

export function get(id: string) {
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
