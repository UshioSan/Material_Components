;(function (window) {
	"use strict";
	
	class TabsFX{
		
		constructor(parentTabs){
			this._time          = 300;
			this._mode          = "slide";
			this.indicator      = null;
			this.activeNode     = 0;
			this.typeParent     = ({}).toString.call(parentTabs).match(/\s([a-z|A-Z]+)/)[1].trim().toLowerCase();
			this.parentTabs     = this.typeParent.indexOf("html") !== -1 ? parentTabs : null;
			this.arrayNodes     = [];
			this.contentTabs    = [];
			this.parentContent  = null;
			
			this.initTabs();
		}
		
		set _mode(value) {this.mode = value;}
		set _time(value) {this.time = value;}
		
		static getDataNode (element, search) {
			return element.dataset[search] || null;
		}
		
		static issetData (element, search) {
			return element.dataset[search];
		}
		
		static setData (element, data, value) {
			return element.dataset[data] = value;
		}
		
		createIndicator () {
			if ( this.indicator === null ){
				this.indicator = document.createElement("li");
				this.indicator.className = `indicator slowMove`;
				this.indicator.dataset.posX = ``;
				this.indicator.dataset.lastPosX = ``;
			}
			this.parentTabs.appendChild(this.indicator);
			this.moveIndicator(0, this.parentTabs.clientHeight, 0);
			
			return this.indicator;
		}
		
		initTabs () {
			this.createIndicator();
			this.arrayNodes = this.parentTabs.querySelectorAll(".tab");
			
			for (let i = 0; i < this.arrayNodes.length; i++) {
				if ( TabsFX.issetData(this.arrayNodes[i], "active") !== undefined){
					this.activeNode = i;
					break;
				}
			}
			
			[].forEach.call(this.arrayNodes, (e,i) => {
				let urlElement              = e.querySelector("a"),
					matchUrl                = urlElement.href.match(/#([A-Za-z0-9]+)/)[1],
					elementSelectContent    = document.getElementById(matchUrl),
					translate;
					
				this.contentTabs.push(elementSelectContent);
				this.parentContent = elementSelectContent.parentNode;
				
				if (this.activeNode === i) {
					this.contentTabs[i].style.display = `block`;
					this.parentContent.style.height   = `${this.contentTabs[i].clientHeight}px`;
					this.moveIndicator(e.offsetLeft, e.clientHeight, e.clientWidth);
				}else{
					this.contentTabs[i].style.display = `none`;
				}
				
				e.addEventListener("click", this.changeTab.bind(this), false);
			});
			
		}
		
		changeTab (e) {
			e.preventDefault();
			let self = e.currentTarget;
			
			[].forEach.call(this.arrayNodes, (e, i)=>{
				e.removeAttribute("data-active");
				this.contentTabs[i].style.display = `none`;
				if ( e === self ) {
					TabsFX.setData(e, "active", "");
					this.contentTabs[i].style.display = `block`;
					this.parentContent.style.height   = `${this.contentTabs[i].clientHeight}px`;
				}
			});
			this.moveIndicator(self.offsetLeft, self.clientHeight, self.clientWidth);
		}
		
		moveIndicator(x,y,w){
			let X = parseInt(x),
				Y = parseInt(y),
				W = parseInt(w),
				S = this.indicator;
			
			S.style.left    = `${X}px`;
			S.style.top     = `${Y}px`;
			S.style.width   = `${W}px`;
		}
		
	}
	
	
	window.Tabs = TabsFX;
})(window);