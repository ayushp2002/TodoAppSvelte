<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let newTask = "";
</script>

<main>
    <input type="text" name="newTask" bind:value={newTask} />
    <button on:click={() => dispatch("add")}>Add task</button>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        width: 100%;
    }
    input {
        border: 1px solid black;
        border-radius: 6px;
    }
    button {
        border-radius: 6px;
        background-color: rgb(10, 48, 0);
        color: rgb(206, 255, 214);
        padding: 10px;
        cursor: pointer;
    }
    button:hover {
        background-color: rgb(14, 70, 0);
    }
    button:active {
        color: rgb(14, 70, 0);
        background-color: rgb(206, 255, 214);
    }
</style>
