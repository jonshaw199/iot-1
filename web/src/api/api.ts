import { Nullable } from "../serverTypes";

export async function req<T>(path: string, options?: Nullable<RequestInit>) {
  const optionsInternal = {
    ...options,
    headers: {
      ...options?.headers,
      token: localStorage.getItem("token") || "",
    },
  };
  const result = await fetch(
    `http://${process.env.REACT_APP_SERVER_ADDRESS}${path}`,
    optionsInternal
  );
  return (await result.json()) as T;
}
