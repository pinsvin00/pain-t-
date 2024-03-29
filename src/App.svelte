<script lang="ts">
  import { onMount } from 'svelte';
  //import { HTMLDragger } from './Dragger';
  import { DrawingMode } from './drawingMode';
  import './app.css'
  import { Paint } from './paint/paint';
  import ModalWindow from './components/ModalWindow.svelte';
  import { Layer } from './paint/layer';
  import {MouseTransformer, Vector2} from './utils';
  import {canvas, loadCanvasData} from './paint/bufferCanvasProvider';
  import {canvasBuffer, ctxBuffer} from "./paint/bufferCanvasProvider.js";

  let paint : Paint;
  //let dragger : HTMLDragger;
  let modal: ModalWindow;


  document.onpaste = async (ev) => {
    if(!paint.preferLocalOverExternal)
    {
      if(!ev.clipboardData?.items?.length) return
      const {items} = ev.clipboardData
      for(const item of items) 
      {
          if(!item.type.startsWith('image/')) continue
          const file = item.getAsFile()!
          const bitmap = await createImageBitmap(file)

          // ...
          if(paint.selectedLayer !== null)
          {
            paint.selectedLayer.bufferCtx.drawImage(bitmap, paint.lastMousePos.x, paint.lastMousePos.y, bitmap.width, bitmap.height);
          }
      }
    }
  }


  let debug = false;
  const fontOptions = [
          "Verdana",
          "Arial",
          "Courier",
          "Impact",
          "Comic Sans MS"
  ]
  const changeLayer = (layer: Layer) => {
    paint.selectedLayer = layer;
    paint.handler.layer = layer;
  }

  onMount(() => {
    loadCanvasData();
    paint = new Paint();
    paint.changeLayer = changeLayer;
    const frameCallback = () => {
      paint.createCanvas();
      window.requestAnimationFrame(frameCallback)
    }

    document.onpaste = (event : ClipboardEvent) => {
      paint.onPaste(event);
    }

    window.requestAnimationFrame(frameCallback);
    //dragger = new HTMLDragger("canvasDragger", ["canvas", "buffer-canvas", ]);

  })



  const select = (mode : DrawingMode) => {
    paint.setDrawingMode(mode);
  }



</script>

<div>
  <button on:click={() => {select(DrawingMode.LINE)}}>Line</button>
  <button on:click={() => {select(DrawingMode.RECTANGLE)}}>Rectangle</button>
  <button on:click={() => {select(DrawingMode.CIRLCE)}}>Ellipse</button>
  <button on:click={() => {select(DrawingMode.BRUSH)}}>Brush</button>
  <button on:click={() => {select(DrawingMode.BUCKET)}}>Fill</button>
  <button on:click={() => {select(DrawingMode.TEXT)}}>Text</button>

  <button style="margin-left: 1rem" on:click={() => {select(DrawingMode.SELECT)}}>Selector</button>
  <button on:click={() => {select(DrawingMode.CUTTER)}}>Cutter</button>
  <button on:click={() => {paint.localCopiedImage = null}}>Clean image stored in cache</button>
  {#if paint}
    <button on:click={() => {paint.preferLocalOverExternal = !paint.preferLocalOverExternal}}> { (
            paint.preferLocalOverExternal ? "local" : "external")  + " img paste"}
    </button>
  {/if}


  <button style="margin-left: 1rem" on:click={() => {
    modal.changeVisibility();
  }}>Layers</button>

  <br>
  <br>
  {#if debug}
    <div>
      <button on:click={() => { paint.createCanvas() }}>DEBUG: NARYSUJ PONOWNIE</button>
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
      <span>Thickness : {paint.handler.thickness}</span>
      <input type="range" min="1" max="10" bind:value={paint.handler.thickness}>
      <span>Fill(?)</span>
      <input type="checkbox" bind:checked={paint.handler.fill}  />
      <span>Color</span>
      <input type="color" bind:value={paint.handler.color}>
      <div>
        <span>Font</span>
        <select style="margin-left: 1rem" bind:value={paint.font}>
          {#each fontOptions as font}
            <option value={font} style="font-family: {font}">
              {font}
            </option>
          {/each}
        </select>
      </div>
    <br>


      <span>Current Layer : {paint.selectedLayer.name}</span>

      <ModalWindow bind:this={modal} >
        <div slot="header" style="margin-bottom: 2rem"> Layer info </div>
        <div slot="content" style="margin-bottom: 2rem">
          <button style="margin-bottom: 1rem; margin-top: 1rem" on:click={() => {

            const layer = new Layer(
              new Vector2(paint.canvas.width, paint.canvas.height), 
              new Vector2(0, 0 )
            )

            paint.layers.push(layer);
            paint.layers = paint.layers;

          }}>Add layer</button>

          {#each paint.layers as layer, i }
            <div style="display: flex; margin-bottom: 1rem">

              {#if paint.selectedLayer === layer}
                <span style="margin-right: 3rem">✅</span>
              {:else}
                <span style="margin-right: 3rem">-</span>
              {/if}

              <span class="interactive ml-3" style="font-size: 25px;" on:mousedown={() => {
                try {
                    let buffer = paint.layers[i];
                    paint.layers[i] = paint.layers[i-1];
                    paint.layers[i-1] = buffer;
                }
                catch{}
              }}>&#8593;</span>
              <span class="interactive ml-3" style="font-size: 25px;" on:mousedown={() => {
                try {
                    let buffer = paint.layers[i];
                    paint.layers[i] = paint.layers[i+1];
                    paint.layers[i+1] = buffer;
                }
                catch{}

              }}>&#8595;</span>


              <span class="ml-3">{layer.name}</span>

              <button style="margin-left: 2rem;" on:click={() => {
                let confirmed = window.confirm("Czy napewno chcesz usunąć tą warstwę?");
                if (confirmed) {
                  paint.layers.splice(i, 1);
                }

                paint.layers = paint.layers;
              }}>Delete</button>
              <button style="margin-left: 2rem;" on:click={() => {
                layer.name = window.prompt("Podaj nową nazwę warstwy");
              }}>Edit name</button>

              <button style="margin-left: 2rem;" on:click={ async () => {
                paint.selectedLayer.saveFromBuffer();
                paint.selectedLayer = layer;
                paint.handler.layer = layer;
                paint.selectedLayer.loadOntoBuffer();
              }}>Select</button>


            </div>
          {/each}


        </div>
        <div slot="footer">
          <button on:click={() => {modal.changeVisibility()}}>Close</button>
        </div>
      </ModalWindow>




  {/if}


  <a id="dummy" style="visibility:hidden;">--</a>
  
</div>

<div>
  <div id="gui-layer"></div>
  <canvas id="canvas" width="1000" height="500" style="border: 1px solid green"></canvas>
  <canvas id="buffer-canvas" width="1000" height="500" style={debug ?  "" : 'visibility: hidden'}></canvas>

  <!-- <button id="canvasDragger" class="dragger" style="position: absolute; top: 500px; left: 1000px; width: 20px; height: 20px; border-radius: 100%"></button> -->
</div>
