//osztályok, konstansok stb. definíciói

// url-címbe hasból egy érték, kesselés ellen (lehetne metódus a Dátum-ban, de így kényelmesebb (nem kell this., lehet lambda))
const hasPar = ():string => //new Date().getMilliseconds()+""
                            Math.random()+""

// okosított Date
export class Dátum extends Date
{
  pontosságPerc:number
  lépésközPerc:number
  képtípus:string

  függőben?: Date|null  // változásnál nemnullra kell állítani, és az aszinkron műveletek (on:load, on:error) nullázzák le
                        //  hátha jó lesz valamire, hogy éppen Date
                        //  Date|null|undefined

  constructor (pontosságPerc:number = 5, lépésközPerc:number = pontosságPerc, képtípus?:string)
  {
    super()
    this.pontosságPerc = pontosságPerc
    this.lépésközPerc = lépésközPerc
    //this.képtípus = képtípus   kell egyáltalán ide? csak ha minden leszármazottnak van ilyenje
    this.lekerekít()
    this.függőben=this
  }

  alapra(pontosságPerc:number = 5, lépésközPerc:number = pontosságPerc)
  {
    this.pontosságPerc = pontosságPerc
    this.lépésközPerc = lépésközPerc
    this.setTime(Date.now())
    this.lekerekít()
    this.függőben=this
    //** */ this.visszaAzUtsóig()
  }

  lekerekít(perc:number = this.pontosságPerc):void
  { this.setMinutes(Math.trunc(this.getMinutes()/perc) * perc, 0, 0) }

  vissza(perc:number = this.lépésközPerc):void
  { this.setMinutes(this.getMinutes()-perc) 
    this.függőben=this
  }

  előre(perc:number = this.lépésközPerc):void
  { this.setMinutes(this.getMinutes()+perc) 
    this.függőben=this
  }

  nincsTovábbVissza():boolean
  {
    return false
  }
  nincsTovábbElőre():boolean //nem megyünk a jövőbe
  {
    return this >= new Dátum
  }

  url():string { return "" }

  üzenet:string// = "üz"  //??

  talált?:Date|null  // sikeres képbetöltés után annak ideje, sikertelen után null (falsszerű)

  képBetöltve(kép:HTMLImageElement)
  {
    console.log(this.képtípus+" kép betöltve")
    this.üzenet = `betöltve (${kép.naturalWidth}x${kép.naturalHeight})`
    this.talált = this   // sat24-nél nem biztos, lehet, hogy 1*1-es kép jött
    this.függőben = null
  }

  képHiba()
  {
    console.log("képhiba")
    this.üzenet = "nincs"
    this.talált = null
    this.függőben = null
  }

}

export class SatDátum extends Dátum
{
  constructor (pontosságPerc:number = 15, lépésközPerc:number = pontosságPerc, képtípus:string = "visual")
  { 
    super()
    this.képtípus = képtípus
  }

  private urlrész():string {return this.toISOString().replace(/[-T:]/g, '').substring(0, 12)} // ééééhhnnóópp, UTC-ben, osztható 5-tel

  url():string
  {
    return `https://hu.sat24.com/image?type=${this.képtípus}&region=hu&timestamp=${this.urlrész()}&anyadkess=${hasPar()}`
  }
  // kell az anyádkess, mert ha nincs olyan kép, akkor jön egy 1x1-es kép hiba nélkül, és azt kesseli

  alapra(pontosságPerc=5, lépésközPerc=pontosságPerc, képtípus = "visual"): void 
  {
    super.alapra(pontosságPerc, lépésközPerc)
    this.képtípus = képtípus
    //** */console.log("képtípus "+this.képtípus)
    //** */console.log(this)
    //KÉNE: beállítani a lápésközt 5-re, vagy 15-re, attl függ, milyenje van a sat24-nek
  }

  képBetöltve(kép:HTMLImageElement)
  {
    if (kép.naturalWidth>1)
      super.képBetöltve(kép)
    else
      this.képHiba()
  }

}

/*nem export*/ class RadarDátum extends Dátum   // olyan alosztályokhoz, amelyek .../éééé/hh/nn/...ééééhhnn_óópp... alakú url-t csinálnak, pl. metnet és met
{

  protected uEv() { return (this.getFullYear()+"")/*.padStart(4, '0')*/ }     // nem private, mert a mix-hez kellenek a MetnetDátum-nak
  protected uHo() { return ((this.getMonth()+1)+"").padStart(2, '0') }
  protected uNap() { return (this.getDate()+"").padStart(2, '0') }
  protected uOra() { return (this.getHours()+"").padStart(2, '0') }
  protected uPerc() { return (this.getMinutes()+"").padStart(2, '0') }
  private   uUTCNap() { return (this.getUTCDate()+"").padStart(2, '0') }
  private   uUTCOra() { return (this.getUTCHours()+"").padStart(2, '0') }

  protected uDátum() { return `${this.uEv()}/${this.uHo()}/${this.uNap()}` }  // éééé/hh/nn
  protected uIdő()   { return `${this.uEv()}${this.uHo()}${this.uNap()}_${this.uOra()}${this.uPerc()}` }  // ééééhhnn_óópp
  protected uUTCIdő(){ return `${this.uEv()}${this.uHo()}${this.uUTCNap()}_${this.uUTCOra()}${this.uPerc()}` }  // ééééhhnn_óópp

}

export class MetnetDátum extends RadarDátum
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

  private képtípusok =
  {                // .../éééé/hh/nn/composite_ééééhhnn_óópp.jpg
    kompozit: ()=>`https://www.metnet.hu/img/radar_metnet/${this.uDátum()}/composite_${this.uIdő()}.jpg?anyadkess=${hasPar()}`
    // itt is kell az anyádkess, mert a semmit (404) is kesseli!
  , mix: ()=>`https://www.metnet.hu/img/radar_metnet/radarmix.jpg?date=${this.uEv()}${this.uHo()}${this.uNap()}${this.uOra()}${this.uPerc()}`
  }

  url():string { return this.képtípusok[this.képtípus]() }

}

export class MetDátum extends RadarDátum
{
  constructor (pontosságPerc:number = 10, lépésközPerc:number = pontosságPerc, képtípus:string = "W")  // W: országos, E: ÉNy, F: DNy, H: ÉK, G: DK
  { 
    super(pontosságPerc, lépésközPerc)
    this.képtípus = képtípus
  }

  alapra(pontosságPerc=10, lépésközPerc=pontosságPerc, képtípus="W"): void 
  {
    super.alapra(pontosságPerc, lépésközPerc)
    this.képtípus = képtípus
  }

  url() { return `https://www.met.hu/img/Rcc${this.képtípus}/Rcc${this.képtípus}${this.uUTCIdő()}.jpg`}

  //KÉNE: nincsTovábbVissza(), mert nem sokra visszamenőleg vannak csak térképek

}