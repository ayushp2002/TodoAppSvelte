<script>
	import Task from "./Task.svelte";
	import Input from "./Input.svelte";
	import Filters from "./Filters.svelte";
	import OtherActions from "./OtherActions.svelte";

	let ctr = 1;
	let completeCount = 0;
	let tasks = [
		{
			id: 0,
			text: "This is a Todo",
			complete: false,
		},
	];
	let filter = "all";
	let newTaskText = "";

	$: updateCompleteCount(tasks);
	$: completeCount = completeCount;
	$: ctr = ctr;

	function addNewTask(taskText) {
		if (newTaskText.length > 0) {
			tasks.push({ id: ctr, text: newTaskText, complete: false });
			ctr = ctr + 1;
			tasks = tasks;
		}
	}
	function deleteTask(index) {
		if (index != undefined) {
			tasks.splice(
				tasks.indexOf(tasks.find((elem) => elem.id == index)),
				1
			);
			tasks = tasks;
			ctr = ctr - 1;
		}
	}
	function editTask(index) {
		if (index != undefined) {
			let newText = prompt("Enter new text");
			if (newText != undefined) {
				tasks[
					tasks.indexOf(tasks.find((elem) => elem.id == index))
				].text = newText;
			}
		}
	}
	function updateCompleteCount(items) {
		completeCount = 0;
		items.forEach((item) => {
			if (item.complete) {
				completeCount = completeCount + 1;
			}
		});
	}
	function completeAll() {
		tasks.forEach((task) => {
			task.complete = true;
		});
		tasks = tasks;
	}
	function uncheckAll() {
		tasks.forEach((task) => {
			task.complete = false;
		});
		tasks = tasks;
	}
	function delCompleted() {
		for (let i = tasks.length - 1; i >= 0; i--) {
			if (tasks[i].complete) {
				deleteTask(tasks[i].id);
			}
		}
		tasks = tasks;
	}
</script>

<main>
	<div class="container">
		<div class="leftpane">
			<h1>Todo</h1>
			<Input bind:newTask={newTaskText} on:add={() => addNewTask()} />
			<h2>Filters</h2>
			<Filters
				on:filter={(e) => {
					filter = e.detail.filterType;
					tasks = tasks;
				}}
			/>
			<h2>Other Actions</h2>
			<OtherActions
				on:completeAll={() => completeAll()}
				on:uncheckAll={() => uncheckAll()}
				on:delCompleted={() => delCompleted()}
			/>
		</div>
		<div class="rightpane">
			<h2>{completeCount} of {ctr} Tasks completed</h2>
			<ul>
				{#each tasks as task}
					<li>
						{#if filter == "all"}
							<Task
								bind:taskText={task.text}
								bind:complete={task.complete}
								on:remove={() => deleteTask(task.id)}
								on:edit={() => editTask(task.id)}
								on:check={(e) => {
									task.complete = !task.complete;
								}}
							/>
						{:else if filter == "pending"}
							{#if !task.complete}
								<Task
									bind:taskText={task.text}
									bind:complete={task.complete}
									on:remove={() => deleteTask(task.id)}
									on:edit={() => editTask(task.id)}
									on:check={(e) => {
										task.complete = !task.complete;
									}}
								/>
							{/if}
						{:else if filter == "completed"}
							{#if task.complete}
								<Task
									bind:taskText={task.text}
									bind:complete={task.complete}
									on:remove={() => deleteTask(task.id)}
									on:edit={() => editTask(task.id)}
									on:check={(e) => {
										task.complete = !task.complete;
									}}
								/>
							{/if}
						{/if}
					</li>
				{/each}
			</ul>
		</div>
	</div>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.container {
		display: flex;
		justify-content: space-between;
		width: 85vw;
		background-color: rgb(225, 234, 255);
		padding: 10px 20px;
		margin: 20px;
		border-radius: 15px;
		box-shadow: 0 0 10px #00000041;
	}
	.leftpane {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 45%;
	}
	.rightpane {
		width: 50%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
	}
	ul {
		margin: 0;
		list-style: none;
		width: 100%;
		padding: 0;
	}
</style>
