export class Trading {
  constructor(
    public symbol: string,
    public exchange: string,
    public type: string,
    public date: Date,
    public amount: number,
    public price: number,
    public holding: boolean
  ) {}
}
