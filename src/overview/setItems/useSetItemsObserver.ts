import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useIPFDispatch, useIPFSelector } from "../../redux/hooks";
import {
  addSetItemsObserver,
  removeSetItemsObserver,
  selectSetItemsObservers,
} from "./setItemsReducer";
import {
  observeWebSocketMessage,
  useWebsocket,
} from "../../util/websocket/useWebsocket";
import { reduceToRecord } from "../../util/arrayUtils";
import {
  addMarketSlotDataObserver,
  removeMarketSlotDataObserver,
  selectMarketSlotDataObservers
} from "./marketSlotDataReducer.tsx"

interface Data {
  name: string;
  value: string;
}
export interface MarketData {
  slot: number
  name: string
  amount: number
  price: number
  sold: number
  type: string
  timestamp: number
}

export const useNumberItemObserver = (
  item: string,
  id: string,
  specialCase: (value: number) => boolean = (_) => false
): [number, (newValue: number) => void] => {
  const [value, setValue] = useItemObserver(item, id, (value) =>
    specialCase(Number(value))
  );

  return [
    Number(value),
    (newValue: number) => {
      Items.set(item, newValue.toString());
      setValue(newValue.toString());
    },
  ];
};

export const useItemObserver = (
  item: string,
  id: string,
  specialCase: (value: string) => boolean = (_) => false
): [string, (newValue: string) => void] => {
  const [value, setValue] = useState(Items.getItem(item).toString());
  const trueValue = useRef(Items.getItem(item).toString());

  const itemId = `${id}-${item}`;

  const [forceTrueValueTimeout, setForceTrueValueTimeout] =
    useState<NodeJS.Timeout | null>(null);

  const setTrueValue = useCallback(
    (newValue: string) => {
      const override = specialCase(newValue);
      if (override) {
        setValue(newValue);
      } else if (value === trueValue.current) {
        setValue(newValue);
      } else {
        if (!forceTrueValueTimeout) {
          setForceTrueValueTimeout(
            setTimeout(() => {
              setValue(trueValue.current);
              setForceTrueValueTimeout(null);
            }, 3000)
          );
        }
      }
      trueValue.current = newValue;
    },
    [
      setValue,
      forceTrueValueTimeout,
      setForceTrueValueTimeout,
      value,
      trueValue,
    ]
  );

  const dispatch = useIPFDispatch();

  useEffect(() => {
    dispatch(
      addSetItemsObserver({
        onChange: setTrueValue,
        item,
        id: itemId,
      })
    );
    return () => {
      dispatch(removeSetItemsObserver(itemId));
    };
  }, [setTrueValue, item, id]);

  return [value, setValue];
};

export const useSetItemsObserver = () => {
  const observers = useIPFSelector(selectSetItemsObservers);

  const onMessage = useMemo(
    () =>
      observeWebSocketMessage("SET_ITEMS", (dataString: string) => {
        const data = reduceToRecord<Data>(dataString.split("~"), [
          (value) => ({ name: value }),
          (value) => ({ value: value }),
        ]);
        observers.forEach((observer) => {
          data.forEach((d) => {
            if (d.name === observer.item) {
              observer.onChange(d.value);
            }
          });
        });
      }),
    [observers]
  );
  useWebsocket(onMessage, 10, "setItems");
};

export const useMarketSlotDataObserver = (
  item: string,
  id: string,
  specialCase: (values: MarketData) => boolean = (_) => false
): [MarketData, (newValue: MarketData) => void] => {
  const [values, setValues] = useState<MarketData>({
    slot: 0,
    name: '',
    amount: 0,
    price: 0,
    sold: 0,
    type: '',
    timestamp: 0,
  });
  const trueValues = useRef<MarketData>({
    slot: 0,
    name: '',
    amount: 0,
    price: 0,
    sold: 0,
    type: '',
    timestamp: 0,
  });

  const itemId = `${id}-${item}`;

  const [forceTrueValueTimeout, setForceTrueValueTimeout] =
    useState<NodeJS.Timeout | null>(null);

  const setTrueValues = useCallback(
    (newValues: MarketData) => {
      const override = specialCase(newValues);
      if (override) {
        setValues(newValues);
      } else if (values === trueValues.current) {
        setValues(newValues);
      } else {
        if (!forceTrueValueTimeout) {
          setForceTrueValueTimeout(
            setTimeout(() => {
              setValues(trueValues.current);
              setForceTrueValueTimeout(null);
            }, 3000)
          );
        }
      }
      trueValues.current = newValues;
    },
    [
      setValues,
      forceTrueValueTimeout,
      setForceTrueValueTimeout,
      values,
      trueValues,
    ]
  );

  const dispatch = useIPFDispatch();

  useEffect(() => {
    dispatch(
      addMarketSlotDataObserver({
        onChange: setTrueValues,
        item,
        id: itemId,
      })
    );
    return () => {
      dispatch(removeMarketSlotDataObserver(itemId));
    };
  }, [setTrueValues, item, id]);

  return [values, setValues];
};

// REFRESH_MARKET_SLOT_DATA=1~bone_amulet~2~169700~0~other_equipment~1686030487957~3~gold~125~75~0~ores~1686030919956~2~silver~2119~15~0~ores~1686037925816
// 1686038984235-timestamp when posted
export const useRefreshMarketSlotDataObserver = () => {
  const observers = useIPFSelector(selectMarketSlotDataObservers);

  const onMessage = useMemo(
    () =>
      observeWebSocketMessage("REFRESH_MARKET_SLOT_DATA", (dataString: string) => {
        const data = reduceToRecord<MarketData>(dataString.split("~"), [
          (value) => ({ slot: parseInt(value) }),
          (value) => ({ name: value }),
          (value) => ({ amount: parseInt(value) }),
          (value) => ({ price: parseInt(value) }),
          (value) => ({ sold: parseInt(value) }),
          (value) => ({ type: value }),
          (value) => ({ timestamp: parseInt(value) }),
        ]);
        observers.forEach((observer) => {
          data.forEach((d) => {
            if (d.slot.toString() === observer.item) {
              observer.onChange(d);
            }
          });
        });
      }),
    [observers]
  );
  useWebsocket(onMessage, 10, "refreshMarketSlotData");
};
