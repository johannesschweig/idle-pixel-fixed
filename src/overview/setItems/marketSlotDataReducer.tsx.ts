import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MarketData } from "./useSetItemsObserver";

import { RootState } from "../../redux/store";

export interface MarketSlotDataObserver {
  onChange: (data: MarketData) => void;
  item: string;
  id: string;
}


interface MarketSlotDataState {
  observers: MarketSlotDataObserver[];
}

const initialState: MarketSlotDataState = {
  observers: [],
};

const removeObserver = (
  state: MarketSlotDataState,
  observerId: string
) => {
  state.observers = state.observers.filter(
    (observer) => !(observer.id === observerId)
  );
  return state;
};


export const marketSlotDataSlice = createSlice({
  name: "Set items",
  initialState: initialState,
  reducers: {
    addMarketSlotDataObserver(state, action: PayloadAction<MarketSlotDataObserver>) {
      removeObserver(state, action.payload.id)
      state.observers.push(action.payload);
    },
    removeMarketSlotDataObserver(state, action: PayloadAction<string>) {
      removeObserver(state, action.payload)
    }
  },
});

export const { addMarketSlotDataObserver, removeMarketSlotDataObserver } = marketSlotDataSlice.actions;

export const selectMarketSlotDataObservers = (state: RootState) => state.marketSlotData.observers;

export default marketSlotDataSlice.reducer;
