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
                        //  hátha jó lesz valamire, hogy éppen Date - !! de ha ezt kihasználom, akkor nem =this , hanem =new Date(this) !!
                        //  Date|null|undefined  (a kérdőjeltől lesz |undefined)

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

  beállít(d:Date):void
  { this.setTime(d.getTime()) }

  vissza(perc:number = this.lépésközPerc):void
  { this.setMinutes(this.getMinutes()-perc) 
    this.függőben=new Date(this)
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

  /// ITT NEM JÓ, mert nem sül el on:load, on:error 
  //visszaAzUtsóig():void
  //{
  //  let lépésközMentés = this.lépésközPerc
  //  this.lépésközPerc = this.pontosságPerc // 5
  //  let biztonságiHatár=100
  //  let intervallum /* kell belőle lokális */ = setInterval
  //  ( () =>
  //    {
  //      /**  */ console.log(this.megjelenít(this.függőben), this.megjelenít(this.talált), biztonságiHatár)
  //      if ((--biztonságiHatár)<=0) clearInterval(intervallum) 
  //      if (this.függőben) return   //ha nem töltődött még be a térkép, és nem is derült ki, hogy nincs, akkor ebben a körben nem csinálunk semmit
  //      /**  */ console.log(this.megjelenít(this.függőben), this.megjelenít(this.talált), biztonságiHatár)
  //      if (this.talált) /* akkor kész vagyunk */
  //      { 
  //        clearInterval(intervallum)
  //        this.lépésközPerc = lépésközMentés
  //      }
  //      else this.vissza()  //itt kéne elsülnie on:load-nak vagy on:error-nak, de nem sül el
  //    }
  //  , 200
  //  )
  //}

  megjelenít(d?:Date|null):string { return d?.toLocaleString('sv', {dateStyle: 'short', timeStyle: 'short' }) ?? "0000-00-00 00:00" }

  típusváltás()
  {
    /* */ console.log(`típusváltás: ${this.constructor.name}/${this.képtípus} ${this.megjelenít(this)}`)
  }

  képBetöltve(kép:HTMLImageElement)
  {
    console.log(this.képtípus+" kép betöltve "+this.megjelenít(this))
    this.üzenet = `betöltve (${kép.naturalWidth}x${kép.naturalHeight})`
    this.talált = new Date(this)   // sat24-nél nem biztos, lehet, hogy 1*1-es kép jött   // = this nem jó, mert a hivatkozást adja értékül, nem a dátumot
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

  private urlrész():string {return this.toISOString().substring(0, 16).replace(/[-T:]/g, '') } // ééééhhnnóópp, UTC-ben, osztható 5-tel

  url():string
  {
    return `https://hu.sat24.com/image?type=${this.képtípus}&region=hu&timestamp=${this.urlrész()}&anyadkess=${hasPar()}`
  }
  // kell az anyádkess, mert ha nincs olyan kép, akkor jön egy 1x1-es kép hiba nélkül, és azt kesseli

  alapra(pontosságPerc=5, lépésközPerc?:number, képtípus = "visual"): void 
  {
    /** */ console.log(`sat alapra lépésközPerc=${lépésközPerc} , par: ${lépésközPerc??this.lépésközPerc}`)
    super.alapra(pontosságPerc, lépésközPerc??this.lépésközPerc)
    //this.képtípus = képtípus    //éjjel önkicseszés
    //** */console.log("képtípus "+this.képtípus)
    //** */console.log(this)
    //KÉNE: beállítani a lépésközt 5-re, vagy 15-re, attól függ, milyenje van a sat24-nek
  }

  képBetöltve(kép:HTMLImageElement)
  {
    if (kép.naturalWidth>1)
      super.képBetöltve(kép)
    else
      this.képHiba()
  }

}

/*nem export*/ abstract class RadarDátum extends Dátum   // olyan alosztályokhoz, amelyek .../éééé/hh/nn/...ééééhhnn_óópp... alakú url-t csinálnak, pl. metnet és met
//                                                       // meg az olyanokhoz, amelyek használják a pontosság--modulo modellt
{

  protected uEv() { return (this.getFullYear()+"")/*.padStart(4, '0')*/ }     // nem private, mert a mix-hez kellenek a MetnetDátum-nak
  protected uHo() { return ((this.getMonth()+1)+"").padStart(2, '0') }
  protected uNap() { return (this.getDate()+"").padStart(2, '0') }
  protected uOra() { return (this.getHours()+"").padStart(2, '0') }
  protected uPerc() { return (this.getMinutes()+"").padStart(2, '0') }
  //private   uUTCNap() { return (this.getUTCDate()+"").padStart(2, '0') }
  //private   uUTCOra() { return (this.getUTCHours()+"").padStart(2, '0') }

  protected uDátum() { return `${this.uEv()}/${this.uHo()}/${this.uNap()}` }  // éééé/hh/nn
  protected uIdő()   { return `${this.uEv()}${this.uHo()}${this.uNap()}_${this.uOra()}${this.uPerc()}` }  // ééééhhnn_óópp
  //protected uUTCIdő(){ return `${this.uEv()}${this.uHo()}${this.uUTCNap()}_${this.uUTCOra()}${this.uPerc()}` }  // ééééhhnn_óópp
    // így is lehet, de toISOString-gel is, mint SatDátum-ban   (ISO: éééé-hh-nnTóó:pp:mp.eeeZ (UTC))
  protected uUTCIdő(){ return this.toISOString().substring(0, 16).replace(/[-:]/g, '').replace(/T/, '_') }

  moduloPerc = 0    // pontosságPerc-enként vannak a térképek, de (n*pontosságPerc+moduloPerc)-kor
  //                   pl. pontosságPerc=15, moduloPerc=10 ==> :10-, :25-, :40-, :55-kor vannak

  lekerekít(perc: number = this.pontosságPerc, modulo:number = 0): void   // öröklődik úgy is, hogy nem ugyanannyi paramétere van
  {
    /**/console.log(this.megjelenít(this), perc, modulo);
    const δ = (perc-modulo)%perc  // vagy magyarul: modulo ? perc-modulo : 0
    
    // lassan, érthetően, scalásan
    const e1 = this.getMinutes() + δ
    const e2 = (Math.trunc(e1/perc) * perc)
    const e3 = e2 - δ   // lehet negatív, de nem baj, a setMinutes okos
    /**/console.log(δ, e1, e2, e3)
    
    this.setMinutes(e3, 0, 0)
    /**/console.log(this.megjelenít(this));
          
  }

  típusváltás(): void 
  {
    super.típusváltás() 
    this.percBeállít()   
    this.lekerekít(this.pontosságPerc, this.moduloPerc)
  }

  abstract percBeállít():void

  constructor(pontosságPerc:number = 5, lépésközPerc:number = pontosságPerc)
  {
    super(pontosságPerc, lépésközPerc)
    this.moduloPerc = 0
  }


}

export class MetnetDátum extends RadarDátum
{
  constructor (pontosságPerc:number = 5, lépésközPerc:number = pontosságPerc, képtípus:string = "kompozit")
  { 
    super(pontosságPerc, lépésközPerc)
    this.képtípus = képtípus
  }

  alapra(pontosságPerc=5, lépésközPerc=pontosságPerc, képtípus:string = "kompozit"): void 
  {
    //super.alapra(pontosságPerc, lépésközPerc)     // műhold: :10, :25, :40, :55 !
    if (this.képtípus=='muhold') 
      { super.alapra(5, 15); /*this.lépésközPerc=15*/ } // lehet 15, visszaAzUtsóig() menti, 5-re állítja és visszaállítja
    else
      super.alapra(pontosságPerc, lépésközPerc)
    //this.képtípus = képtípus
  }

  private képtípusok =
  {                // .../éééé/hh/nn/composite_ééééhhnn_óópp.jpg
    kompozit: ()=>`https://www.metnet.hu/img/radar_metnet/${this.uDátum()}/composite_${this.uIdő()}.jpg?anyadkess=${hasPar()}`
    // itt is kell az anyádkess, mert a semmit (404) is kesseli!
  , mix: ()=>`https://www.metnet.hu/img/radar_metnet/radarmix.jpg?date=${this.uEv()}${this.uHo()}${this.uNap()}${this.uOra()}${this.uPerc()}`
  , muhold: ()=>`https://www.metnet.hu/img/satellite/${this.uDátum()}/hrvrgb_${this.uUTCIdő()}.jpg?anyadkess=${hasPar()}`  //helyi és UTC éjfél között nem tudom, mi van; kell uUTCDátum?
  }

  url():string { return this.képtípusok[this.képtípus]() }

  percBeállít() 
  {
    [this.pontosságPerc, this.moduloPerc] = (this.képtípus=='muhold') ? [15, 10] : [5, 0]
    /**/ console.log(this.url())
  }

}

export class MetDátum extends RadarDátum
{
  //képKiterj = "jpg"

  constructor (pontosságPerc:number = 5, lépésközPerc:number = pontosságPerc, képtípus:string = "RccW")  // W: országos, E: ÉNy, F: DNy, H: ÉK, G: DK
  { 
    super(pontosságPerc, lépésközPerc)
    this.képtípus = képtípus
    //if (képtípus[1] == 'M') if (képtípus[2] == 'n' || képtípus[3] != 'A') this.képKiterj = "png"
  }

    /* 
  private képKiterj()
  {
    if (this.képtípus[2] == 'n') return "png"
    //*if (this.képtípus[1] == 'M')* / if (this.képtípus[3] == '9') return "png"
    return "jpg"
  }
    */

  private képKiterj = () =>
  ( {
      BMnA: "png"
    }[this.képtípus] || "jpg"
  )
  // switch helyett  [JavaScript Switch Expressions](https://medium.com/@numberpicture/nugget-javascript-switch-expressions-e3bf059eefb0)

  alapra(pontosságPerc=10, lépésközPerc=pontosságPerc, képtípus="W"): void    //műholdra nem jó ez a 10
  {
    if (this.képtípus[0]=='R') 
      super.alapra(pontosságPerc, lépésközPerc)
    else
      { super.alapra(5, 15); /*this.lépésközPerc=15*/ }
    //KÉNE: felülírni lekerekít() -t
    //this.képtípus = képtípus
  }

  url() { return `https://www.met.hu/img/${this.képtípus}/${this.képtípus}${this.uUTCIdő()}.${this.képKiterj()}`}

  percBeállít()
  {
    [this.pontosságPerc, this.moduloPerc] = (this.képtípus[0]=='R') ? [10, 0] : [15, 10]
  }

  //KÉNE: nincsTovábbVissza(), mert nem sokra visszamenőleg vannak csak térképek

}