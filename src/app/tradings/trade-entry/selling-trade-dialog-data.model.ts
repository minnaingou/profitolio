import { Trading } from 'src/app/shared/trading.model';

export interface SellingTradeDialogData {
  symbol: string;
  amount: number;
  price: number;
  sellingTrade: Trading;
}
