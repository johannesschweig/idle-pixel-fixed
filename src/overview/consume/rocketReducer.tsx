import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RocketData } from "./useRocketObserver";
import { RootState } from "../../redux/store";

export interface RocketObserver {
  onChange: (distance: number) => void;
  item: string;
  id: string;
}


interface RocketState {
  observers: RocketObserver[];
}

const initialState: RocketState = {
  observers: [],
};

const removeObserver = (
  state: RocketState,
  observerId: string
) => {
  state.observers = state.observers.filter(
    (observer) => !(observer.id === observerId)
  );
  return state;
};


export const rocketSlice = createSlice({
  name: "Rocket",
  initialState: initialState,
  reducers: {
    addRocketObserver(state, action: PayloadAction<RocketObserver>) {
      removeObserver(state, action.payload.id)
      state.observers.push(action.payload);
    },
    removeRocketObserver(state, action: PayloadAction<string>) {
      removeObserver(state, action.payload)
    }
  },
});

export const { addRocketObserver, removeRocketObserver } = rocketSlice.actions;

export const selectRocketObservers = (state: RootState) => state.rocket.observers;

export default rocketSlice.reducer;
