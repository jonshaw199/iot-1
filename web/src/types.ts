export type Action<P = any> = {
  type: string;
  payload?: P;
};

export type ActionCreator<P> = (
  ...args: any
) => Action<P> | Promise<Action<P>> | undefined | null;

export type ActionCreators<P> = {
  [key: string]: ActionCreator<P>;
};
