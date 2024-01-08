import {
  useItemObserver,
  useNumberItemObserver,
} from "../setItems/useSetItemsObserver";

interface Wallet {
  investedAmount: number;
  investedDate: string;
  withdrawWeek: number;
}

export const useWalletObserver = (id: string): Wallet[] => {
  const hookId = `useWalletObserver-${id}`;
  const [wallet1InvestedAmount] = useNumberItemObserver("wallet1_invested", hookId)
  const [wallet2InvestedAmount] = useNumberItemObserver("wallet2_invested", hookId)
  const [wallet3InvestedAmount] = useNumberItemObserver("wallet3_invested", hookId)
  const [wallet4InvestedAmount] = useNumberItemObserver("wallet4_invested", hookId)

  const [wallet1InvestedDate] = useItemObserver("invest_date_wallet1", hookId)
  const [wallet2InvestedDate] = useItemObserver("invest_date_wallet2", hookId)
  const [wallet3InvestedDate] = useItemObserver("invest_date_wallet3", hookId)
  const [wallet4InvestedDate] = useItemObserver("invest_date_wallet4", hookId)

  const [wallet1WithdrawWeek] = useNumberItemObserver("withdraw_dateweek_wallet1", hookId)
  const [wallet2WithdrawWeek] = useNumberItemObserver("withdraw_dateweek_wallet2", hookId)
  const [wallet3WithdrawWeek] = useNumberItemObserver("withdraw_dateweek_wallet3", hookId)
  const [wallet4WithdrawWeek] = useNumberItemObserver("withdraw_dateweek_wallet4", hookId)

  return [
    {
      investedAmount: wallet1InvestedAmount,
      investedDate: wallet1InvestedDate,
      withdrawWeek: wallet1WithdrawWeek,
    },
    {
      investedAmount: wallet2InvestedAmount,
      investedDate: wallet2InvestedDate,
      withdrawWeek: wallet2WithdrawWeek,
    },
    {
      investedAmount: wallet3InvestedAmount,
      investedDate: wallet3InvestedDate,
      withdrawWeek: wallet3WithdrawWeek,
    },
    {
      investedAmount: wallet4InvestedAmount,
      investedDate: wallet4InvestedDate,
      withdrawWeek: wallet4WithdrawWeek,
    },

  ];
};
