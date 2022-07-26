<script lang="ts">

import { Dátum } from "./def"   //NEM .ts !!!

  let képtípus:string = "visual"  // visual vagy infraPolair

  let urlDátum:Dátum = new Dátum  //minden okosságot az osztály csinál

  const előzőTérkép = (event:Event) => //urlDátum.vissza()
  {
    urlDátum.vissza()
    urlDátum=urlDátum   //enélkül nem megy utána a kijelzett idő
  }

  const következőTérkép = (event:Event) => //urlDátum.előre()
  {
    urlDátum.előre()
    urlDátum=urlDátum   //enélkül nem megy utána a kijelzett idő
  }

</script>

<div>
  <input type="radio" id="viz" bind:group={képtípus} name="feny" value="visual" checked>  <label for="viz">Látható</label>
  <input type="radio" id="inf" bind:group={képtípus} name="feny" value="infraPolair">     <label for="inf">Infravörös</label>
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