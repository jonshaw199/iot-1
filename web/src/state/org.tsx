import { Reducer, createContext } from "react";

import { Action } from "../types";
import { Nullable, Org } from "../serverTypes";
import { getList, create } from "../api/org";
import useReducerWithActions from "../hooks/useReducerWithActions";

export enum OrgActionType {
  GET_LIST = "GET_LIST",
  CREATE = "CREATE",
}

type OrgPayload = {
  orgs?: Org[];
  org?: Org;
};

type OrgState = {
  orgs: Map<string, Org>;
  errorMsg: string;
};

const initialOrgState: OrgState = {
  orgs: new Map(),
  errorMsg: "",
};

type OrgActionCreators = {
  getList: () => Promise<Action<OrgPayload>>;
  create: (org: Partial<Org>) => Promise<Action<OrgPayload>>;
};

const orgActionCreators: OrgActionCreators = {
  getList: () =>
    getList().then((orgs) => ({
      type: OrgActionType.GET_LIST,
      payload: { orgs },
    })),
  create: (org: Partial<Org>) =>
    create(org).then(({ org }) => ({
      type: OrgActionType.CREATE,
      payload: { org },
    })),
};

const orgReducer: Reducer<OrgState, Action<OrgPayload>> = (state, action) => {
  state.errorMsg = "";
  try {
    switch (action.type) {
      case OrgActionType.CREATE:
        if (action.payload?.org) {
          state = {
            ...state,
            orgs: new Map(state.orgs).set(
              action.payload.org.id,
              action.payload.org
            ),
          };
        } else {
          throw new Error("No org");
        }
        break;
      case OrgActionType.GET_LIST:
        if (action.payload?.orgs) {
          state = {
            ...state,
            orgs: action.payload.orgs.reduce(
              (prev, cur) => prev.set(cur.id, cur),
              new Map()
            ),
          };
        } else {
          throw new Error("No org list");
        }
        break;
    }
  } catch (e) {
    if (typeof e === "string") {
      state.errorMsg = e;
    }
  }
  return state;
};

export function useOrgState() {
  return useReducerWithActions<OrgState, OrgPayload, OrgActionCreators>({
    reducer: orgReducer,
    initialState: initialOrgState,
    actionCreators: orgActionCreators,
  });
}

export const GlobalOrgContext = createContext({
  ...initialOrgState,
  ...orgActionCreators,
});
