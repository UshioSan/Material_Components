(function(window){
	"use strict";
	let effect,accordion,
		functions = {
			collapse: e => {
				let self            = e.currentTarget,
					parent          = self.parentNode,
					header          = self.querySelector(".header"),
					container       = self.querySelector(".content"),
					content         = container.firstElementChild,
					effectCollapse  = effect.toLowerCase(),
					height = content ? content.clientHeight + (16 * 4): 0;
				
				if ( self.dataset.active === undefined ){
					if (accordion){
						[].forEach.call(functions.getCollapseElements(parent), el => {
							let containerCollapse   = el.querySelector(".content");
							
							el.removeAttribute("data-active");
							containerCollapse.removeAttribute("style");
						});
					}
					self.dataset.active = effect === "popup" ? "popup" : String();
					container.style = `height:${height}px;border-bottom: solid 1px #DDDDDD;`;
				}else{
					self.removeAttribute("data-active");
					container.removeAttribute("style");
				}
			},
			
			searchCollapse: (element) => {
				let self        = element,
					collapses   = element.querySelectorAll(".collapse");
				
				[].forEach.call(collapses, e=>{
					if (effect === "popup"){
						e.classList.add("popup");
					}
					e.addEventListener("click", functions.collapse, false);
				});
			},
			
			getCollapseElements: (element) => {
				return element.querySelectorAll(".collapse");
			},
			
			isHtmlElement: (object) => {
				return ({}).toString.call(object).match(/\s([A-Z|a-z]+)/)[1].toLowerCase();
			}
	};
	
	window.collapseFX = (object) => {
		let element     = object.element || document.querySelectorAll(".collapsible");
			effect      = object.effect || "expandable";
			accordion   = object.accordion !== undefined ? object.accordion : true;
			
		if ( functions.isHtmlElement(element) === "nodelist" || functions.isHtmlElement(element).indexOf("html") !== -1){
			if ( element.length ){
				[].forEach.call(element, e=>{
					functions.searchCollapse(e);
				})
			}else {
				functions.searchCollapse(element);
			}
		}
	};
	
})(window);