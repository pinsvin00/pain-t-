<script lang="ts">
  import { onMount } from 'svelte';
  import { CanvasDragger } from './Dragger';
  import { DrawingMode } from './drawingMode';
  import './app.css'
  import { Paint } from './paint/paint';
  import ModalWindow from './components/ModalWindow.svelte';
  import { Layer } from './paint/layer';
  import { Vector2 } from './utils';
    import { loadCanvasData } from './paint/bufferCanvasProvider';

  let paint : Paint;
  let dragger : CanvasDragger;
  let modal: ModalWindow;

  let debug = true;

  onMount(() => {
    loadCanvasData();
CanvasDragger
    paint = new Paint();
    dragger = new CanvasDragger("canvasDragger", ["canvas", "buffer-canvas"]);

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
  canvas {
    background-image: url("static/smol_mesh.png");
    background-repeat: repeat;
  }

  .interactive:hover {
    color: red;
    cursor: pointer;
  }

  .ml-3 { 
    margin-left: 3rem;
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
  {#if debug}
    <div>
      <button on:click={() => { paint.drawCanvas(); }}>DEBUG: NARYSUJ PONOWNIE</button>
      <button on:click={() => {
        paint.layers.forEach(el=> console.log(el));
        }}>DEBUG: WYLOGUJ WSZYSTKIE WARSTWY</button>
      <button on:click={() => {
        paint.selectedLayer.generateImage();
        }}>DEBUG: STWÓRZ AKTUALNĄ WARSTWĘ </button>
    </div>
    <br>
  {/if}


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
              new Vector2(0, 0 )
            )

            paint.layers.push(layer);
            paint.layers = paint.layers;

          }}>Dodaj warstwę</button>

          {#each paint.layers as layer, i }
            <div style="display: flex; margin-bottom: 1rem">

              {#if paint.selectedLayer === layer}
                <span style="margin-right: 3rem">✅</span>
              {:else}
                <span style="margin-right: 3rem">💅</span>              
              {/if}

              <span class="interactive ml-3" style="font-size: 25px;" on:mousedown={() => {
                let upper = paint.layers[i-1]
                let current = paint.layers[i];

                let buffer = current;
                current = upper;
                upper = buffer;
              }}>&#8593;</span>
              <span class="interactive ml-3" style="font-size: 25px;" on:mousedown={() => {
                let current = paint.layers[i]
                let lower = paint.layers[i+1];
                let buffer = current;

                current = lower;
                lower = buffer;

              }}>&#8595;</span>


              <span class="ml-3">{layer.name}</span>

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
                paint.handler.layer = layer;
                console.log(layer);
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
  <canvas id="buffer-canvas" width="1000" height="500" style="visibility: hidden"></canvas>

  <button id="canvasDragger" class="dragger" style="position: absolute; top: 500px; left: 1000px; width: 20px; height: 20px; border-radius: 100%"></button>
</div>

