import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { LatestPrice } from '../../models/holding/latestPrice.model';
import { OverviewSection } from '../../models/overview/overview.model';
import { Trading } from '../../models/tradings/trading.model';
import * as fromApp from '../../../store/app.reducer';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
})
export class OverviewComponent implements OnInit {
  plAssessmentSection: OverviewSection;
  investmentSummarySection: OverviewSection;
  assetAllocationSection: OverviewSection;
  historicalSection: OverviewSection;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.store.select('trading').subscribe((state) => {
      this.plAssessmentSection = this.getPlAssessments(
        state.tradings,
        state.latestPrices
      );
      this.investmentSummarySection = this.getInvestmentSummaries(
        state.tradings,
        state.latestPrices
      );
      this.assetAllocationSection = this.getHoldingPercentages(state.tradings);
      this.historicalSection = this.getHistoricalData(state.tradings);
    });
  }

  private getPlAssessments(
    tradings: Trading[],
    latestPrices: LatestPrice[]
  ): OverviewSection {
    const plAssessment: OverviewSection = {
      title: 'P&L Assessment',
      lines: [],
    };

    plAssessment.lines.push({
      title: 'Total Gain',
      currency: true,
      icon: 'stacked_line_chart',
      display: 'row',
      content: new Promise((resolve) => {
        const result =
          this.calculateTotalUnrealisedPL(tradings, latestPrices) +
          this.calculateTotalRealisedPL(tradings);
        resolve(result ? result : 0);
      }),
    });

    plAssessment.lines.push({
      title: 'Total Unrealised P&L',
      currency: true,
      icon: 'show_chart',
      display: 'row',
      content: new Promise((resolve) => {
        const result = this.calculateTotalUnrealisedPL(tradings, latestPrices);
        resolve(result ? result : 0);
      }),
    });

    plAssessment.lines.push({
      title: 'Total Realised P&L',
      currency: true,
      icon: 'show_chart',
      display: 'row',
      content: new Promise((resolve) => {
        const result = this.calculateTotalRealisedPL(tradings);
        resolve(result ? result : 0);
      }),
    });

    return plAssessment;
  }

  private getInvestmentSummaries(
    tradings: Trading[],
    latestPrices: LatestPrice[]
  ): OverviewSection {
    const investmentSummary: OverviewSection = {
      title: 'Investment Summary',
      lines: [],
    };

    investmentSummary.lines.push({
      title: 'Total Investment Cost',
      currency: true,
      icon: 'attach_money',
      display: 'column',
      content: new Promise((resolve) => {
        const result = this.calculateTotalInvestedCost(tradings);
        resolve(result ? result : 0);
      }),
    });

    investmentSummary.lines.push({
      title: 'Total Investment Value',
      currency: true,
      icon: 'candlestick_chart',
      display: 'column',
      content: new Promise((resolve) => {
        const result = this.calculateTotalInvestedValue(tradings, latestPrices);
        resolve(result ? result : 0);
      }),
    });

    return investmentSummary;
  }

  private getHoldingPercentages(tradings: Trading[]): OverviewSection {
    const assetAllocation: OverviewSection = {
      title: 'Asset Allocation Percentage',
      lines: null,
    };

    const filteredTradings = tradings.filter(
      (trading) => trading.holding && trading.type === 'buy'
    );
    const symbolSet: Set<string> = filteredTradings.reduce(
      (symbolSet, trading) => {
        symbolSet.add(trading.symbol);
        return symbolSet;
      },
      new Set<string>()
    );
    const totalInvestedCost = this.calculateTotalInvestedCost(tradings);
    assetAllocation.lines = Array.from(symbolSet).map((symbol) => {
      return {
        title: symbol.toUpperCase(),
        currency: false,
        icon: 'donut_large',
        display: 'row',
        content: new Promise((resolve) => {
          const result = this.findPercentageHolding(
            symbol,
            filteredTradings,
            totalInvestedCost
          );
          resolve(result ? result : 0);
        }),
      };
    });

    return assetAllocation;
  }

  private getHistoricalData(tradings: Trading[]): OverviewSection {
    const historicalData: OverviewSection = {
      title: 'Historical (Realised)',
      lines: [],
    };

    const filteredTradings = tradings.filter(
      (trading) => trading.type === 'sell'
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    historicalData.lines.push(
      this.getHistoricalLineItem('Today', today, filteredTradings)
    );

    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
    yesterday.setHours(0, 0, 0, 0);
    historicalData.lines.push(
      this.getHistoricalLineItem('Since Yesterday', yesterday, filteredTradings)
    );

    historicalData.lines.push(
      this.getHistoricalLineItem(
        'Since Last Month',
        new Date(new Date().setMonth(new Date().getMonth() - 1)),
        filteredTradings
      )
    );

    historicalData.lines.push(
      this.getHistoricalLineItem(
        'Since 3 Months Ago',
        new Date(new Date().setMonth(new Date().getMonth() - 3)),
        filteredTradings
      )
    );

    historicalData.lines.push(
      this.getHistoricalLineItem(
        'Since 6 Months Ago',
        new Date(new Date().setMonth(new Date().getMonth() - 6)),
        filteredTradings
      )
    );

    historicalData.lines.push(
      this.getHistoricalLineItem(
        'Since 1 Year Ago',
        new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
        filteredTradings
      )
    );

    return historicalData;
  }

  private getHistoricalLineItem(
    title: string,
    fromDate: Date,
    filteredTradings: Trading[]
  ) {
    return {
      title,
      currency: true,
      icon: 'today',
      display: 'row',
      content: new Promise<number>((resolve) => {
        const result = this.calculateRealisedPLFromDate(
          filteredTradings,
          fromDate
        );
        resolve(result ? result : 0);
      }),
    };
  }

  private sumReducer(total: number, next: number) {
    return total + next;
  }

  private calculateTotalRealisedPL(tradings: Trading[]) {
    return tradings
      .filter((trading) => trading.type === 'sell')
      .map((trading) => trading.sellingInfo.realisedPL)
      .reduce(this.sumReducer, 0);
  }

  private calculateTotalUnrealisedPL(
    tradings: Trading[],
    latestPrices: LatestPrice[]
  ) {
    return tradings
      .filter((trading) => trading.type === 'buy' && trading.holding)
      .map((trading) => {
        const latestPrice: number = latestPrices.find(
          (price) => price.symbol === trading.symbol
        ).price;
        return (latestPrice - trading.price) * trading.amount;
      })
      .reduce(this.sumReducer, 0);
  }

  private calculateTotalInvestedCost(tradings: Trading[]) {
    return tradings
      .filter((trading) => trading.type === 'buy' && trading.holding)
      .map((trading) => {
        return trading.amount * trading.price;
      })
      .reduce(this.sumReducer, 0);
  }

  private calculateTotalInvestedValue(
    tradings: Trading[],
    latestPrices: LatestPrice[]
  ) {
    return tradings
      .filter((trading) => trading.type === 'buy' && trading.holding)
      .map((trading) => {
        return (
          trading.amount *
          latestPrices.find((price) => price.symbol === trading.symbol).price
        );
      })
      .reduce(this.sumReducer, 0);
  }

  private findPercentageHolding(
    symbol: string,
    tradings: Trading[],
    totalInvested: number
  ) {
    const totalForSymbol = tradings
      .filter((trading) => trading.symbol === symbol)
      .map((trading) => trading.amount * trading.price)
      .reduce(this.sumReducer, 0);
    return ((totalForSymbol * 100) / totalInvested).toPrecision(2) + '%';
  }

  private calculateRealisedPLFromDate(tradings: Trading[], fromDate: Date) {
    return tradings
      .filter((trading) => new Date(trading.date) > fromDate)
      .map((trading) => trading.sellingInfo.realisedPL)
      .reduce(this.sumReducer, 0);
  }
}
