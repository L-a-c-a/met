<script lang="ts">

import { Dátum, MetnetDátum, SatDátum, MetDátum } from "./def"   //NEM .ts !!!

  let lap:string = "sat24"  // vagy metnet (és akkor kompozit vagy mix)

  let lapok =
  { sat24: new SatDátum //(undefined, undefined, "infraPolair")
  , metnet: new MetnetDátum
  , met: new MetDátum
  //... (többi laptípus)
  }

  let urlDátum:Dátum =  lapok.sat24 //minden okosságot az osztály csinál
  //let lépésközPerc = urlDátum.lépésközPerc  //ide is kell egy???

  $:{
      urlDátum = lapok[lap]
      //**/console.log("lapok[lap] változott: " + urlDátum.constructor.name )  //SatDátum vagy MetnetDátum (vagy...)
      urlDátum.típusváltás()
      megjelenőDátum = dátumMegjelenít(urlDátum)
    }

  let megjelenőDátum = "0000-00-00 00:00"
  const dátumMegjelenít = (d?:Date|null):string => d?.toLocaleString('sv', {dateStyle: 'short', timeStyle: 'short' }) ?? "0000-00-00 00:00"
   // HEKK! sv-vel vagy eo-val lesz iso-szerű, de eo-val nincs vezető nulla a dátumban

  const előzőTérkép = (e?:Event) => //urlDátum.vissza()
  {
    urlDátum.vissza()
    //visszaSzürke = urlDátum.nincsTovábbVissza()
    //előreSzürke = urlDátum.nincsTovábbElőre()
    urlDátum=urlDátum   //enélkül nem megy utána a kijelzett idő -- lefordítódik valami $$invalidate -ra
    megjelenőDátum = dátumMegjelenít(urlDátum)
    talált = dátumMegjelenít(urlDátum.talált)
  }

  const következőTérkép = (e?:Event) => //urlDátum.előre()
  {
    urlDátum.előre()
    //visszaSzürke = urlDátum.nincsTovábbVissza()
    //előreSzürke = urlDátum.nincsTovábbElőre()
    urlDátum=urlDátum   //enélkül nem megy utána a kijelzett idő
    megjelenőDátum = dátumMegjelenít(urlDátum)
    talált = dátumMegjelenít(urlDátum.talált)
  }

  const lépésközBeáll = (e:Event) => // <select> on:change hívja
  {
    let lépésköz:number = +(e.target as HTMLInputElement).value  // ts-ben e.target.value nem műx
    urlDátum.lépésközPerc = lépésköz
  }

  const alapra = (e:Event) =>
  {
    lapok[lap].alapra()
    lapok = lapok
    /***/ console.log("alapra:"+urlDátum)
    visszaAzUtsóig()
  }

  let intervallum:ReturnType<typeof setInterval> //NodeJS.Timer
  let animSeb = 2
  $: animKockahossz = 1000 / animSeb
  let visszaSzürke = false
  let álljSzürke = true
  let előreSzürke = false

  // az időzítő hajtogatja végre:
  const animálVissza = () => 
  { 
    urlDátum.vissza()
    urlDátum=urlDátum
    if (urlDátum.nincsTovábbVissza()) állj()
  }
  let utsóTalálat:Date|null|undefined
  const animálElőre = () => 
  { 
    urlDátum.előre()
    urlDátum=urlDátum
    /**/ console.log ("animálElőre talált:", urlDátum.talált)
    if (urlDátum.talált) utsóTalálat = urlDátum.talált
    if (urlDátum.nincsTovábbElőre())
    {
      állj()
      if (utsóTalálat) urlDátum.beállít(utsóTalálat)
      //urlDátum=urlDátum   nem ez volt a hiba
    }

  }

  const indítVissza = () => 
  {
    intervallum = setInterval(animálVissza, animKockahossz) 
    álljSzürke = false
    visszaSzürke = true
    előreSzürke = true
  }
  const indítElőre = () => 
  {
    intervallum = setInterval(animálElőre, animKockahossz)
    álljSzürke = false
    visszaSzürke = true
    előreSzürke = true
  }
  const állj = () =>
  {
    clearInterval(intervallum)
    visszaSzürke = false   //urlDátum.nincsTovábbVissza()
    álljSzürke = true
    előreSzürke = false   //urlDátum.nincsTovábbElőre()
    /**/ console.log ("állj:", utsóTalálat, urlDátum)
  }

  let üzenet = "___"
  let talált:string //Date|null|undefined 

  const képBetöltve = (e:Event) =>
  {
    /***/ console.log("on:load elsült")
    urlDátum.képBetöltve(e.target as HTMLImageElement)
    //urlDátum=urlDátum  ...helyett:
    üzenet = urlDátum.üzenet
    talált = dátumMegjelenít(urlDátum.talált)
  }

  const képHiba = (e:Event) =>
  {
    /***/ console.log("on:error elsült")
    urlDátum.képHiba()
    üzenet = urlDátum.üzenet
    talált = dátumMegjelenít(urlDátum.talált)
  }

  const visszaAzUtsóig = () =>
  {
    let lépésközMentés = urlDátum.lépésközPerc
    urlDátum.lépésközPerc = urlDátum.pontosságPerc // 5
    urlDátum.típusváltásElnyom = true
    let biztonságiHatár=100
    let intervallum /* kell belőle lokális */ = setInterval
    ( () =>
      {
        urlDátum=urlDátum
        /**  */ console.log(dátumMegjelenít(urlDátum.függőben), dátumMegjelenít(urlDátum.talált), biztonságiHatár, urlDátum.típusváltásElnyom)
        if ((--biztonságiHatár)<=0) 
        { clearInterval(intervallum) 
          urlDátum.típusváltásElnyom = false
        }
        if (urlDátum.függőben) return   //ha nem töltődött még be a térkép, és nem is derült ki, hogy nincs, akkor ebben a körben nem csinálunk semmit
        if (urlDátum.talált) /* akkor kész vagyunk */
        { 
          clearInterval(intervallum)
          urlDátum.lépésközPerc = lépésközMentés
          urlDátum.típusváltásElnyom = false
        }
        else előzőTérkép()
      }
    , 200
    )

    /*
    urlDátum.visszaAzUtsóig()   //nem jött be
    megjelenőDátum = urlDátum.megjelenít(urlDátum)
    talált = urlDátum.megjelenít(urlDátum.talált)
    */
  }

</script>

<div>
  <!------------------- sat24   (látható, infravörös) ------------------------>
  <input type="radio" id="sat" bind:group={lap} value="sat24" checked>  <label for="sat"><b>Sat24 </b></label>
  {#if lap == "sat24"}
  <span class="nagykep">
  (
    <input type="radio" id="viz" bind:group={urlDátum.képtípus} name="feny" value="visual" checked>  <label for="viz">Látható</label>
    <input type="radio" id="inf" bind:group={urlDátum.képtípus} name="feny" value="infraPolair">     <label for="inf">Infravörös</label>
  )
  </span>
  <span class="kiskep">
    <select bind:value={urlDátum.képtípus}>
      <option value="visual">Látható</option>
      <option value="infraPolair">Infravörös</option>
    </select>
  </span>
  {/if}
  <span class="nagykep"><br /></span>

  <!------------------- metnet   (radar, műhold) ------------------------>
  <input type="radio" id="metnet" bind:group={lap} value="metnet">      <label for="metnet"><b>Metnet</b></label>
  {#if lap == "metnet"}
  <span class="nagykep">
  (
    <input type="radio" id="komp" bind:group={urlDátum.képtípus} value="kompozit" checked> <label for="komp">Kompozit</label>
    <input type="radio" id="mix" bind:group={urlDátum.képtípus} value="mix">               <label for="mix">Mix</label>
    <input type="radio" id="mh" bind:group={urlDátum.képtípus} value="muhold">             <label for="mh">Műhold</label>
  )
   </span>
  <span class="kiskep">
    <select bind:value={urlDátum.képtípus}>
      <option value="kompozit">Kompozit</option>
      <option value="mix">Mix</option>
      <option value="muhold">Műhold</option>
    </select>
  </span>
  {/if}
  <span class="nagykep"><br /></span>

  <!------------------- met   (radar, műhold) ------------------------>
  <input type="radio" id="met" bind:group={lap} value="met">            <label for="met"><b>OMSZ</b></label>
  {#if lap == "met"}
  <span class="nagykep">
  ( radar:
    <input type="radio" id="orsz" bind:group={urlDátum.képtípus} value="RccW" checked> <label for="orsz">Országos</label>
    <input type="radio" id="eny"  bind:group={urlDátum.képtípus} value="RccE">         <label for="eny">ÉNy</label>
    <input type="radio" id="dny"  bind:group={urlDátum.képtípus} value="RccF">         <label for="dny">DNy</label>
    <input type="radio" id="ek"   bind:group={urlDátum.képtípus} value="RccH">         <label for="ek">ÉK</label>
    <input type="radio" id="dk"   bind:group={urlDátum.képtípus} value="RccG">         <label for="dk">DK</label>
    &nbsp; &nbsp; &nbsp; &nbsp;
    műhold:
    <input type="radio" id="v"    bind:group={urlDátum.képtípus} value="BMwA">         <label for="v">Látható</label>
    <input type="radio" id="ir"   bind:group={urlDátum.képtípus} value="bMwA">         <label for="ir">Infravörös</label>
    <input type="radio" id="euv"  bind:group={urlDátum.képtípus} value="BMnA">         <label for="euv">Eu nappali</label>
    <input type="radio" id="eui"  bind:group={urlDátum.képtípus} value="bMw9">         <label for="eui">Eu infra</label>
    <input type="radio" id="euc"  bind:group={urlDátum.képtípus} value="BMwC">         <label for="euc">Eu látható-infra kompozit</label>
  )
   </span>
  <span class="kiskep">
    <select bind:value={urlDátum.képtípus}>
      <optgroup label="radar">
        <option value="RccW">Országos</option>
        <option value="RccE">ÉNy</option>
        <option value="RccF">DNy</option>
        <option value="RccH">ÉK</option>
        <option value="RccG">DK</option>
      </optgroup>
      <optgroup label="műhold">
        <option value="BMwA">Látható</option>
        <option value="bMwA">Infravörös</option>
        <option value="BMnA">Eu nappali</option>
        <option value="bMw9">Eu infra</option>
        <option value="BMwC">Eu látható-infra kompozit</option>
      </optgroup>
    </select>
  </span>
  {/if}
</div>

<div>
  lépésköz
  <select value={urlDátum.lépésközPerc+""} on:change="{lépésközBeáll}">  <!-- bind:value nem műx; kell a +"" -->
    <option value="5" selected>5 perc</option>
    <option value="10">10 perc</option>
    <option value="15">15 perc</option>
    <option value="30">30 perc</option>
    <option value="60">1 óra</option>
    <option value="1440">24 óra</option>
    <option value="6000">100 óra :-/</option>
    <option value="60000">1000 óra :-/</option>
  </select>  ({urlDátum.pontosságPerc} perccel osztható)
  <button on:click="{alapra}">alapra</button>
</div>
<div>
  <button on:click="{előzőTérkép}" disabled={visszaSzürke}>&lt;</button>
  {megjelenőDátum} (helyi idő)
  <button on:click="{következőTérkép}" disabled={előreSzürke}>&gt;</button>
</div>
<div>
  animáció: <input type="number" size="4" min=1 bind:value={animSeb} /> kocka/mp, azaz egy kocka {animKockahossz} ezredmp <br />
  <button on:click="{indítVissza}" disabled={visszaSzürke}>&lt;&lt;</button>
  <button on:click="{állj}" disabled={álljSzürke}>állj</button>
  <button on:click="{indítElőre}" disabled={előreSzürke}>&gt;&gt;</button>
</div>
<div>
  <img class=terkep src="{urlDátum.url()}" alt="" on:load={képBetöltve} on:error={képHiba}>
</div>
<div class=opc>
  {üzenet} {talált}
</div>


<style>
  label {display: inline;}  /* public/global.css-ben valamiért block van */
  img.terkep {max-width: 100%; height: auto;}
  div.opc {display: none;}
  span.nagykep {display: none;}
  @media screen and (min-width: 1024px)
  { img.terkep {max-width: 80%; height: auto;} 
    div.opc {display: initial; color: lightgray;} /* lehet, mástól kéne függővé tenni */
    span.nagykep {display: initial;}
    span.kiskep {display: none;}
  }
</style>