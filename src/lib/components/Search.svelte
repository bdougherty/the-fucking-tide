<script>
	export let value = '';
</script>

<form action="/search" method="post" on:submit|preventDefault>
	<h1><label for="search">Where the fuck are you?</label></h1>
	<div class="fields">
		<input type="search" id="search" name="query" bind:value />
		<button type="submit">Get the Fucking Tide</button>
	</div>
</form>

<style>
	.fields {
		display: flex;
		flex-direction: column;
		align-content: center;
		justify-content: center;
	}

	input,
	button {
		color: inherit;
		box-shadow: 0 1px 1px rgba(0, 0, 0, 0.12), 0 2px 2px rgba(0, 0, 0, 0.12),
			0 4px 4px rgba(0, 0, 0, 0.12);
	}

	input:focus,
	button:focus {
		outline: 0;
		box-shadow: 0 0 0 3px var(--primary-dark);
	}

	input {
		font-size: 1.2rem;
		min-width: 5rem;
		margin-block: 1rem;
		flex: 1 1 auto;
		border-radius: 1.2rem;
		padding: 0.4rem 0.75rem;
		text-align: center;
		-webkit-appearance: none;
		transition: box-shadow 100ms;
		border: 2px solid var(--primary);
	}

	button {
		flex: 0 0 auto;
		background-color: var(--primary);
		border: 0;
		padding: 0.4rem 0.8rem;
		margin: 0 auto 0;
		transition: all 250ms;
		font-size: 1.2rem;
		border-radius: 5px;
	}

	button:active {
		transform: scale(0.95);
		box-shadow: 0 1px 1px rgba(0, 0, 0, 0.12), 0 2px 2px rgba(0, 0, 0, 0.12);
	}
</style>
