<script lang="ts">
import { onMount } from "svelte";

import { Dátum } from "./def"   //NEM .ts !!!

  const datum2fajlnev = (d:Date):string =>
    { if (d) 
      {
        d.setMinutes(Math.trunc(d.getMinutes()/5) * 5, 0, 0)
        return d.toISOString().replaceAll(/[-T:]/g, '').substring(0, 12)
      }
      else return ""
    }

  let képtípus:string = "visual"  // visual vagy infraPolair
  let lépésközPerc:number = 5

  let fájlnévDátum:Date
  
  const fajlnevDatumInic = () =>
  {
    let d:Date = new Date()
    d.setMinutes(Math.trunc(d.getMinutes()/5) * 5, 0, 0)
    fájlnévDátum = d
  }
  onMount(fajlnevDatumInic)

  const előzőTérkép = (event:Event) =>
  {
    let d:Date = fájlnévDátum
    d.setMinutes(d.getMinutes()-lépésközPerc)
    fájlnévDátum = d
  }

  const következőTérkép = (event:Event) =>
  {
    let d:Date = fájlnévDátum
    d.setMinutes(d.getMinutes()+lépésközPerc)
    fájlnévDátum = d
  }

  let qDátum:Dátum = new Dátum
  const qET = (event:Event) => //qDátum.vissza()
  {
    qDátum.vissza()
    qDátum=qDátum   //enélkül nem megy utána a kijelzett idő
  }

  const qKT = (event:Event) => //qDátum.előre()
  {
    qDátum.előre()
    qDátum=qDátum   //enélkül nem megy utána a kijelzett idő
  }

</script>

<div>
  <input type="radio" id="viz" bind:group={képtípus} name="feny" value="visual" checked>  <label for="viz">Látható</label>
  <input type="radio" id="inf" bind:group={képtípus} name="feny" value="infraPolair">     <label for="inf">Infravörös</label>
</div>
<div>
  <button on:click="{előzőTérkép}">&lt;</button>
  <input type="datetime-local" value="{fájlnévDátum?.toISOString().substring(0, 16)}" />  <!-- datetime-local -nak ez a formátum kell. Figyelem: UTC! -->
  <button on:click="{következőTérkép}">&gt;</button>
</div>
<div>
  <button on:click="{qET}">&lt;</button>
  {qDátum.toLocaleString('sv', {dateStyle: 'short', timeStyle: 'short' })} (helyi idő)   <!--HEKK! sv-vel vagy eo-val lesz iso-szerű, de eo-val nincs vezető nulla a dátumban -->
  <button on:click="{qKT}">&gt;</button>
</div>
<div>
  <img src="https://hu.sat24.com/image?type={képtípus}&region=hu&timestamp={datum2fajlnev(qDátum)}&anyadkess={new Date().getMilliseconds()}" alt="">
</div>



<style>
  label {display: inline;}  /* public/global.css-ben valamiért block van */
</style>