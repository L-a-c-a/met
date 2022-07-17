<script lang="ts">
  
  //let fajlnevIdo = 202207150850 //ééééhhnnóópp UTC-ben
  const datum2fajlnev = (d:Date):string => d.toISOString().replaceAll(/[-T:]/g, '').substring(0, 11) + "0"
  // dátum -> "éééé-hh-nnTóó:pp:....." -> "ééééhhnnóópp....." -> "ééééhhnnóóp0"

  let fajlnevIdo:number = +datum2fajlnev(new Date())
  
  const elozoTerkep = (event:Event) =>
  {
    fajlnevIdo-=5
    if (fajlnevIdo%100 >= 60) fajlnevIdo-=40
    if (fajlnevIdo/100%100 >= 24) fajlnevIdo-=7600
  }

  const kovetkezoTerkep = (event:Event) =>
  {
    fajlnevIdo+=5
    if (fajlnevIdo%100 >= 60) fajlnevIdo+=40
    if (fajlnevIdo/100%100 >= 24) fajlnevIdo+=7600
  }

</script>

<button on:click="{elozoTerkep}">&lt;</button>
<input bind:value="{fajlnevIdo}" />
<button on:click="{kovetkezoTerkep}">&gt;</button>
<div>
  <img src="https://hu.sat24.com/image?type=visual&region=hu&timestamp={fajlnevIdo}&anyadkess={new Date().getMilliseconds()}" alt="">
</div>