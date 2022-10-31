<script lang="ts">
  import { onMount } from 'svelte';
  import { Dragger } from './Dragger';
  import { DrawingMode } from './drawingMode';
  import './app.css'
    import { Paint } from './paint';
    import ModalWindow from './ModalWindow.svelte';
    import { Layer } from './layer';
    import { Vector2 } from './utils';

  let paint : Paint;
  let dragger : Dragger;
  let modal: ModalWindow;

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
  <button on:click={() => {select(DrawingMode.SELECT)}}>Wybierak</button>
  <button on:click={() => {
    modal.changeVisibility();
  }}>Warstwy</button>
  <br>
  {#if paint}
      <span>Thiccness : {paint.handler.thickness}</span>
      <input type="range" min="1" max="10" bind:value={paint.handler.thickness}>
      <span>Fill(?)</span>
      <input type="checkbox" bind:checked={paint.handler.fill}  />
      <span>kolorek</span>
      <input type="color" bind:value={paint.handler.color}>

      <ModalWindow bind:this={modal} >
        <div slot="header" style="margin-bottom: 2rem"> Informacje o warstwach </div>
        <div slot="content" style="margin-bottom: 2rem">
          <button style="margin-bottom: 1rem; margin-top: 1rem" on:click={() => {
            const layer = new Layer(
              new Vector2(paint.canvas.width, paint.canvas.height), 
              new Vector2(0, 0 ), 
              paint.ctx, 
              paint.canvas
            )

            paint.layers.push(layer);
            paint.layers = paint.layers;

          }}>Dodaj warstwę</button>

          {#each paint.layers as layer, i }
            <div style="display: flex; margin-bottom: 1rem">

              {#if paint.selectedLayer === layer}
                <span style="margin-right: 3rem">Wybrana</span>
              {/if}


              <span>{layer.name}</span>

              <button style="margin-left: 2rem;" on:click={() => {
                let confirmed = window.confirm("Czy napewno chcesz usunąć tą warstwę?");
                if (confirmed) {
                  paint.layers.splice(i, 1);
                }

                paint.layers = paint.layers;
              }}>Usuń</button>
              <button style="margin-left: 2rem;" on:click={() => {
                layer.name = window.prompt("Podaj nową nazwę warstwy");
              }}>Edytuj</button>

              <button style="margin-left: 2rem;" on:click={() => {
                paint.selectedLayer = layer;
              }}>Wybierz</button>


            </div>
          {/each}


        </div>
        <div slot="footer">
          <button on:click={() => {modal.changeVisibility()}}>Zamknij</button>
        </div>
      </ModalWindow>


  {/if}


  <a id="dummy" style="visibility:hidden;">--</a>
  
</div>

<div>
  <canvas id="canvas" width="1000" height="500" style="border: 1px solid green"></canvas>
  <button id="canvasDragger" class="dragger" style="position: absolute; top: 500px; left: 1000px;">-</button>
</div>

