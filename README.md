<p align="center"><img src="./static/logo.svg" alt="InfiniteLogo" width="225"></p>
<h2 align="center">svelte-infinite-loading</h2>
<p align="center">An infinite scroll component for Svelte apps</p>
<p align="center">
  <a href="https://npmjs.com/package/svelte-infinite-loading"><img src="https://img.shields.io/npm/v/svelte-infinite-loading?style=for-the-badge" alt="NPM VERSION"></a>
  <a href="https://npmjs.com/package/svelte-infinite-loading"><img src="https://img.shields.io/npm/dt/svelte-infinite-loading?style=for-the-badge" alt="NPM DOWNLOADS"></a>
  <a href="https://npmjs.com/package/svelte-infinite-loading"><img src="https://img.shields.io/librariesio/release/npm/svelte-infinite-loading?style=for-the-badge" alt="DEPENDENCIES"></a>
</p>
<p align="center">
  <a href="#about">About</a> •
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#api">API</a> •
  <a href="#examples--demo">Examples</a> •
  <a href="#development">Development</a> •
  <a href="#license">License</a>
</p>

## About

An infinite scroll component for Svelte, to help you implement an infinite scroll list more easily.  
This is heavily inspired by [vue-infinite-loading](https://peachscript.github.io/vue-infinite-loading/) and uses most of its code and functionality!

### Features

- Mobile friendly
- Built-in spinners
- 2-directional support
- Load result message display

## Installation

> If you're using this component in a Sapper application, make sure to install the package to `devDependencies`!  
> [More Details](https://github.com/sveltejs/sapper-template#using-external-components)

With npm:

```shell
$ npm install svelte-infinite-loading
```

With yarn:

```shell
$ yarn add svelte-infinite-loading
```

With [pnpm](https://pnpm.js.org/) (recommended):

```shell
$ npm i -g pnpm
$ pnpm install svelte-infinite-loading
```

From CDN (via [unpkg](https://unpkg.com/)):

```html
<!-- UMD -->
<script src="https://unpkg.com/svelte-infinite-loading@^1/dist/svelte-infinite-loading.js"></script>

<!-- ES Module -->
<script src="https://unpkg.com/svelte-infinite-loading@^1/dist/svelte-infinite-loading.mjs"></script>
```

## Usage

```svelte
<script lang="ts">
	import InfiniteLoading, { type StateChanger } from 'svelte-infinite-loading';

	type Post = { id: number; title: string };

	let page = 0;
	const pageSize = 20;
	let items: Post[] = $state([]);
	async function loadMore(stateChanger: StateChanger) {
		try {
			const res = await fetch(`/api/posts?page=${page}&limit=${pageSize}`);
			const data = (await res.json()) as Post[];

			if (data.length === 0) {
				stateChanger.complete();
				return;
			}

			items = [...items, ...data];
			page += 1;
			stateChanger.loaded();
		} catch {
			stateChanger.error();
		}
	}
</script>

<ul>
	{#each items as item (item.id)}
		<li>{item.title}</li>
	{/each}
</ul>

<InfiniteLoading onInfinite={loadMore} />
```

## API

### Props

| Prop                      | Type                                                            | Default      | Description                                                                                                                                              |
| ------------------------- | --------------------------------------------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `distance`                | `number`                                                        | `100`        | Triggers `onInfinite` when the remaining scroll distance reaches this threshold (top or bottom depending on `direction`).                                |
| `spinnerType`             | `'default' \| 'bubbles' \| 'circles' \| 'spiral' \| 'wavedots'` | `'default'`  | Selects a built-in spinner. You can also override with the `spinner` snippet.                                                                            |
| `direction`               | `'top' \| 'bottom'`                                             | `'bottom'`   | Sets the loading direction.                                                                                                                              |
| `forceUseInfiniteWrapper` | `boolean \| string`                                             | `false`      | Controls which scroll container is used: `true` for nearest `infinite-wrapper` / `data-infinite-wrapper`, string for CSS selector, fallback to `window`. |
| `identifier`              | `any`                                                           | `Date.now()` | Resets the component when the value changes (useful for filters/tabs).                                                                                   |

### Event

`onInfinite(stateChanger: StateChanger) => Promise<void> | void`

Fires when the threshold (`distance`) is reached. Use `stateChanger` methods to drive state:

- `stateChanger.loaded()` marks a successful load and keeps listening.
- `stateChanger.complete()` ends loading and shows either `noResults` (if nothing loaded yet) or `noMore`.
- `stateChanger.error()` shows the error snippet.
- `stateChanger.reset()` resets the component (equivalent to changing `identifier`).

### Snippets

| Snippet     | Signature               | Default behavior                                                       |
| ----------- | ----------------------- | ---------------------------------------------------------------------- |
| `noResults` | `Snippet`               | Shown when `complete()` is called before any `loaded()`.               |
| `noMore`    | `Snippet`               | Shown when `complete()` is called after at least one `loaded()`.       |
| `error`     | `Snippet<[() => void]>` | Shown when `error()` is called. Receives `attemptLoad` retry callback. |
| `spinner`   | `Snippet<[boolean]>`    | Shown while loading. Receives `isFirstLoad` flag.                      |

## Examples / Demo

- [Hacker News](https://svelte.dev/repl/c053fb0b13154b07a503ac04e0cb2c66)
- [Hacker News with Filter](https://svelte.dev/repl/73d404d5a26a47db969c4ebc154e8079)
- [Hacker News with Top Direction](https://svelte.dev/repl/9a04b19fcf5f4da0bead27f1cdf55cfb)
- [Hacker News using svelte-tiny-virtual-list](https://svelte.dev/repl/2239cc4c861c41d18abbc858248f5a0d)

## Development

### Developing

```sh
npm run dev
npm run dev -- --open
```

Everything inside `src/lib` is part of the library. Everything inside `src/routes` can be used as a showcase or preview app.

### Building

```sh
npm pack
npm run build
```

Preview production build:

```sh
npm run preview
```

### Publishing

```sh
npm publish
```

## License

[MIT License](https://github.com/jonasgeiler/svelte-infinite-loading/blob/master/LICENSE)
