<script>
	import { asset } from '$app/paths';
	import InfiniteLoading from '$lib/InfiniteLoading.svelte';

	const api = 'https://hn.algolia.com/api/v1/search_by_date?tags=story';

	let page = $state(1);
	/** @type {{objectID: string, story_id: string, created_at: string, title: string, author: string, url: string, points: number, num_comments: number}[]} */
	let list = $state([]);
	let newsType = $state('story');
	let infiniteId = $state(Symbol());

	/** @type {import('$lib/types').InfiniteEvent} */
	const infiniteHandler = ({ loaded, complete }) => {
		fetch(`${api}&page=${page}&tags=${newsType}`)
			.then((response) => response.json())
			.then((data) => {
				if (data.hits.length) {
					page += 1;
					list = [...list, ...data.hits];
					loaded();
				} else {
					complete();
				}
			});
	};

	function changeType() {
		page = 1;
		list = [];
		infiniteId = Symbol();
	}

	/**
	 * @param {string} url
	 */
	function formatSite(url) {
		const domain = new URL(url).hostname;
		return domain.startsWith('www.') ? domain.slice(4) : domain;
	}

	const dateFormatter = new Intl.RelativeTimeFormat('en', { style: 'long' });

	/**
	 * @param {string} createdAt
	 */
	function formatCreatedAt(createdAt) {
		const seconds = Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000);
		if (seconds <= 60) {
			return dateFormatter.format(-seconds, 'second');
		} else if (seconds <= 3600) {
			return dateFormatter.format(-Math.floor(seconds / 60), 'minute');
		} else if (seconds <= 86400) {
			return dateFormatter.format(-Math.floor(seconds / 3600), 'hour');
		} else if (seconds <= 604800) {
			return dateFormatter.format(-Math.floor(seconds / 86400), 'day');
		} else if (seconds <= 2592000) {
			return dateFormatter.format(-Math.floor(seconds / 604800), 'week');
		} else if (seconds <= 31536000) {
			return dateFormatter.format(-Math.floor(seconds / 2592000), 'month');
		} else {
			return dateFormatter.format(-Math.floor(seconds / 31536000), 'year');
		}
	}
</script>

<svelte:head>
	<title>Hacker News with Filter | svelte-infinite-loading</title>
</svelte:head>

<div id="hacker-news-with-filter-demo" class="demo-page flex-1 flex flex-column">
	<header class="primary">
		<nav class="flex-wrap">
			<i class="border white-border" aria-hidden="true">
				<img src={asset('/y18.svg')} alt="Hacker News Logo" />
			</i>
			<h5>Hacker News with Filter</h5>
			<div class="field suffix round inverse-primary max">
				<select bind:value={newsType} onchange={changeType}>
					<option value="story">Story</option>
					<option value="poll">Poll</option>
					<option value="show_hn">Show hn</option>
					<option value="ask_hn">Ask hn</option>
					<option value="front_page">Front page</option>
				</select>
				<i aria-hidden="true">arrow_drop_down</i>
			</div>
		</nav>
	</header>

	{#each list as item, index (item.objectID)}
		<article class="hacker-news-item margin" data-num={index + 1}>
			<div class="truncate">
				<a
					class="inline link"
					href={item.url || `https://news.ycombinator.com/item?id=${item.story_id}`}
					rel="external noopener noreferrer nofollow"
					target="_blank"
				>
					{item.title}
				</a>
				{#if item.url}
					(<a
						class="hacker-news-link"
						href="https://news.ycombinator.com/from?site={formatSite(item.url)}"
						target="_blank">{formatSite(item.url)}</a
					>)
				{/if}
			</div>
			<div class="truncate">
				{item.points} points by
				<a
					class="hacker-news-link"
					href="https://news.ycombinator.com/user?id={item.author}"
					target="_blank">{item.author}</a
				>
				<a
					class="hacker-news-link"
					title={item.created_at}
					href="https://news.ycombinator.com/item?id={item.story_id}"
					target="_blank">{formatCreatedAt(item.created_at)}</a
				>
				|
				<a
					class="hacker-news-link"
					target="_blank"
					href="https://news.ycombinator.com/item?id={item.story_id}"
					>{item.num_comments} comments</a
				>
			</div>
		</article>
	{/each}

	<InfiniteLoading forceUseInfiniteWrapper onInfinite={infiniteHandler} identifier={infiniteId} />
</div>

<style>
	:global(body) #hacker-news-with-filter-demo {
		--primary: #a33e00;
		--on-primary: #ffffff;
		--primary-container: #ffdbcd;
		--on-primary-container: #360f00;
		--secondary: #77574a;
		--on-secondary: #ffffff;
		--secondary-container: #ffdbcd;
		--on-secondary-container: #2c160c;
		--tertiary: #675f30;
		--on-tertiary: #ffffff;
		--tertiary-container: #efe3a9;
		--on-tertiary-container: #201c00;
		--error: #ba1a1a;
		--on-error: #ffffff;
		--error-container: #ffdad6;
		--on-error-container: #410002;
		--background: #fffbff;
		--on-background: #201a18;
		--surface: #fff8f6;
		--on-surface: #201a18;
		--surface-variant: #f5ded5;
		--on-surface-variant: #53443d;
		--outline: #85736c;
		--outline-variant: #d8c2ba;
		--shadow: #000000;
		--scrim: #000000;
		--inverse-surface: #362f2c;
		--inverse-on-surface: #fbeeea;
		--inverse-primary: #ffb596;
		--surface-dim: #e4d7d3;
		--surface-bright: #fff8f6;
		--surface-container-lowest: #ffffff;
		--surface-container-low: #fef1ec;
		--surface-container: #f8ebe7;
		--surface-container-high: #f2e5e1;
		--surface-container-highest: #ede0db;
	}

	:global(body.dark) #hacker-news-with-filter-demo {
		--primary: #ffb596;
		--on-primary: #581e00;
		--primary-container: #7c2e00;
		--on-primary-container: #ffdbcd;
		--secondary: #e6bead;
		--on-secondary: #442a1f;
		--secondary-container: #5d4034;
		--on-secondary-container: #ffdbcd;
		--tertiary: #d2c78f;
		--on-tertiary: #373106;
		--tertiary-container: #4e471b;
		--on-tertiary-container: #efe3a9;
		--error: #ffb4ab;
		--on-error: #690005;
		--error-container: #93000a;
		--on-error-container: #ffb4ab;
		--background: #201a18;
		--on-background: #ede0db;
		--surface: #181210;
		--on-surface: #ede0db;
		--surface-variant: #53443d;
		--on-surface-variant: #d8c2ba;
		--outline: #a08d85;
		--outline-variant: #53443d;
		--shadow: #000000;
		--scrim: #000000;
		--inverse-surface: #ede0db;
		--inverse-on-surface: #362f2c;
		--inverse-primary: #a33e00;
		--surface-dim: #181210;
		--surface-bright: #3f3835;
		--surface-container-lowest: #120d0b;
		--surface-container-low: #201a18;
		--surface-container: #251e1c;
		--surface-container-high: #2f2926;
		--surface-container-highest: #3a3330;
	}

	.hacker-news-item {
		---padding: 0.5rem;
		--number-width: 2.5rem;
		padding-left: calc(var(---padding) + var(--number-width)) !important;
	}

	.hacker-news-item::before {
		content: attr(data-num) '. ';
		margin-left: calc(-1 * var(--number-width));
		width: calc(var(--number-width) - var(---padding));
		color: var(--on-surface);
		float: left;
		text-align: right;
	}

	.hacker-news-link:hover {
		text-decoration: underline;
	}
</style>
