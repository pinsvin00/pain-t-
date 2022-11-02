


<script lang="ts">

    let hidden = "hidden"
    export const changeVisibility = () => {
        console.log("sussy baka", hidden)
        if(hidden === 'hidden') {
            hidden = ''
        }
        else {
            hidden = 'hidden'
        }
    }

</script>

<div class={'modal-background ' + hidden}>
    <div class="modal-content">
        <slot name="header" ></slot>
        <slot name="content" ></slot>
        <slot name="footer" ></slot>

    </div>
</div>



<style>

    .hidden {
        visibility:hidden;
    }
    .modal-content {
        display: flex;
        flex-direction: column;
        background-color: aliceblue;
        width: 50%;
        padding: 1rem;

        border-radius: 30px;
    }

    .modal-background { 
        position: absolute;
        background-color: rgba(0, 0, 0, 0.7);
        top: 0;
        left : 0;

        width: 100%;
        height: 100%;

        display: flex;
        justify-content: center;
        align-items: center;  
    }
</style>