import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useIPFDispatch, useIPFSelector } from "../../redux/hooks";
import {
  consumeWebSocketMessage,
  useWebsocket,
} from "../../util/websocket/useWebsocket";
import { reduceToRecord } from "../../util/arrayUtils";
import { addRocketObserver } from "./rocketReducer";
import { selectRocketObservers, removeRocketObserver } from "./rocketReducer";

export interface RocketData {
  moonDistance: number;
  sunDistance: number;
}

export const useRocketObserver = (
  item: string,
  id: string,
  specialCase: (value: number) => boolean = (_) => false
): [number, (newValue: number) => void] => {
  const [value, setValue] = useState<number>(0);
  const trueValue = useRef(0);

  const itemId = `${id}-${item}`;

  const [forceTrueValueTimeout, setForceTrueValueTimeout] =
    useState<NodeJS.Timeout | null>(null);

  const setTrueValues = useCallback(
    (newValue: number) => {
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
      addRocketObserver({
        onChange: setTrueValues,
        item,
        id: itemId,
      })
    );
    return () => {
      dispatch(removeRocketObserver(itemId));
    };
  }, [setTrueValues, item, id]);

  return [value, setValue];
};

// CLICKS_ROCKET=0
// OPEN_ROCKET_DIALOGUE=259122~149507501
export const useOpenRocketDialogueObserver = () => {
  const observers = useIPFSelector(selectRocketObservers);

  const onMessage = useMemo(
    () =>
      consumeWebSocketMessage("OPEN_ROCKET_DIALOGUE", (dataString: string) => {
        const data = reduceToRecord<RocketData>(dataString.split("~"), [
          (value) => ({ moonDistance: parseInt(value) }),
          (value) => ({ sunDistance: parseInt(value) }),
        ]);
        observers.forEach((observer) => {
          data.forEach((d) => {
            switch (observer.item) {
              case "moon": observer.onChange(d.moonDistance)
              case "sun": observer.onChange(d.sunDistance)
            }
          })
        });
      }),
    [observers]
  );
  useWebsocket(onMessage, 10, "rocket");
};