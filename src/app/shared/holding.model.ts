export class Holding {
  constructor(
    public symbol: string,
    public holding: number,
    public unitCost: number,
    public totalCost: number,
    public realisedPL: number,
    public marketValue: number,
    public totalWorth: number,
    public totalGain: number,
    public perUnrealisedPL: number,
    public unrealisedPL: number
  ) {}
}
