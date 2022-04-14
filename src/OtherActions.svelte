<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
</script>

<main>
    <button on:click={() => dispatch("completeAll")}>Complete all</button>
    <button id="btnUncheckAll" on:click={() => dispatch("uncheckAll")}>Uncheck all</button>
    <button id="btndelcomplete" on:click={() => dispatch("delCompleted")}>Delete completed</button>
</main>

<style>
    main {
        display: flex;
        width: 90%;
        justify-content: space-evenly;
    }
    button {
        width: 33%;
        background-color: rgb(10, 48, 0);
        color: rgb(206, 255, 214);
        cursor: pointer;
        border-radius: 5px;
    }
    button:hover {
        background-color: rgb(14, 70, 0);
    }
    button:active {
        color: rgb(14, 70, 0);
        background-color: rgb(206, 255, 214);
    }
    #btndelcomplete {
        background-color: rgb(185, 0, 0);
        border: 2px solid rgb(253, 166, 166);
        color: rgb(255, 179, 179);
    }
    #btndelcomplete:hover {
        background-color: rgb(177, 27, 27);
    }
    #btndelcomplete:active {
        background-color: rgb(255, 241, 241);
        color: rgb(160, 0, 0);
        border-color: rgb(160, 0, 0);
    }
    #btnUncheckAll {
        background-color: rgb(255, 252, 94);
        border: 2px solid rgb(136, 127, 0);
        color: rgb(136, 127, 0);
    }
    #btnUncheckAll:hover {
        background-color: rgb(255, 239, 13);
    }
    #btnUncheckAll:active {
        background-color: rgb(136, 127, 0);
        color: rgb(255, 252, 94);
        border-color: rgb(255, 252, 94);
    }
</style>
