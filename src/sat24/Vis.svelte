<script lang="ts">

import { Dátum } from "./def"   //NEM .ts !!!

  let képtípus:string = "visual"  // visual vagy infraPolair

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

</script>

<div>
  <input type="radio" id="viz" bind:group={képtípus} name="feny" value="visual" checked>  <label for="viz">Látható</label>
  <input type="radio" id="inf" bind:group={képtípus} name="feny" value="infraPolair">     <label for="inf">Infravörös</label>
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
  <img src="https://hu.sat24.com/image?type={képtípus}&region=hu&timestamp={urlDátum.urlrész()}&anyadkess={new Date().getMilliseconds()}" alt="">
</div>


<style>
  label {display: inline;}  /* public/global.css-ben valamiért block van */
</style>