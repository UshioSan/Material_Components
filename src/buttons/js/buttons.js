;(function(window){
	let rippleObject = {};
	
	// const $$ = document.querySelectorAll.bind(document);
	const isWindow = obj => obj !== null && obj.window;
	const getWindow = elem => isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
	const convertStyle = object => {
		let style = String();
		
		for ( let a in object ) style += `${a}: ${object[a]};`;
		
		return style;
	};
	const offset = elem => {
		let docEl, win,
			box = {top: 0, left: 0},
			doc = elem && elem.ownerDocument;
		
		docEl = doc.documentElement;
		
		if ( typeof elem.getBoundingClientRect !== typeof undefined) {
			box = elem.getBoundingClientRect();
		}
		win = getWindow(doc);
		
		return {
			top: box.top + win.pageYOffset - docEl.clientTop,
			left: box.left + win.pageXOffset - docEl.clientLeft
		};
	};
	
	let Effect = {
		duration: 1000,
		show: (e, element) => {
			let self        = element || e.currentTarget,
				ripple      = document.createElement("div"),
				position    = offset(self),
				relativeY   = (e.pageY - position.top),
				relativeX   = (e.pageX - position.left),
				scale, rippleStyle;
			
			if ( self.clientWidth === self.clientHeight ) {
				scale       = `scale(${(self.clientWidth / 100) * 15})`;
			} else if ( self.clientHeight > self.clientWidth ) {
				scale       = `scale(${(self.clientHeight / 100) * 12})`;
			} else {
				scale       = `scale(${(self.clientWidth / 100) * 12})`;
			}
			
			ripple.className = `ripple_effect`;
			self.appendChild(ripple);
			
			if (`touches` in e) {
				relativeY   = (e.touches[0].pageY - position.top);
				relativeX   = (e.touches[0].pageX - position.left);
			}
			
			ripple.setAttribute(`data-hold`, `${Date.now()}` );
			ripple.setAttribute(`data-scale`, `${scale}`);
			ripple.setAttribute(`data-x`, `${relativeX}`);
			ripple.setAttribute(`data-y`, `${relativeY}`);
			
			rippleStyle = {
				'top' : `${relativeY}px`,
				'left': `${relativeX}px`
			};
			
			ripple.className = `${ripple.className} waves-no-transition`;
			ripple.setAttribute('style', convertStyle(rippleStyle) );
			ripple.className = `${ripple.className.replace('waves-no-transition', '')}`;
			
			rippleStyle['-webkit-transform']    = scale;
			rippleStyle['-moz-transform']       = scale;
			rippleStyle['-ms-transform']        = scale;
			rippleStyle['-o-transform']         = scale;
			rippleStyle['-webkit-border-radius']= `100%`;
			rippleStyle['-moz-border-radius']   = `100%`;
			rippleStyle[`-o-border-radius`]     = `100%`;
			rippleStyle['border-radius']        = `100%`;
			rippleStyle.transform               = scale;
			rippleStyle.opacity                 = `1`;
			
			rippleStyle['-webkit-transition-duration']  = `${Effect.duration}ms`;
			rippleStyle['-moz-transition-duration']     = `${Effect.duration}ms`;
			rippleStyle['-ms-transition-duration']      = `${Effect.duration}ms`;
			rippleStyle['-o-transition-duration']       = `${Effect.duration}ms`;
			rippleStyle['transition-duration']          = `${Effect.duration}ms`;
			
			rippleStyle['-webkit-transition-timing-function']   = `cubic-bezier(0.250, 0.460, 0.450, 0.940)`;
			rippleStyle['-moz-transition-timing-function']      = `cubic-bezier(0.250, 0.460, 0.450, 0.940)`;
			rippleStyle['-ms-transition-timing-function']       = `cubic-bezier(0.250, 0.460, 0.450, 0.940)`;
			rippleStyle['-o-transition-timing-function']        = `cubic-bezier(0.250, 0.460, 0.450, 0.940)`;
			rippleStyle['transition-timing-function']           = `cubic-bezier(0.250, 0.460, 0.450, 0.940)`;
			
			setTimeout( () => {
				"use strict";
				ripple.setAttribute('style', convertStyle(rippleStyle) );
			});
		},
		hide: e => {
			TouchHandler.touchup(e);
			
			let self    = e.currentTarget || e.target,
				// width   = self.clientWidth * 1.4,
				ripple  = null,
				ripples = self.getElementsByClassName(`ripple_effect`);
			
			if ( ripples.length > 0 ) {
				ripple  = ripples[ripples.length - 1];
			} else {
				return false;
			}
			
			let relativeX   = ripple.getAttribute('data-x'),
				relativeY   = ripple.getAttribute('data-y'),
				scale       = ripple.getAttribute('data-scale'),
				difference  = Date.now() - parseInt( ripple.getAttribute('data-hold') ),
				delay       = 350 - difference;
			
			if ( delay < 0 ) delay = 0;
			
			setTimeout( () => {
				let style = {
					top: `${relativeY}px`,
					left: `${relativeX}px`,
					opacity: `0`,
					'-webkit-transition-duration': `${Effect.duration}ms`,
					'-moz-transition-duration': `${Effect.duration}ms`,
					'-ms-transition-duration': `${Effect.duration}ms`,
					'-o-transition-duration': `${Effect.duration}ms`,
					'transition-duration': `${Effect.duration}ms`,
					'-webkit-transform': scale,
					'-moz-transform': scale,
					'-ms-transform': scale,
					'-o-transform': scale,
					'transform': scale
				};
				
				ripple.setAttribute('style', convertStyle(style) );
				
				setTimeout( () => {
					try {
						self.removeChild(ripple);
					} catch ( e ) {
						return false;
					}
				}, Effect.duration);
				
			}, delay )
			
		}
		
	};
	
	let TouchHandler = {
		touches: 0,
		allowEvent: e => {
			let allow = true;
			
			if ( e.type === `touchstart` ) {
				TouchHandler.touches += 1;
			} else if ( e.type === `touchend` || e.type === `touchcancel`) {
				setTimeout( () => {
					if ( TouchHandler.touches > 0 ) {
						TouchHandler.touches -= 1;
					}
				}, 500);
			} else if ( e.type === `mousedown` && TouchHandler.touches > 0) {
				allow = false;
			}
			
			return allow;
		},
		touchup: e => {
			TouchHandler.allowEvent(e);
		}
	};
	
	const  getWavesEffectElement = e => {
		if ( TouchHandler.allowEvent(e) === false ) {
			return null;
		}
		
		let element = null,
			self    = e.target || e.srcElement;
		
		while ( self.parentNode !== null ) {
			if ( !(self instanceof SVGElement) && self.className.indexOf('btn') !== -1 || self.className.indexOf('ripple') !== -1) {
				element = self;
				break;
			}
			self = self.parentNode;
		}
		return element;
	};
	
	const showEffect = e => {
		let self = getWavesEffectElement(e);
		
		if (self !== null) {
			Effect.show(e, self);
			
			if ('ontouchstart' in window) {
				self.addEventListener('touchend', Effect.hide, false);
				self.addEventListener('touchcancel', Effect.hide, false);
			}
			
			self.addEventListener('mouseup', Effect.hide, false);
			self.addEventListener('mouseleave', Effect.hide, false);
			self.addEventListener('dragend', Effect.hide, false);
		}
	};
	
	rippleObject.displayEffect = options => {
		options = options || {};
		
		if ('duration' in options) {
			Effect.duration = options.duration;
		}
		
		if ( 'ontouchstart' in window ) {
			document.body.addEventListener('touchstart', showEffect, false);
		}
		
		document.body.addEventListener('mousedown', showEffect, false);
	};
	
	rippleObject.attach = element => {
		if ( 'ontouchstart' in window ) {
			element.addEventListener('touchstart', showEffect, false);
		}
		
		element.addEventListener('mousedown', showEffect, false);
	};
	
	window.Ripple = rippleObject;
	
	document.addEventListener('DOMContentLoaded', ()=> {
		Ripple.displayEffect();
	}, false);
	
})(window);