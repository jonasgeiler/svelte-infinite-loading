<script context="module">
	const STATUS = {
		READY:    0,
		LOADING:  1,
		COMPLETE: 2,
		ERROR:    3,
	};
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
		'</div>',
	].join('\n');


	/**
	 * the third argument for event bundler
	 * @see https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
	 */
	const thirdEventArg = (() => {
		let result = false;

		try {
			const arg = Object.defineProperty({}, 'passive', {
				get() {
					result = { passive: true };
					return true;
				},
			});

			window.addEventListener('testpassive', arg, arg);
			window.remove('testpassive', arg, arg);
		} catch (e) { /* */
		}

		return result;
	})();


	const throttler = {
		timers: [],
		caches: [],
		throttle(fn) {
			if (this.caches.indexOf(fn) === -1) {
				// cache current handler
				this.caches.push(fn);

				// save timer for current handler
				this.timers.push(setTimeout(() => {
					fn();

					// empty cache and timer
					this.caches.splice(this.caches.indexOf(fn), 1);
					this.timers.shift();
				}, THROTTLE_LIMIT));
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
		},
	};


	const loopTracker = {
		isChecked: false,
		timer:     null,
		times:     0,
		track() {
			// record track times
			this.times += 1;

			// try to mark check status
			clearTimeout(this.timer);
			this.timer = setTimeout(() => {
				this.isChecked = true;
			}, LOOP_CHECK_TIMEOUT);

			// throw warning if the times of continuous calls large than the maximum times
			if (this.times > LOOP_CHECK_MAX_CALLS) {
				console.error(ERROR_INFINITE_LOOP);
				this.isChecked = true;
			}
		},
	};


	const scrollBarStorage = {
		key: '_infiniteScrollHeight',
		getScrollElm(elm) {
			return elm === window ? document.documentElement : elm;
		},
		save(elm) {
			const target = this.getScrollElm(elm);

			// save scroll height on the scroll parent
			target[this.key] = target.scrollHeight;
		},
		restore(elm) {
			const target = this.getScrollElm(elm);

			/* istanbul ignore else */
			if (typeof target[this.key] === 'number') {
				target.scrollTop = target.scrollHeight - target[this.key] + target.scrollTop;
			}

			this.remove(target);
		},
		remove(elm) {
			if (elm[this.key] !== undefined) {
				// remove scroll height
				delete elm[this.key]; // eslint-disable-line no-param-reassign
			}
		},
	};


	function isVisible(elm) {
		return (elm.offsetWidth + elm.offsetHeight) > 0;
	}
</script>

<script>
	import { onMount, onDestroy, tick, createEventDispatcher } from 'svelte';
	import Spinner from './Spinner.svelte';

	const dispatch = createEventDispatcher();

	export let distance = 100;
	export let spinner = '';
	export let direction = 'bottom';
	export let forceUseInfiniteWrapper = false;
	export let identifier = +new Date();

	let isFirstLoad = true; // save the current loading whether it is the first loading
	let status = STATUS.READY;
	let mounted = false;
	let infiniteLoadingContainer;

	$: isShowSpinner = status === STATUS.LOADING;
	$: isShowError = status === STATUS.ERROR;
	$: isShowNoResults = status === STATUS.COMPLETE && isFirstLoad;
	$: isShowNoMore = status === STATUS.COMPLETE && !isFirstLoad;
	$: scrollParent = mounted ? getScrollParent(undefined, forceUseInfiniteWrapper /* pass as argument to watch changes */) : null;

	const stateChanger = {
		loaded: async () => {
			isFirstLoad = false;

			if (direction === 'top') {
				// wait for DOM updated
				await tick();

				scrollBarStorage.restore(scrollParent);
			}

			if (status === STATUS.LOADING) {
				await tick();
				await attemptLoad(true);
			}
		},

		complete: async () => {
			status = STATUS.COMPLETE;

			// force re-complation computed properties to fix the problem of get slot text delay
			await tick();

			scrollParent.removeEventListener('scroll', scrollHandler, thirdEventArg);
		},

		reset: async () => {
			status = STATUS.READY;
			isFirstLoad = true;

			scrollBarStorage.remove(scrollParent);

			scrollParent.addEventListener('scroll', scrollHandler, thirdEventArg);

			// wait for list to be empty and the empty action may trigger a scroll event
			setTimeout(() => {
				throttler.reset();
				scrollHandler();
			}, 1);
		},

		error: () => {
			status = STATUS.ERROR;
			throttler.reset();
		},
	};

	$: if(mounted) stateChanger.reset(identifier /* pass as argument to watch changes */);

	function scrollHandler(event) {
		if (status === STATUS.READY) {
			if (event && event.constructor === Event && isVisible(infiniteLoadingContainer)) {
				throttler.throttle(attemptLoad);
			} else {
				attemptLoad();
			}
		}
	}

	// Attempt to trigger load
	async function attemptLoad(isContinuousCall) {
		if (status !== STATUS.COMPLETE && isVisible(infiniteLoadingContainer) && getCurrentDistance() <= distance) {
			status = STATUS.LOADING;

			if (direction === 'top') {
				// wait for spinner display
				await tick();

				scrollBarStorage.save(scrollParent);
			}

			dispatch('infinite', stateChanger);

			if (isContinuousCall && !forceUseInfiniteWrapper && !loopTracker.isChecked) {
				// check this component whether be in an infinite loop if it is not checked
				// more details: https://github.com/PeachScript/vue-infinite-loading/issues/55#issuecomment-316934169
				loopTracker.track();
			}
		} else if (status === STATUS.LOADING) {
			status = STATUS.READY;
		}
	}

	// Get current distance from the specified direction
	function getCurrentDistance() {
		let distance;

		if (direction === 'top') {
			distance = typeof scrollParent.scrollTop === 'number' ? scrollParent.scrollTop : scrollParent.pageYOffset;
		} else {
			const infiniteElmOffsetTopFromBottom = infiniteLoadingContainer.getBoundingClientRect().top;
			const scrollElmOffsetTopFromBottom = scrollParent === window ? window.innerHeight : scrollParent.getBoundingClientRect().bottom;

			distance = infiniteElmOffsetTopFromBottom - scrollElmOffsetTopFromBottom;
		}

		return distance;
	}

	// Get the first scroll parent of an element
	function getScrollParent(element = infiniteLoadingContainer) {
		let result;

		if (typeof forceUseInfiniteWrapper === 'string') {
			result = document.querySelector(forceUseInfiniteWrapper);
		}

		if (!result) {
			if (element.tagName === 'BODY') {
				result = window;
			} else if (!forceUseInfiniteWrapper && ['scroll', 'auto'].indexOf(getComputedStyle(element).overflowY) > -1) {
				result = element;
			} else if (element.hasAttribute('infinite-wrapper') || element.hasAttribute('data-infinite-wrapper')) {
				result = element;
			}
		}

		return result || getScrollParent(element.parentNode);
	}


	onMount(async () => {
		mounted = true;

		setTimeout(() => {
			scrollHandler();
			scrollParent.addEventListener('scroll', scrollHandler, thirdEventArg);
		}, 1);
	});

	onDestroy(() => {
		if (!status !== STATUS.COMPLETE) {
			throttler.reset();
			scrollBarStorage.remove(scrollParent);
			scrollParent.removeEventListener('scroll', scrollHandler, thirdEventArg);
		}
	});
</script>

<div class="infinite-loading-container" bind:this={infiniteLoadingContainer}>
	{#if isShowSpinner}
		<div class="infinite-status-prompt">
			<slot name="spinner">
				<Spinner {spinner} />
			</slot>
		</div>
	{/if}

	{#if isShowNoResults}
		<div class="infinite-status-prompt">
			<slot name="noResults">
				No results :(
			</slot>
		</div>
	{/if}

	{#if isShowNoMore}
		<div class="infinite-status-prompt">
			<slot name="noMore">
				No more data :)
			</slot>
		</div>
	{/if}

	{#if isShowError}
		<div class="infinite-status-prompt">
			<slot name="error" {attemptLoad}>
				Oops, something went wrong :(
				<br>
				<button class="btn-try-infinite" on:click={attemptLoad}>
					Retry
				</button>
			</slot>
		</div>
	{/if}
</div>

<style>
	.infinite-loading-container {
		clear:      both;
		text-align: center;
	}

	.btn-try-infinite {
		margin-top:    5px;
		padding:       5px 10px;
		color:         #999;
		font-size:     14px;
		line-height:   1;
		background:    transparent;
		border:        1px solid #ccc;
		border-radius: 3px;
		outline:       none;
		cursor:        pointer;
	}

	.btn-try-infinite:not(:active):hover {
		opacity: 0.8;
	}
</style>