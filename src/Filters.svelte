<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();


    let activeClassAll = true;
    let activeClassPending = false;
    let activeClassComplete = false;
</script>

<main>
    <button
        id="btnFilterAll"
        class:active="{activeClassAll}"
        on:click={e => {
                dispatch("filter", { filterType: "all" });
                activeClassAll = !activeClassAll ? !activeClassAll : activeClassAll;
                activeClassPending = false;
                activeClassComplete = false;
            }}>
        All
    </button>
    <button
        id="btnFilterPending"
        class:active="{activeClassPending}"
        on:click={e => {
                dispatch("filter", { filterType: "pending" });
                activeClassPending = !activeClassPending ? !activeClassPending : activeClassPending;
                activeClassAll = false;
                activeClassComplete = false;
            }}>
        Pending
    </button>
    <button
        id="btnFilterComplete"
        class:active="{activeClassComplete}"
        on:click={e => {
                dispatch("filter", { filterType: "completed" });
                activeClassComplete = !activeClassComplete ? !activeClassComplete : activeClassComplete;
                activeClassPending = false;
                activeClassAll = false;
            }}>
        Completed
    </button>
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
        outline: none;
    }
    button:hover {
        background-color: rgb(14, 70, 0);
    }
    button:active {
        color: rgb(14, 70, 0);
        background-color: rgb(206, 255, 214);
    }
    .active {
        color: rgb(14, 70, 0);
        background-color: rgb(188, 255, 199);
    }
    .active:hover {
        background-color: rgb(164, 247, 178);
    }
</style>
