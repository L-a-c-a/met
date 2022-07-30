<script lang="ts">

import { Dátum } from "./def"   //NEM .ts !!!

  //let lap:string = "sat24"  // vagy metnet (és akkor kompozit vagy mix)

  let satKéptípus:string = "visual"  // visual vagy infraPolair
  //let metnetKéptípus:string = "mix"   // kompozit vagy mix

  let urlDátum:Dátum = new Dátum  //minden okosságot az osztály csinál
  //let lépésközPerc = urlDátum.lépésközPerc  //ide is kell egy???

  const előzőTérkép = (e:Event) => //urlDátum.vissza()
  {
    urlDátum.vissza()
    urlDátum=urlDátum   //enélkül nem megy utána a kijelzett idő -- lefordítódik valami $$invalidate -ra
  }

  const következőTérkép = (e:Event) => //urlDátum.előre()
  {
    urlDátum.előre()
    urlDátum=urlDátum   //enélkül nem megy utána a kijelzett idő
  }

  const lépésközBeáll = (e:Event) => // <select> on:change hívja
  {
    let lépésköz:number = +(e.target as HTMLInputElement).value  // e.target.value is működne, de a vscode panaszkodik
    urlDátum.lépésközPerc = lépésköz
  }

  let intervallum:NodeJS.Timer
  let animSeb = 1
  $: animKockahossz = 1000 / animSeb
  let visszaSzürke = false
  let álljSzürke = true
  let előreSzürke = false
/*
  const indít = (előjel:number) =>
  {
    intervallum = setInterval(előjel<0 ? ()=>urlDátum.vissza() : ()=>urlDátum.előre(), animKockahossz)
  }
*/
  const indítVissza = () => 
  {
    intervallum = setInterval(()=>{ urlDátum.vissza(); urlDátum=urlDátum }, animKockahossz) 
    álljSzürke = false
    előreSzürke = true
  }
  const indítElőre = () => 
  {
    intervallum = setInterval(()=>{ urlDátum.előre(); urlDátum=urlDátum }, animKockahossz)
    álljSzürke = false
    visszaSzürke = true
  }
  const állj = () =>
  {
    clearInterval(intervallum)
    visszaSzürke = false
    álljSzürke = true
    előreSzürke = false
  }

</script>

<div>
<!--
  <input type="radio" id="sat" bind:group={lap} value="sat24" checked>  <label for="sat">Sat24</label>
  {#if lap == "sat24"}
-->
    <input type="radio" id="viz" bind:group={satKéptípus} name="feny" value="visual" checked>  <label for="viz">Látható</label>
    <input type="radio" id="inf" bind:group={satKéptípus} name="feny" value="infraPolair">     <label for="inf">Infravörös</label>
<!--
  {/if}
  <br />
  <input type="radio" id="metnet" bind:group={lap} value="metnet">      <label for="metnet">Metnet</label>
  {#if lap == "metnet"}
    <input type="radio" id="komp" bind:group={metnetKéptípus} value="kompozit"> <label for="komp">Kompozit</label>
    <input type="radio" id="mix" bind:group={metnetKéptípus} value="mix" checked>       <label for="mix">Mix</label>
  {/if}
-->
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
  <button on:click="{()=>urlDátum = new Dátum}">alapra</button>
</div>
<div>
  <button on:click="{előzőTérkép}">&lt;</button>
  {urlDátum.toLocaleString('sv', {dateStyle: 'short', timeStyle: 'short' })} (helyi idő)   <!--HEKK! sv-vel vagy eo-val lesz iso-szerű, de eo-val nincs vezető nulla a dátumban -->
  <button on:click="{következőTérkép}">&gt;</button>
</div>
<div>
  animáció: <input type="number" size="4" min=1 bind:value={animSeb} /> kocka/mp, azaz egy kocka {animKockahossz} ezredmp <br />
  <button on:click="{indítVissza}" disabled={visszaSzürke}>&lt;&lt;</button>
  <button on:click="{állj}" disabled={álljSzürke}>állj</button>
  <button on:click="{indítElőre}" disabled={előreSzürke}>&gt;&gt;</button>
</div>
<div>
<!--
  {#if lap == "sat24"}
-->
    <img src="https://hu.sat24.com/image?type={satKéptípus}&region=hu&timestamp={urlDátum.urlrész()}&anyadkess={new Date().getMilliseconds()}" alt="">
<!--
  {/if}
  {#if lap == "metnet"}
    {#if metnetKéptípus = "mix"}
      <img src="https://www.metnet.hu/img/radar_metnet/radarmix.jpg?date={urlDátum.urlrész()}" alt=""> <!-- nem jó, ez helyi idő! de mindegy, ilyen kép úgyis csak egy van... vagymittomén - ->
    {/if}
  {/if}
-->
</div>


<style>
  label {display: inline;}  /* public/global.css-ben valamiért block van */
</style>