import { Nullable } from "@backend/types";

export async function req<T>(path: string, options?: Nullable<RequestInit>) {
  const optionsInternal = {
    ...options,
    headers: {
      ...options?.headers,
      token: localStorage.getItem("token") || "",
    },
  };
  const result = await fetch(`http://localhost:3000${path}`, optionsInternal);
  return (await result.json()) as T;
}
