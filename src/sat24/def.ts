//osztályok, konstansok stb. definíciói

// okosított Date
export class Dátum extends Date
{
  pontosságPerc:number
  lépésközPerc:number

  constructor (pontosságPerc:number = 5, lépésközPerc:number = pontosságPerc)
  {
    super()
    this.pontosságPerc = pontosságPerc
    this.lépésközPerc = lépésközPerc
    this.lekerekít()
  }

  lekerekít(perc:number = this.pontosságPerc):void
  { this.setMinutes(Math.trunc(this.getMinutes()/perc) * perc, 0, 0) }

  vissza(perc:number = this.lépésközPerc):void
  { this.setMinutes(this.getMinutes()-perc) }

  előre(perc:number = this.lépésközPerc):void
  { this.setMinutes(this.getMinutes()+perc) }

  urlrész():string {return this.toISOString().replace(/[-T:]/g, '').substring(0, 12)} // ééééhhnnóópp, UTC-ben, osztható 5-tel
}