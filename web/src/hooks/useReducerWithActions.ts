import { useReducer, useCallback, Reducer } from "react";
import { Action, ActionCreators } from "../types";

const useReducerWithActions = <S, P, A extends ActionCreators<P>>({
  reducer,
  initialState,
  actionCreators,
}: {
  reducer: Reducer<S, Action<P>>;
  initialState: S;
  actionCreators: A;
}) => {
  const [value, dispatch] = useReducer(reducer, initialState);

  const wrappedActionCreators: A = Object.keys(actionCreators).reduce(
    (prev, actionKey) => ({
      ...prev,
      // eslint-disable-next-line react-hooks/rules-of-hooks
      [actionKey]: useCallback(
        (...args) =>
          Promise.resolve(actionCreators[actionKey](...args)).then((result) => {
            if (result) {
              dispatch(result);
            }
          }),
        [actionKey]
      ),
    }),
    actionCreators
  );

  return {
    ...value,
    ...wrappedActionCreators,
    dispatch,
  };
};

export default useReducerWithActions;
