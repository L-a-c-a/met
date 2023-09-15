(más projektekben oe.md)

*------------ MetDátum osztály -----------* (üzenetű kommit után)

Feladat: :10, :25, :40, :55 lépésközű térképek `alapra()`-ja, konstruktora (met és metnet műholdképei)  
Nem szabad lépésközPerc=15-tel hívni `super.alapra()`-t, mert mod(lekerekített_idő, 15) vagy 10, vagy nem. Ha nem, az isten sem állítja meg `biztonságiHatár`ig.  
`super.alapra(5, 5)` megoldja (de meg KÉNE rendesen csinálni)  
De nem utána közvetlenül 15-re állítani lépésközPerc-et, azzal meg kell várni, míg végez `visszaAzUtsóig()`. Vagy: az állítja be.  
Ez bevált: `visszaAzUtsóig()` menti (ha a 15-öt, akkor a 15-öt), 5-re állítja (mármint `pontosságPerc`re) és visszaállítja.  

Két helyen van műholdkép a met-en,
- Aktuális időjárás alatt két fül,
- Aktuális időjárás > Műhold alatt még öt (a hétből), ezek európai térképek. És .png-k!  
  bMw9 : infra (10,8 µm)   - .jpg !  
  BMwC : látható-infra kompozit  - .jpg !  
  BMeJ : éjszakai kompozit  
  BMnA : nappali kompozit  
... végül is csak egy .png lett.

*--------------- új térképek -------------*

KÉNE: pontosságPerc, lépésközPerc (és esetleg egy új: a térképek ideje mod lépésközPerc) képtípus-függő, képtípusváltás átállítja  
lekerekít() meg mindhármat használja  
Meg lehetne csinálni `képKiterj()`-t [JavaScript Switch Expressions](https://medium.com/@numberpicture/nugget-javascript-switch-expressions-e3bf059eefb0) módszerrel (mint `ZZ.svelte funKomponens`) - &#10004;  
(nyilas függvény lett belőle return-os metódus helyett - `return` után nem lehet új sorban kezdeni a kifejezést!)

KÉNE: Sok a rádiógomb; az egyik szintet át kéne alakítani pl. `select`re, hogy telefonon is nézzen ki valahogy. Figyelemre méltó: `select optgroup=`
``` 
    <input type="radio" id="viz" bind:group={urlDátum.képtípus} name="feny" value="visual" checked>  <label for="viz">Látható</label>
    <input type="radio" id="inf" bind:group={urlDátum.képtípus} name="feny" value="infraPolair">     <label for="inf">Infravörös</label>
```
 helyett:
```
    <select bind:value={urlDátum.képtípus}>
      <option value="visual">Látható</option>
      <option value="infraPolair">Infravörös</option>
    </select>
```
vagy `value=` és `on:change=`, ha a `bind:value` megint nem műx... de műx.  

