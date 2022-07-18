<script lang="ts">
import { onMount } from "svelte";


  
  //let fajlnevIdo = 202207150850 //ééééhhnnóópp UTC-ben
  const datum2fajlnev = (d:Date):string => d.toISOString().replaceAll(/[-T:]/g, '').substring(0, 11) + "0"
  // dátum -> "éééé-hh-nnTóó:pp:....." -> "ééééhhnnóópp....." -> "ééééhhnnóóp0"

  let fajlnevIdo:number = +datum2fajlnev(new Date())
  
  const elozoTerkep0·0 = (event:Event) =>  // 0·0 verzió (· = &middot; &#183; U+00B7   pl. katalán sol·licitada) (pont nem lehet azonosítóban)
  {
    fajlnevIdo-=5
    if (fajlnevIdo%100 >= 60) fajlnevIdo-=40
    if (fajlnevIdo/100%100 >= 24) fajlnevIdo-=7600
  }

  const kovetkezoTerkep0·0 = (event:Event) =>
  {
    fajlnevIdo+=5
    if (fajlnevIdo%100 >= 60) fajlnevIdo+=40
    if (fajlnevIdo/100%100 >= 24) fajlnevIdo+=7600
  }

  let képtípus:string = "visual"  // visual vagy infraPolair

  let fajlnevDatum:Date //= new Date()//.setTime(0) az szám
  //fajlnevDatum.setSeconds(0, 0)
  const fajlnevDatumInic = () =>
  {
    let d:Date = new Date()
    d.setMinutes(Math.trunc(d.getMinutes()/5) * 5, 0, 0)
    fajlnevDatum = d
    fájlnévDátum = d
    // {fajlnevDatum} nem műx (nem frissül), {fájlnévDátum} igen
    /***/ console.log("dátum inic")
  }
  onMount(fajlnevDatumInic)
  let fájlnévDátum:Date
  

  const előzőTérkép = (event:Event) =>
  {
          console.log(fajlnevDatum.getMinutes())
    fajlnevDatum.setMinutes(fajlnevDatum.getMinutes()-5)
         console.log(fajlnevDatum/*.getMinutes()*/)
         fájlnévDátum=fajlnevDatum
  }

  const következőTérkép = (event:Event) =>
  {
    let d:Date = fájlnévDátum
    d.setMinutes(d.getMinutes()+5)
    fájlnévDátum = d
  }

</script>

<button on:click="{elozoTerkep0·0}">&lt;</button>
<input bind:value="{fajlnevIdo}" />
<button on:click="{kovetkezoTerkep0·0}">&gt;</button>
<div>
  <img src="https://hu.sat24.com/image?type={képtípus}&region=hu&timestamp={fajlnevIdo}&anyadkess={new Date().getMilliseconds()}" alt="">
</div>
<div>
  <button on:click="{előzőTérkép}">&lt;</button>
  <input value="{fájlnévDátum?.toISOString().substring(0, 16)}" />
  <button on:click="{következőTérkép}">&gt;</button>
  <!---->      <button on:click="{()=>console.log(fajlnevDatum)}">{fajlnevDatum} {fajlnevIdo}</button>
  <!---->      {fajlnevDatum?.getMinutes()} 
  <!---->      {fajlnevDatum?.toISOString().substring(0, 16)}
  <!----> {fájlnévDátum}
</div>