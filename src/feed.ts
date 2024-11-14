import { Observable } from "rxjs";


export interface Tick {
  symbol: string;
  price: number;
  volume: number
}

type CB = (update: Tick) => any

const timeout = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class PriceFeed {

  private tickers = new Set<string>()
  private innerCb: CB | null = null

  constructor() {
    this.setupFeed()
  }

  subscribeToSymbol(symbol: string) {
    this.tickers.add(symbol)
  }

  unsubscribeFromSymbol(symbol: string) {
    this.tickers.delete(symbol)
  }

  listen(cb: CB) {
    this.innerCb = cb
  }

  private generateTick(symbol: Tick['symbol']) {
    const price = (Math.random() * 10000).toFixed(2)
    return {
      symbol,
      price: Number(price),
      volume: 550
    }
  }

  private async setupFeed() {
    await timeout(3000)
    Array.from(this.tickers).forEach(ticker => {
      const tick = this.generateTick(ticker)
      if (this.innerCb) {
        this.innerCb(tick)
      }
    })
    this.setupFeed()
  }

}

export const priceFeed = new PriceFeed()

const feed$ = new Observable<Tick>(observer => {
  priceFeed.listen(update => observer.next(update))
})

export const subscribeToPrices = () => feed$

export const unsubscribeFromSymbol = (symbol: string) => {
  priceFeed.unsubscribeFromSymbol(symbol)
}

export const subscribeToSymbol = (symbol: string) => {
  priceFeed.subscribeToSymbol(symbol)
}

