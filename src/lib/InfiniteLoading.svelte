<script>
	import { onDestroy, onMount, tick, untrack } from 'svelte';
	import Spinner from './Spinner.svelte';

	/** @import { InfiniteLoadingProps, InfiniteLoadingEvents, InfiniteLoadingSnippets } from './types.js'; */

	const THROTTLE_LIMIT = 50;
	const LOOP_CHECK_TIMEOUT = 1000;
	const LOOP_CHECK_MAX_CALLS = 10;

	const ERROR_INFINITE_LOOP = [
		`executed the callback function more than ${LOOP_CHECK_MAX_CALLS} times for a short time, it looks like searched a wrong scroll wrapper that doest not has fixed height or maximum height, please check it. If you want to force to set a element as scroll wrapper rather than automatic searching, you can do this:`,
		'<!-- add a special attribute for the real scroll wrapper (can also be data-infinite-wrapper) -->',
		'<div infinite-wrapper>',
		'  ...',
		'  <!-- set forceUseInfiniteWrapper -->',
		'  <InfiniteLoading forceUseInfiniteWrapper>',
		'</div>',
		'or',
		'<div class="infinite-wrapper">',
		'  ...',
		'  <!-- set forceUseInfiniteWrapper as css selector of the real scroll wrapper -->',
		'  <InfiniteLoading forceUseInfiniteWrapper=".infinite-wrapper" />',
		'</div>'
	].join('\n');

	/** @type {AddEventListenerOptions} */
	const eventListenerOptions = { passive: true };

	const throttler = {
		/** @type {ReturnType<typeof setTimeout>[]} */
		timers: [],
		/** @type {Array<() => void>} */
		caches: [],

		/**
		 * @param {() => void} fn
		 */
		throttle(fn) {
			if (this.caches.indexOf(fn) === -1) {
				// cache current handler
				this.caches.push(fn);

				// save timer for current handler
				this.timers.push(
					setTimeout(() => {
						fn();

						// empty cache and timer
						this.caches.splice(this.caches.indexOf(fn), 1);
						this.timers.shift();
					}, THROTTLE_LIMIT)
				);
			}
		},

		reset() {
			// reset all timers
			this.timers.forEach((timer) => {
				clearTimeout(timer);
			});
			this.timers.length = 0;

			// empty caches
			this.caches = [];
		}
	};

	const loopTracker = {
		isChecked: false,
		/** @type {ReturnType<typeof setTimeout> | undefined} */
		timer: undefined,
		times: 0,

		track() {
			// record track times
			this.times += 1;

			// try to mark check status
			if (this.timer !== undefined) clearTimeout(this.timer);
			this.timer = setTimeout(() => {
				this.isChecked = true;
			}, LOOP_CHECK_TIMEOUT);

			// throw warning if the times of continuous calls larger than the maximum times
			if (this.times > LOOP_CHECK_MAX_CALLS) {
				console.error(ERROR_INFINITE_LOOP);
				this.isChecked = true;
			}
		}
	};

	/** @typedef {HTMLElement & { _infiniteScrollHeight?: number }} ScrollStorageElement */
	const scrollBarStorage = {
		key: /** @type {const} */ ('_infiniteScrollHeight'),

		/**
		 * @param {Window | HTMLElement} element
		 * @returns {ScrollStorageElement}
		 */
		getScrollElement(element) {
			return element === window
				? /** @type {ScrollStorageElement} */ (document.documentElement)
				: /** @type {ScrollStorageElement} */ (element);
		},

		/**
		 * @param {Window | HTMLElement} element
		 */
		save(element) {
			const target = this.getScrollElement(element);

			// save scroll height on the scroll parent
			target[this.key] = target.scrollHeight;
		},

		/**
		 * @param {Window | HTMLElement} element
		 */
		restore(element) {
			const target = this.getScrollElement(element);

			const previousScrollHeight = target[this.key];
			if (typeof previousScrollHeight === 'number') {
				target.scrollTop = target.scrollHeight - previousScrollHeight + target.scrollTop;
			}

			this.remove(target);
		},

		/**
		 * @param {ScrollStorageElement} element
		 */
		remove(element) {
			if (element[this.key] !== undefined) {
				// remove scroll height
				delete element[this.key];
			}
		}
	};

	/**
	 * @param {HTMLElement | undefined} element
	 * @returns {boolean}
	 */
	function isVisible(element) {
		return !!element && element.offsetWidth + element.offsetHeight > 0;
	}

	/** @enum {number} */
	const STATUS = {
		READY: 0,
		LOADING: 1,
		COMPLETE: 2,
		ERROR: 3
	};

	/** @type {InfiniteLoadingProps & InfiniteLoadingEvents & InfiniteLoadingSnippets} */
	let {
		/* Props: */
		distance = 100,
		spinnerType = 'default',
		direction = 'bottom',
		forceUseInfiniteWrapper = false,
		identifier = Date.now(),

		/* Events: */
		onInfinite: handleInfinite,

		/* Snippets: */
		spinner: spinnerSnippet,
		noResults: noResultsSnippet,
		noMore: noMoreSnippet,
		error: errorSnippet
	} = $props();

	let isFirstLoad = $state(true); // save the current loading whether it is the first loading
	let status = $state(STATUS.READY);
	let mounted = $state(false);
	/** @type {HTMLDivElement} */
	let thisElement;
	/** @type {Window | HTMLElement | undefined} */
	let scrollParent = $state();

	const showSpinner = $derived(status === STATUS.LOADING);
	const showError = $derived(status === STATUS.ERROR);
	const showNoResults = $derived(status === STATUS.COMPLETE && isFirstLoad);
	const showNoMore = $derived(status === STATUS.COMPLETE && !isFirstLoad);

	const stateChanger = {
		loaded: async () => {
			isFirstLoad = false;

			if (direction === 'top') {
				// wait for DOM updated
				await tick();

				if (scrollParent) scrollBarStorage.restore(scrollParent);
			}

			if (status === STATUS.LOADING) {
				await tick();
				await attemptLoad(true);
			}
		},

		complete: async () => {
			status = STATUS.COMPLETE;

			// force re-compute computed properties to fix the problem of get slot text delay
			await tick();

			if (scrollParent)
				scrollParent.removeEventListener('scroll', scrollHandler, eventListenerOptions);
		},

		reset: () => {
			status = STATUS.READY;
			isFirstLoad = true;

			if (scrollParent) {
				scrollBarStorage.remove(scrollBarStorage.getScrollElement(scrollParent));
				scrollParent.addEventListener('scroll', scrollHandler, eventListenerOptions);
			}

			// wait for list to be empty and the empty action may trigger a scroll event
			setTimeout(() => {
				throttler.reset();
				scrollHandler();
			}, 1);
		},

		error: () => {
			status = STATUS.ERROR;
			throttler.reset();
		}
	};

	/**
	 * @param {Event} [event]
	 */
	function scrollHandler(event) {
		if (status === STATUS.READY) {
			if (event && event.constructor === Event && isVisible(thisElement)) {
				throttler.throttle(attemptLoad);
			} else {
				attemptLoad();
			}
		}
	}

	/**
	 * Attempt to trigger load
	 * @param {boolean} [isContinuousCall]
	 */
	async function attemptLoad(isContinuousCall) {
		if (status !== STATUS.COMPLETE && isVisible(thisElement) && getCurrentDistance() <= distance) {
			status = STATUS.LOADING;

			if (direction === 'top') {
				// wait for spinner display
				await tick();

				if (scrollParent) scrollBarStorage.save(scrollParent);
			}

			await handleInfinite?.(stateChanger);

			if (isContinuousCall && !forceUseInfiniteWrapper && !loopTracker.isChecked) {
				// check this component whether be in an infinite loop if it is not checked
				loopTracker.track();
			}
		} else if (status === STATUS.LOADING) {
			status = STATUS.READY;
		}
	}

	/**
	 * Get current distance from the specified direction
	 * @returns {number}
	 */
	function getCurrentDistance() {
		if (!scrollParent) return 0;

		if (direction === 'top') {
			return scrollParent === window
				? window.pageYOffset
				: /** @type {HTMLElement} */ (scrollParent).scrollTop;
		}

		const infiniteElementOffsetTopFromBottom = thisElement.getBoundingClientRect().top;
		const scrollElementOffsetTopFromBottom =
			scrollParent === window
				? window.innerHeight
				: /** @type {HTMLElement} */ (scrollParent).getBoundingClientRect().bottom;
		return infiniteElementOffsetTopFromBottom - scrollElementOffsetTopFromBottom;
	}

	/**
	 * Get the first scroll parent of an element
	 * @param {HTMLElement | null | undefined} [element]
	 * @returns {Window | HTMLElement}
	 */
	function getScrollParent(element = thisElement) {
		if (!element) return window;

		/** @type {Window | HTMLElement | null | undefined} */
		let result;

		if (typeof forceUseInfiniteWrapper === 'string') {
			result = /** @type {HTMLElement} */ (document.querySelector(forceUseInfiniteWrapper));
		}

		if (!result) {
			if (element.tagName === 'BODY') {
				result = window;
			} else if (
				!forceUseInfiniteWrapper &&
				['scroll', 'auto'].indexOf(getComputedStyle(element).overflowY) > -1
			) {
				result = element;
			} else if (
				element.hasAttribute('infinite-wrapper') ||
				element.hasAttribute('data-infinite-wrapper')
			) {
				result = element;
			}
		}

		return result || getScrollParent(element.parentElement);
	}

	function updateScrollParent() {
		if (mounted) scrollParent = getScrollParent();
	}

	function identifierUpdated() {
		if (mounted) stateChanger.reset();
	}

	// Watch forceUseInfiniteWrapper and mounted
	$effect(() => {
		forceUseInfiniteWrapper;
		mounted;

		untrack(updateScrollParent);
	});

	// Watch identifier and mounted
	$effect(() => {
		identifier;
		mounted;

		untrack(identifierUpdated);
	});

	onMount(async () => {
		mounted = true;
		updateScrollParent();

		setTimeout(() => {
			if (!scrollParent) return;

			scrollHandler();
			scrollParent.addEventListener('scroll', scrollHandler, eventListenerOptions);
		}, 1);
	});

	onDestroy(() => {
		if (mounted && status !== STATUS.COMPLETE) {
			throttler.reset();
			if (scrollParent) {
				scrollBarStorage.remove(scrollBarStorage.getScrollElement(scrollParent));
				scrollParent.removeEventListener('scroll', scrollHandler, eventListenerOptions);
			}
		}
	});
</script>

<div class="infinite-loading-container" bind:this={thisElement}>
	{#if showSpinner}
		<div class="infinite-status-prompt">
			{#if spinnerSnippet}
				{@render spinnerSnippet(isFirstLoad)}
			{:else}
				<Spinner {spinnerType} />
			{/if}
		</div>
	{/if}

	{#if showNoResults}
		<div class="infinite-status-prompt">
			{#if noResultsSnippet}
				{@render noResultsSnippet()}
			{:else}
				No results.
			{/if}
		</div>
	{/if}

	{#if showNoMore}
		<div class="infinite-status-prompt">
			{#if noMoreSnippet}
				{@render noMoreSnippet()}
			{:else}
				You have reached the end.
			{/if}
		</div>
	{/if}

	{#if showError}
		<div class="infinite-status-prompt">
			{#if errorSnippet}
				{@render errorSnippet(attemptLoad)}
			{:else}
				Something went wrong. Please retry later.
				<br />
				<button type="button" class="btn-try-infinite" onclick={() => void attemptLoad()}>
					Retry
				</button>
			{/if}
		</div>
	{/if}
</div>

<style>
	.infinite-loading-container {
		clear: both;
		text-align: center;
	}

	.btn-try-infinite {
		margin-top: 5px;
		padding: 5px 10px;
		color: #999;
		font-size: 14px;
		line-height: 1;
		background: transparent;
		border: 1px solid #ccc;
		border-radius: 3px;
		outline: none;
		cursor: pointer;
	}

	.btn-try-infinite:not(:active):hover {
		opacity: 0.8;
	}
</style>
