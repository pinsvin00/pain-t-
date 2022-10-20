<script lang="ts">
  import { onMount } from 'svelte';
  import { Dragger } from './Dragger';
  import { DrawingModes } from './drawing_modes';
  import { Paint } from './paint';

  let paint : Paint;
  let dragger : Dragger;

  onMount(() => {
    paint = new Paint();
    dragger = new Dragger("canvasDragger", "canvas")
  })

  const select = (mode : DrawingModes) => {
    paint.mode = mode;

  }



</script>


<div>
  <button on:click={() => {select(DrawingModes.LINE)}}>Linia</button>
  <button on:click={() => {select(DrawingModes.RECTANGLE)}}>[]</button>
  <button on:click={() => {select(DrawingModes.CIRLCE)}}>()</button>
  <button on:click={() => {select(DrawingModes.BRUSH)}}>brush</button>
  
</div>

<div>
  <canvas id="canvas" width="500" height="500" style="border: 1px solid green"></canvas>
  <button id="canvasDragger" class="dragger" style="position: absolute; top: 550px; left: 550px;">-</button>
</div>

