<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let taskText;
    export let complete;
</script>

<main>
    <div class="task">
        {#if complete}
            <input
                type="checkbox"
                id="checkbox"
                on:click={() =>
                    dispatch("check", {
                        status: document.getElementById("checkbox").checked,
                    })}
                checked
            />
        {:else}
            <input
                type="checkbox"
                id="checkbox"
                on:click={() =>
                    dispatch("check", {
                        status: document.getElementById("checkbox").checked,
                    })}
            />
        {/if}
        <p>{taskText}</p>
    </div>
    <div class="action">
        <button id="edit" on:click={() => dispatch("edit")}>Edit</button>
        <button id="delete" on:click={() => dispatch("remove")}>Delete</button>
    </div>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        width: 100%;
        border: 1px solid rgb(169, 195, 255);
        background-color: rgb(203, 218, 255);
        border-radius: 12px;
        padding-top: 10px;
        margin-bottom: 15px;
    }
    .task {
        display: flex;
        align-items: center;
        padding: 0 20px 10px 20px;
    }
    #checkbox {
        margin-bottom: 0;
        height: 25px;
        width: 25px;
        border-radius: 7px;
        border: 2px solid rgb(6, 77, 0);
    }
    p {
        margin: 0 0 0 10px;
        max-width: 85%;
    }
    .action {
        width: 100%;
        text-align: center;
    }
    button {
        width: 45%;
        cursor: pointer;
        border-radius: 5px;
    }
    #edit {
        background-color: rgb(255, 255, 255);
        border: 1px solid rgb(0, 0, 0);
    }
    #edit:hover {
        background-color: rgb(221, 221, 221);
    }
    #edit:active {
        background-color: rgb(56, 56, 56);
        color: rgb(255, 255, 255);
        border-color: rgb(255, 255, 255);
    }
    #delete {
        background-color: rgb(185, 0, 0);
        border: 2px solid rgb(253, 166, 166);
        color: rgb(255, 179, 179);
    }
    #delete:hover {
        background-color: rgb(185, 30, 30);
    }
    #delete:active {
        background-color: rgb(255, 241, 241);
        color: rgb(160, 0, 0);
        border-color: rgb(160, 0, 0);
    }
</style>
