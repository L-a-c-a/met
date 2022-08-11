//osztályok, konstansok stb. definíciói

// okosított Date
export class Dátum extends Date
{
  pontosságPerc:number
  lépésközPerc:number
  képtípus:string

  constructor (pontosságPerc:number = 5, lépésközPerc:number = pontosságPerc, képtípus:string = "visual")
  {
    super()
    this.pontosságPerc = pontosságPerc
    this.lépésközPerc = lépésközPerc
    this.képtípus = képtípus
    this.lekerekít()
  }

  alapra(pontosságPerc:number = 5, lépésközPerc:number = pontosságPerc)
  {
    this.pontosságPerc = pontosságPerc
    this.lépésközPerc = lépésközPerc
    this.setTime(Date.now())
    this.lekerekít()
  }

  lekerekít(perc:number = this.pontosságPerc):void
  { this.setMinutes(Math.trunc(this.getMinutes()/perc) * perc, 0, 0) }

  vissza(perc:number = this.lépésközPerc):void
  { this.setMinutes(this.getMinutes()-perc) }

  előre(perc:number = this.lépésközPerc):void
  { this.setMinutes(this.getMinutes()+perc) }

  url():string { return "" }
}

export class SatDátum extends Dátum
{
  urlrész():string {return this.toISOString().replace(/[-T:]/g, '').substring(0, 12)} // ééééhhnnóópp, UTC-ben, osztható 5-tel

  url():string
  {
    return `https://hu.sat24.com/image?type=${this.képtípus}&region=hu&timestamp=${this.urlrész()}&anyadkess=${new Date().getMilliseconds()}`
  }
  // kell az anyádkess, mert ha nincs olyan kép, akkor jön egy 1x1-es kép hiba nélkül, és azt kesseli

  alapra(pontosságPerc=5, lépésközPerc=pontosságPerc, képtípus = "visual"): void 
  {
    super.alapra(pontosságPerc, lépésközPerc)
    this.képtípus = képtípus
    //** */console.log("képtípus "+this.képtípus)
    //** */console.log(this)
  }
}

export class MetnetDátum extends Dátum
{
  constructor (pontosságPerc:number = 5, lépésközPerc:number = pontosságPerc, képtípus:string = "kompozit")
  { 
    super()
    this.képtípus = képtípus
  }

  alapra(pontosságPerc=5, lépésközPerc=pontosságPerc, képtípus:string = "kompozit"): void 
  {
    super.alapra(pontosságPerc, lépésközPerc)
    this.képtípus = képtípus
  }

  private uEv() { return (this.getFullYear()+"")/*.padStart(4, '0')*/ }
  private uHo() { return ((this.getMonth()+1)+"").padStart(2, '0') }
  private uNap() { return (this.getDate()+"").padStart(2, '0') }
  private uOra() { return (this.getHours()+"").padStart(2, '0') }
  private uPerc() { return (this.getMinutes()+"").padStart(2, '0') }

  private képtípusok =
  { kompozit: ()=>`https://www.metnet.hu/img/radar_metnet/${this.uEv()}/${this.uHo()}/${this.uNap()}/composite_${this.uEv()}${this.uHo()}${this.uNap()}_${this.uOra()}${this.uPerc()}.jpg`
  , mix: ()=>`https://www.metnet.hu/img/radar_metnet/radarmix.jpg?date=${this.uEv()}${this.uHo()}${this.uNap()}${this.uOra()}${this.uPerc()}`
  }

  url():string { return this.képtípusok[this.képtípus]() }
}