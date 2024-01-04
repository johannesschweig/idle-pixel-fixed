import {
  useItemObserver,
  useNumberItemObserver,
} from "../setItems/useSetItemsObserver";

interface Wallet {
  invested: number;
}

export const useWalletObserver = (id: string): Wallet[] => {
  const hookId = `useWalletObserver-${id}`;
  const [wallet1Invested] = useNumberItemObserver("wallet1_invested", hookId)
  const [wallet2Invested] = useNumberItemObserver("wallet2_invested", hookId)
  const [wallet3Invested] = useNumberItemObserver("wallet3_invested", hookId)
  const [wallet4Invested] = useNumberItemObserver("wallet4_invested", hookId)

  return [
    {
      invested: wallet1Invested,
    },
    {
      invested: wallet2Invested,
    },
    {
      invested: wallet3Invested,
    },
    {
      invested: wallet4Invested,
    },
  ];
};
