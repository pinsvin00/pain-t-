<script lang="ts">
  import { onMount } from 'svelte';
  import { Dragger } from './Dragger';
  import { DrawingMode } from './drawingMode';
  import { Paint } from './paint';
  import './app.css'

  let paint : Paint;
  let dragger : Dragger;

  onMount(() => {
    paint = new Paint();
    dragger = new Dragger("canvasDragger", "canvas");

  })

  const select = (mode : DrawingMode) => {
    paint.setDrawingMode(mode);
  }



</script>

<style>
  body {
    margin: 0;
    padding: 0;
    color: pink;
  }

  .dragger:hover {
    cursor: pointer;
    color: red;
  }

  canvas:hover { 
    cursor : crosshair;
  }

</style>

<div>
  <button on:click={() => {select(DrawingMode.LINE)}}>Linia</button>
  <button on:click={() => {select(DrawingMode.RECTANGLE)}}>Prostokąt</button>
  <button on:click={() => {select(DrawingMode.CIRLCE)}}>Koło</button>
  <button on:click={() => {select(DrawingMode.BRUSH)}}>brush</button> 
  <button on:click={() => {select(DrawingMode.BUCKET)}}>Fill</button> 
  <button on:click={() => {
    paint.painter.show();
  }}></button>
  <br>
  {#if paint}
      <span>Thiccness : {paint.handler.thickness}</span>
      <input type="range" min="1" max="10" bind:value={paint.handler.thickness}>
      <span>Fill(?)</span>
      <input type="checkbox" bind:checked={paint.handler.fill}  />
      <span>kolorek</span>
      <input type="color" bind:value={paint.handler.color}>
  {/if}


  <a id="dummy" style="visibility:hidden;">--</a>
  
</div>

<div>
  <canvas id="canvas" width="500" height="500" style="border: 1px solid green"></canvas>
  <button id="canvasDragger" class="dragger" style="position: absolute; top: 500px; left: 500px;">-</button>
</div>

