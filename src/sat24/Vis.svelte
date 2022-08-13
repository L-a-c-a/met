<script lang="ts">

import { Dátum, MetnetDátum, SatDátum } from "./def"   //NEM .ts !!!

  let lap:string = "sat24"  // vagy metnet (és akkor kompozit vagy mix)

  let lapok =
  { sat24: new SatDátum //(undefined, undefined, "infraPolair")
  , metnet: new MetnetDátum
  //... (többi laptípus)
  }

  let urlDátum:Dátum =  lapok.sat24 //minden okosságot az osztály csinál
  //let lépésközPerc = urlDátum.lépésközPerc  //ide is kell egy???

  $:{
      urlDátum = lapok[lap]
      //**/console.log("lapok[lap] változott: " + urlDátum.constructor.name )  //SatDátum vagy MetnetDátum (vagy...)
    }

  const előzőTérkép = (e:Event) => //urlDátum.vissza()
  {
    urlDátum.vissza()
    visszaSzürke = urlDátum.nincsTovábbVissza()
    előreSzürke = urlDátum.nincsTovábbElőre()
    urlDátum=urlDátum   //enélkül nem megy utána a kijelzett idő -- lefordítódik valami $$invalidate -ra
  }

  const következőTérkép = (e:Event) => //urlDátum.előre()
  {
    urlDátum.előre()
    visszaSzürke = urlDátum.nincsTovábbVissza()
    előreSzürke = urlDátum.nincsTovábbElőre()
    urlDátum=urlDátum   //enélkül nem megy utána a kijelzett idő
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
  }

  let intervallum:NodeJS.Timer
  let animSeb = 1
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
  const animálElőre = () => 
  { 
    urlDátum.előre()
    urlDátum=urlDátum
    if (urlDátum.nincsTovábbElőre()) állj()
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
    visszaSzürke = urlDátum.nincsTovábbVissza()
    álljSzürke = true
    előreSzürke = urlDátum.nincsTovábbElőre()
  }

</script>

<div>
  <input type="radio" id="sat" bind:group={lap} value="sat24" checked>  <label for="sat">Sat24</label>
  {#if lap == "sat24"}
    <input type="radio" id="viz" bind:group={urlDátum.képtípus} name="feny" value="visual" checked>  <label for="viz">Látható</label>
    <input type="radio" id="inf" bind:group={urlDátum.képtípus} name="feny" value="infraPolair">     <label for="inf">Infravörös</label>
  {/if}
  <br />
  <input type="radio" id="metnet" bind:group={lap} value="metnet">      <label for="metnet">Metnet</label>
  {#if lap == "metnet"}
    <input type="radio" id="komp" bind:group={urlDátum.képtípus} value="kompozit"> <label for="komp">Kompozit</label>
    <input type="radio" id="mix" bind:group={urlDátum.képtípus} value="mix" checked>       <label for="mix">Mix</label>
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
  {urlDátum.toLocaleString('sv', {dateStyle: 'short', timeStyle: 'short' })} (helyi idő)   <!--HEKK! sv-vel vagy eo-val lesz iso-szerű, de eo-val nincs vezető nulla a dátumban -->
  <button on:click="{következőTérkép}" disabled={előreSzürke}>&gt;</button>
</div>
<div>
  animáció: <input type="number" size="4" min=1 bind:value={animSeb} /> kocka/mp, azaz egy kocka {animKockahossz} ezredmp <br />
  <button on:click="{indítVissza}" disabled={visszaSzürke}>&lt;&lt;</button>
  <button on:click="{állj}" disabled={álljSzürke}>állj</button>
  <button on:click="{indítElőre}" disabled={előreSzürke}>&gt;&gt;</button>
</div>
<div>
  <img class=terkep src="{urlDátum.url()}" alt="">
</div>


<style>
  label {display: inline;}  /* public/global.css-ben valamiért block van */
  img.terkep {max-width: 80%; height: auto;}
</style>