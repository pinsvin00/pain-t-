<script lang="ts">
  import { onMount } from 'svelte';
  import { Dragger } from './Dragger';
  import { DrawingMode } from './drawingMode';
  import { Paint } from './paint';

  let paint : Paint;
  let dragger : Dragger;

  onMount(() => {
    paint = new Paint();
    dragger = new Dragger("canvasDragger", "canvas");


    const render = () => {
      paint.render();
      window.requestAnimationFrame(render);
    }
    window.requestAnimationFrame(render);

  })

  const select = (mode : DrawingMode) => {
    paint.setDrawingMode(mode);
  }





</script>


<div>
  <button on:click={() => {select(DrawingMode.LINE)}}>Linia</button>
  <button on:click={() => {select(DrawingMode.RECTANGLE)}}>[]</button>
  <button on:click={() => {select(DrawingMode.CIRLCE)}}>()</button>
  <button on:click={() => {select(DrawingMode.BRUSH)}}>brush</button>
  
</div>

<div>
  <canvas id="canvas" width="500" height="500" style="border: 1px solid green"></canvas>
  <button id="canvasDragger" class="dragger" style="position: absolute; top: 550px; left: 550px;">-</button>
</div>

