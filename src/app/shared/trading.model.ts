export class Trading {
  constructor(
    public symbol: string,
    public exchange: string,
    public type: string,
    public date: Date,
    public updatedDate: Date,
    public amount: number,
    public startingAmount: number,
    public price: number,
    public holding: boolean,
    public key?: string,
    public sellingInfo?: { matchedTrade: Trading; realisedPL?: number }
  ) {}
}
