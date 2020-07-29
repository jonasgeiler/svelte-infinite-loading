<script>
	export let spinner = '';
</script>

{#if spinner === 'bubbles'}

	<!-- BUBBLES -->
	<span class="loading-bubbles">
		<span class="bubble-item"></span>
		<span class="bubble-item"></span>
		<span class="bubble-item"></span>
		<span class="bubble-item"></span>
		<span class="bubble-item"></span>
		<span class="bubble-item"></span>
		<span class="bubble-item"></span>
		<span class="bubble-item"></span>
	</span>

{:else if spinner === 'circles'}

	<!-- CIRCLES -->
	<span class="loading-circles">
		<span class="circle-item"></span>
		<span class="circle-item"></span>
		<span class="circle-item"></span>
		<span class="circle-item"></span>
		<span class="circle-item"></span>
		<span class="circle-item"></span>
		<span class="circle-item"></span>
		<span class="circle-item"></span>
	</span>

{:else if spinner === 'spiral'}

	<!-- SPIRAL -->
	<i class="loading-spiral"></i>

{:else if spinner === 'wavedots'}

	<!-- WAVEDOTS -->
	<span class="loading-wave-dots">
		<span class="wave-item"></span>
		<span class="wave-item"></span>
		<span class="wave-item"></span>
		<span class="wave-item"></span>
		<span class="wave-item"></span>
	</span>

{:else}

	<!-- DEFAULT -->
	<i class="loading-default"></i>

{/if}

<style>
	/* THIS IS THE COMPILED spinner.less STYLESHEET FROM vue-infinite-loading */
	/* COMPILED BECAUSE OTHERWISE THE USER WOULD HAVE TO ADD AN less PREPROCESSOR */


	.loading-wave-dots {
		/*
		$size: 8px;
		$wave: -6px;
		$delay: .14s;
		*/

		position: relative;
	}

	.loading-wave-dots .wave-item {
		position:          absolute;
		top:               50%;
		left:              50%;
		display:           inline-block;
		margin-top:        -4px; /*  = -$size / 2  */
		width:             8px; /*  = $size  */
		height:            8px; /*  = $size  */
		border-radius:     50%;
		-webkit-animation: loading-wave-dots linear 2.8s infinite;
		animation:         loading-wave-dots linear 2.8s infinite;
	}

	.loading-wave-dots .wave-item:first-child {
		margin-left: -36px; /*  = -$size/2 + -$size * 4  */
	}

	.loading-wave-dots .wave-item:nth-child(2) {
		margin-left:             -20px; /*  = -$size/2 + -$size * 2  */
		-webkit-animation-delay: 0.14s; /*  = $delay  */
		animation-delay:         0.14s; /*  = $delay  */
	}

	.loading-wave-dots .wave-item:nth-child(3) {
		margin-left:             -4px; /*  = -$size/2  */
		-webkit-animation-delay: 0.28s; /*  = $delay * 2  */
		animation-delay:         0.28s; /*  = $delay * 2  */
	}

	.loading-wave-dots .wave-item:nth-child(4) {
		margin-left:             12px; /*  = -$size/2 + $size * 2  */
		-webkit-animation-delay: 0.42s; /*  = $delay * 3  */
		animation-delay:         0.42s; /*  = $delay * 3  */
	}

	.loading-wave-dots .wave-item:last-child {
		margin-left:             28px; /*  = -$size/2 + $size * 4  */
		-webkit-animation-delay: 0.56s; /*  = $delay * 4  */
		animation-delay:         0.56s; /*  = $delay * 4  */
	}

	@-webkit-keyframes loading-wave-dots {
		0% {
			-webkit-transform: translateY(0);
			transform:         translateY(0);
			background:        #bbb;
		}
		10% {
			-webkit-transform: translateY(-6px); /*  = translateY($wave)  */
			transform:         translateY(-6px); /*  = translateY($wave)  */
			background:        #999;
		}
		20% {
			-webkit-transform: translateY(0);
			transform:         translateY(0);
			background:        #bbb;
		}
		100% {
			-webkit-transform: translateY(0);
			transform:         translateY(0);
			background:        #bbb;
		}
	}

	@keyframes loading-wave-dots {
		0% {
			-webkit-transform: translateY(0);
			transform:         translateY(0);
			background:        #bbb;
		}
		10% {
			-webkit-transform: translateY(-6px); /*  = translateY($wave)  */
			transform:         translateY(-6px); /*  = translateY($wave)  */
			background:        #999;
		}
		20% {
			-webkit-transform: translateY(0);
			transform:         translateY(0);
			background:        #bbb;
		}
		100% {
			-webkit-transform: translateY(0);
			transform:         translateY(0);
			background:        #bbb;
		}
	}


	/*
	.loading-circles {
		$size: 5px;
		$radius: 12px;
		$shallow: 56%;
		$c-basic: #505050;
	}
	*/

	.loading-circles .circle-item {
		width:             5px; /*  = $size  */
		height:            5px; /*  = $size  */
		-webkit-animation: loading-circles linear .75s infinite;
		animation:         loading-circles linear .75s infinite;
	}

	.loading-circles .circle-item:first-child {
		margin-top:  -14.5px; /*  = -$size/2 + -$radius  */
		margin-left: -2.5px; /*  = -$size/2  */
	}

	.loading-circles .circle-item:nth-child(2) {
		margin-top:  -11.26px; /*  = -$size/2 + -$radius * .73  */
		margin-left: 6.26px; /*  = -$size/2 + $radius * .73  */
	}

	.loading-circles .circle-item:nth-child(3) {
		margin-top:  -2.5px; /*  = -$size/2  */
		margin-left: 9.5px; /*  = -$size/2 + $radius  */
	}

	.loading-circles .circle-item:nth-child(4) {
		margin-top:  6.26px; /*  = -$size/2 + $radius * .73  */
		margin-left: 6.26px; /*  = -$size/2 + $radius * .73  */
	}

	.loading-circles .circle-item:nth-child(5) {
		margin-top:  9.5px; /*  = -$size/2 + $radius  */
		margin-left: -2.5px; /*  = -$size/2  */
	}

	.loading-circles .circle-item:nth-child(6) {
		margin-top:  6.26px; /*  = -$size/2 + $radius * .73  */
		margin-left: -11.26px; /*  = -$size/2 + -$radius * .73  */
	}

	.loading-circles .circle-item:nth-child(7) {
		margin-top:  -2.5px; /*  = -$size/2  */
		margin-left: -14.5px; /*  = -$size/2 + -$radius  */
	}

	.loading-circles .circle-item:last-child {
		margin-top:  -11.26px; /*  = -$size/2 + -$radius * .73  */
		margin-left: -11.26px; /*  = -$size/2 + -$radius * .73  */
	}

	@-webkit-keyframes loading-circles {
		0% {
			background: #dfdfdf; /*  = lighten($c-basic, $shallow)  */
		}
		90% {
			background: #505050; /*  = $c-basic  */
		}
		100% {
			background: #dfdfdf; /*  = lighten($c-basic, $shallow)  */
		}
	}

	@keyframes loading-circles {
		0% {
			background: #dfdfdf; /*  = lighten($c-basic, $shallow)  */
		}
		90% {
			background: #505050; /*  = $c-basic  */
		}
		100% {
			background: #dfdfdf; /*  = lighten($c-basic, $shallow)  */
		}
	}


	/*
	.loading-bubbles {
		$size: 1px;
		$radius: 12px;
		$shallow: 3px;
		$c-basic: #666;
	}
	*/

	.loading-bubbles .bubble-item {
		background:        #666; /*  = $c-basic  */
		-webkit-animation: loading-bubbles linear .75s infinite;
		animation:         loading-bubbles linear .75s infinite;
	}

	.loading-bubbles .bubble-item:first-child {
		margin-top:  -12.5px; /*  = -$size/2 + -$radius  */
		margin-left: -0.5px; /*  = -$size/2  */
	}

	.loading-bubbles .bubble-item:nth-child(2) {
		margin-top:  -9.26px; /*  = -$size/2 + -$radius * .73  */
		margin-left: 8.26px; /*  = -$size/2 + $radius * .73  */
	}

	.loading-bubbles .bubble-item:nth-child(3) {
		margin-top:  -0.5px; /*  = -$size/2  */
		margin-left: 11.5px; /*  = -$size/2 + $radius  */
	}

	.loading-bubbles .bubble-item:nth-child(4) {
		margin-top:  8.26px; /*  = -$size/2 + $radius * .73  */
		margin-left: 8.26px; /*  = -$size/2 + $radius * .73  */
	}

	.loading-bubbles .bubble-item:nth-child(5) {
		margin-top:  11.5px; /*  = -$size/2 + $radius  */
		margin-left: -0.5px; /*  = -$size/2  */
	}

	.loading-bubbles .bubble-item:nth-child(6) {
		margin-top:  8.26px; /*  = -$size/2 + $radius * .73  */
		margin-left: -9.26px; /*  = -$size/2 + -$radius * .73  */
	}

	.loading-bubbles .bubble-item:nth-child(7) {
		margin-top:  -0.5px; /*  = -$size/2  */
		margin-left: -12.5px; /*  = -$size/2 + -$radius  */
	}

	.loading-bubbles .bubble-item:last-child {
		margin-top:  -9.26px; /*  = -$size/2 + -$radius * .73  */
		margin-left: -9.26px; /*  = -$size/2 + -$radius * .73  */
	}

	@-webkit-keyframes loading-bubbles {
		0% {
			width:      1px;
			height:     1px;
			box-shadow: 0 0 0 3px #666; /*  = 0 0 0 $shallow $c-basic  */
		}
		90% {
			width:      1px;
			height:     1px;
			box-shadow: 0 0 0 0 #666; /*  = 0 0 0 0 $c-basic  */
		}
		100% {
			width:      1px;
			height:     1px;
			box-shadow: 0 0 0 3px #666; /*  = 0 0 0 $shallow $c-basic  */
		}
	}

	@keyframes loading-bubbles {
		0% {
			width:      1px;
			height:     1px;
			box-shadow: 0 0 0 3px #666; /*  = 0 0 0 $shallow $c-basic  */
		}
		90% {
			width:      1px;
			height:     1px;
			box-shadow: 0 0 0 0 #666; /*  = 0 0 0 0 $c-basic  */
		}
		100% {
			width:      1px;
			height:     1px;
			box-shadow: 0 0 0 3px #666; /*  = 0 0 0 $shallow $c-basic  */
		}
	}



	/* default adjust-huener */
	.loading-default {
		position:          relative;
		border:            1px solid #999;
		-webkit-animation: loading-rotating ease 1.5s infinite;
		animation:         loading-rotating ease 1.5s infinite;
	}

	.loading-default:before {
		/*
		$size: 6px
		*/

		content:          '';
		position:         absolute;
		display:          block;
		top:              0;
		left:             50%;
		margin-top:       -3px; /*  = -$size/2  */
		margin-left:      -3px; /*  = -$size/2  */
		width:            6px; /*  = $size  */
		height:           6px; /*  = $size  */
		background-color: #999;
		border-radius:    50%;
	}

	/* spiral adjust-huener */
	.loading-spiral {
		border:             2px solid #777;
		border-right-color: transparent;
		-webkit-animation:  loading-rotating linear .85s infinite;
		animation:          loading-rotating linear .85s infinite;
	}

	@-webkit-keyframes loading-rotating {
		0% {
			-webkit-transform: rotate(0);
			transform:         rotate(0);
		}
		100% {
			-webkit-transform: rotate(360deg);
			transform:         rotate(360deg);
		}
	}

	@keyframes loading-rotating {
		0% {
			-webkit-transform: rotate(0);
			transform:         rotate(0);
		}
		100% {
			-webkit-transform: rotate(360deg);
			transform:         rotate(360deg);
		}
	}

	/* common styles for the bubble adjust-huener and circle adjust-huener */
	.loading-bubbles,
	.loading-circles {
		position: relative;
	}

	.loading-circles .circle-item,
	.loading-bubbles .bubble-item {
		/*
		$delay: .093s
		*/

		position:      absolute;
		top:           50%;
		left:          50%;
		display:       inline-block;
		border-radius: 50%;
	}

	.loading-circles .circle-item:nth-child(2),
	.loading-bubbles .bubble-item:nth-child(2) {
		-webkit-animation-delay: 0.093s; /*  = $delay  */
		animation-delay:         0.093s; /*  = $delay  */
	}

	.loading-circles .circle-item:nth-child(3),
	.loading-bubbles .bubble-item:nth-child(3) {
		-webkit-animation-delay: 0.186s; /*  = $delay * 2  */
		animation-delay:         0.186s; /*  = $delay * 2  */
	}

	.loading-circles .circle-item:nth-child(4),
	.loading-bubbles .bubble-item:nth-child(4) {
		-webkit-animation-delay: 0.279s; /*  = $delay * 3  */
		animation-delay:         0.279s; /*  = $delay * 3  */
	}

	.loading-circles .circle-item:nth-child(5),
	.loading-bubbles .bubble-item:nth-child(5) {
		-webkit-animation-delay: 0.372s; /*  = $delay * 4  */
		animation-delay:         0.372s; /*  = $delay * 4  */
	}

	.loading-circles .circle-item:nth-child(6),
	.loading-bubbles .bubble-item:nth-child(6) {
		-webkit-animation-delay: 0.465s; /*  = $delay * 5  */
		animation-delay:         0.465s; /*  = $delay * 5  */
	}

	.loading-circles .circle-item:nth-child(7),
	.loading-bubbles .bubble-item:nth-child(7) {
		-webkit-animation-delay: 0.558s; /*  = $delay * 6  */
		animation-delay:         0.558s; /*  = $delay * 6  */
	}

	.loading-circles .circle-item:last-child,
	.loading-bubbles .bubble-item:last-child {
		-webkit-animation-delay: 0.651s; /*  = $delay * 7  */
		animation-delay:         0.651s; /*  = $delay * 7  */
	}

	.loading-bubbles,
	.loading-circles,
	.loading-spiral,
	.loading-wave-dots,
	.loading-default {
		/*
		$size: 28px
		*/

		display:       inline-block;
		margin:        5px 0;
		width:         28px; /*  = $size  */
		height:        28px; /*  = $size  */
		font-size:     28px; /*  = $size  */
		line-height:   28px; /*  = $size  */
		border-radius: 50%;
	}
</style>