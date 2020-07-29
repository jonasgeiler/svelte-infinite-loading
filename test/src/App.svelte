<script>
	import { onMount } from 'svelte';
	import InfiniteLoading from '../../src/InfiniteLoading.svelte';

	const api = 'https://hn.algolia.com/api/v1/search_by_date?tags=story';

	let page = 1;
	let list = [];
	let newsType = 'story';
	let infiniteId = +new Date();

	function infiniteHandler({ detail }) {
		fetch(`${api}&page=${page}&tags=${newsType}`)
				.then(response => response.json())
				.then(data => {
					if (data.hits.length) {
						page += 1;
						list = [...list, ...data.hits];
						detail.loaded();
					} else {
						detail.complete();
					}
				});
	}

	function changeType() {
		page = 1;
		list = [];
		infiniteId += 1;
	}
</script>

<div id="app">
	<header class="hacker-news-header">
		<a target="_blank" href="http://www.ycombinator.com/">
			<img src="https://news.ycombinator.com/y18.gif" alt="Logo">
		</a>
		<span>Hacker News</span>
		<select bind:value={newsType} on:change={changeType}>
			<option value="story">Story</option>
			<option value="poll">Poll</option>
			<option value="show_hn">Show hn</option>
			<option value="ask_hn">Ask hn</option>
			<option value="front_page">Front page</option>
		</select>
	</header>

	{#each list as item, index (item.objectID)}
		<div class="hacker-news-item" data-num={index + 1}>
			<a target="_blank" href={item.url}>{item.title}</a>
			<p>
				<span>{item.points}</span>
				points by
				<a target="_blank" href="https://news.ycombinator.com/user?id={item.author}">{item.author}</a>
				|
				<a target="_blank" href="https://news.ycombinator.com/item?id={item.objectID}">{item.num_comments} comments</a>
			</p>
		</div>
	{/each}

	<InfiniteLoading on:infinite={infiniteHandler} identifier={infiniteId} />
</div>

<style>
	:global(body) {
		padding-top: 28px;
		background-color: #f6f6ef;
	}
	.hacker-news-header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		padding: 4px 20px;
		line-height: 14px;
		background-color: #f60;
	}
	.hacker-news-header img {
		border: 1px solid #fff;
		vertical-align: middle;
	}
	.hacker-news-header span {
		font-family: Verdana, Geneva, sans-serif;
		font-size: 14px;
		font-weight: bold;
		vertical-align: middle;
	}
	.hacker-news-item {
		margin: 10px 0;
		padding: 0 10px 0 40px;
		line-height: 16px;
		font-size: 14px;
	}
	.hacker-news-item::before {
		content: attr(data-num) '.';
		float: left;
		margin-left: -40px;
		width: 32px;
		color: #888;
		text-align: right;
	}
	.hacker-news-item > a {
		color: #333;
		text-decoration: none;
	}
	.hacker-news-item > a:hover {
		color: #000;
	}
	.hacker-news-item p {
		margin: 0;
		font-size: 12px;
	}
	.hacker-news-item p, .hacker-news-item p a {
		color: #888;
	}
	.hacker-news-item p a:not(:hover) {
		text-decoration: none;
	}
</style>