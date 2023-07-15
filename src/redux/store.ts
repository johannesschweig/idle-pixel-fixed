import { configureStore } from "@reduxjs/toolkit";
import activityLogReducer from "../activitylog/activityLogReducer";
import localStorageReducer from "../util/localstorage/localStorageReducer";
import websocketReducer from "../util/websocket/websocketReducer";
import overviewReducer from "../overview/overviewReducer";
import setItemsReducer from "../overview/setItems/setItemsReducer";
import keyboardReducer from "../util/keyboard/keyboardReducer";
import modiferKeyReducer, {modifierKeySlice} from "../util/keyboard/modiferKeyReducer";
import marketSlotDataReducer from "../overview/setItems/marketSlotDataReducer.tsx";
import rocketReducer from "../overview/mining/rocketReducer";

export const store = configureStore({
  reducer: {
    activityLog: activityLogReducer,
    localStorage: localStorageReducer,
    websocket: websocketReducer,
    overview: overviewReducer,
    setItems: setItemsReducer,
    marketSlotData: marketSlotDataReducer, 
    rocket: rocketReducer,
    keyboard: keyboardReducer,
    modifierKey: modiferKeyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
