<script context="module">
	/** @type {import('@sveltejs/kit').Load} */
	export function load({ error, status }) {
		return {
			props: {
				message: `${status} ${error.message}`
			}
		};
	}
</script>

<script>
  export let message;
</script>

<h1>WTF?</h1>
<p>{message}</p>
<p><a href="/">Back to the fucking tide</a>.</p>
