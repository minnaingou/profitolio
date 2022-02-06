import { Trading } from "./trading.model";

export interface SellingTradeDialogData {
  symbol: string;
  amount: number;
  price: number;
  sellingTrade: Trading;
}
