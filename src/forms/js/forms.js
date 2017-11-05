(function () {
	let textFields = document.querySelectorAll(".input");
	
	// returns the type of element
	const typeOf = element => ({}).toString.call(element).match(/\s([\w]+)/)[1].toLowerCase();
	
	// verify if one node is html object
	const isHTML = element => /\[object\s*(html[\w]+)]/.test({}.toString.call(element).toLowerCase());
	
	// count all words in the text
	const countWord = string => {
		if (string.trim().length > 0) return string.replace(/\s/gi, ' ').split(' ').length;
		return 0;
	};
	
	// count all chars in the text
	const countChar = string => string.replace(/([\s]+)/g, '').split("").length;
	
	// remove all events in the form
	const preventEventsForms = e => e.preventDefault();
	
	// search parent element form the target node
	const searchParentElement = (element, proprietyParentElement) => {
		let selectElement = element,
			elementName;
		
		if (isHTML(element)) {
			while (selectElement = selectElement.parentNode) {
				let elementStructure = /(\.|#)+([\w]+)/,
					firstChar = proprietyParentElement.charAt(0);
				if (elementStructure.test(proprietyParentElement)) {
					elementName = proprietyParentElement.substr(1);
					if (firstChar === "#") {
						if (selectElement.id === elementName) {
							return selectElement;
						}
					} else if (firstChar === ".") {
						let classList = selectElement.classList !== undefined ? Array.from(selectElement.classList) : null;
						
						if (classList !== null) {
							if (classList.indexOf(elementName) !== -1) {
								return selectElement;
							}
						}
					}
				} else {
					if (typeOf(selectElement).indexOf(proprietyParentElement) !== -1) {
						return selectElement;
					}
				}
			}
		}
		return false;
	};
	
	// remove element if transition end
	const transitionEndRemove = e => e.currentTarget.remove();
	
	// toggle char or password input
	const toggleDataEvent = e=> {
		let self = e.currentTarget,
			parent = self.parentNode,
			inputType = parent.querySelector(".inputUI");
		
		if ( inputType.type === "password" ) {
			self.classList.remove("icon-eye");
			self.classList.add("icon-eye-blocked");
			inputType.type = "text";
		} else {
			self.classList.remove("icon-eye-blocked");
			self.classList.add("icon-eye");
			inputType.type = "password";
		}
	};
	
	// detect if the input is focused
	const focusInput = e => {
		let self = e.currentTarget,
			parent = self.parentNode,
			place = parent.querySelector(".place"),
			borderBottom = document.createElement("div"),
			parentIcon = searchParentElement(parent, ".icon"),
			icon = parentIcon ? parentIcon.querySelector(".iconUI") : null,
			top = self.offsetTop + self.clientHeight - 1,
			placeholder = self.dataset.placeholder || String();
		
		//	styles form border bottom
		borderBottom.className = `borderBottomUI`;
		borderBottom.style.position = `absolute`;
		borderBottom.style.top = `${top}px`;
		borderBottom.style.left = `50%`;
		borderBottom.style.width = `0`;
		borderBottom.style.height = `2px`;
		borderBottom.style.background = `#9E9E9E`; /*#E91E63*/
		borderBottom.style.webkitTransform = `translateX(-50%)`;
		borderBottom.style.mozTransform = `translateX(-50%)`;
		borderBottom.style.transform = `translateX(-50%)`;
		borderBottom.style.webkitTransition = `all .3s ease`;
		borderBottom.style.mozTransition = `all .3s ease`;
		borderBottom.style.transition = `all .3s ease`;
		// change color icon if exist
		if (icon !== null) {
			icon.style.color = `#9E9E9E`; /*#E91E63*/
		}
		//	insert border into the @parent
		parent.appendChild(borderBottom);
		//	expand borderBottom
		setTimeout(() => {
			borderBottom.style.width = `100%`;
		}, 10);
		//	move up place variable
		place.style.top = `15px`;
		place.style.fontSize = `11px`;
		//	insert placeholder in the input
		self.placeholder = `${placeholder}`;
	};
	
	// detect if the input is lost focus
	const blurInput = e => {
		let self = e.currentTarget,
			parent = self.parentNode,
			place = parent.querySelector(".place"),
			borderBottom = parent.querySelector(".borderBottomUI"),
			parentIcon = searchParentElement(parent, ".icon"),
			icon = parentIcon ? parentIcon.querySelector(".iconUI") : null;
		
		// verify if input is empty
		if (self.value.trim().length === 0) {
			// clear placeholder input
			self.placeholder = String();
			// remove styles form place
			place.removeAttribute("style");
			//  verify icon
			if (icon !== null) {
				icon.removeAttribute("style");
			}
		}
		// transition remove
		borderBottom.style.width = `0`;
		// when the transition ended remove borderBottom
		borderBottom.addEventListener("webkitTransitionEnd", transitionEndRemove, false);
		borderBottom.addEventListener("transitionend", transitionEndRemove, false);
	};
	
	// detect input text
	const inputText = e => {
		let self = e.currentTarget,
			parent = self.parentNode,
			counter = parent.querySelector(".counter"),
			data = parent.dataset.count,
			toggleData = parent.querySelector(".toggleTypePassword"),
			contentData,
			max,
			form;
		
		if (data !== undefined) {
			//	split data
			data = data.split("|");
			//	verify type of data
			max = data[1] < 10 ? `0${data[1]}` : data[1];
			contentData = data[0].toLowerCase() === "word" ? countWord(self.value.trim()) : countChar(self.value.trim()) || 0;
			contentData = contentData < 10 ? `0${contentData}` : contentData;
			//	write text in counter
			counter.innerText = `${contentData} / ${max}`;
			//	active only if the content exceeds the maximum
			if (parseInt(contentData) > parseInt(max)) {
				if (form = searchParentElement(parent, "form")) {
					form.addEventListener("submit", preventEventsForms, false);
				}
			} else {
				if (form = searchParentElement(parent, "form")) {
					form.removeEventListener("submit", preventEventsForms, false);
				}
			}
		}
		// create eye if input is type password
		if ( self.type === "password" ) {
			if ( self.value.trim().length > 0 ) {
				if ( !toggleData ) {
					toggleData = document.createElement("span");
					toggleData.className = "toggleTypePassword icon-eye";
					toggleData.addEventListener("click", toggleDataEvent, false);
					parent.appendChild(toggleData);
					self.style.padding = `3px 28px 3px 0`;
				}
			} else {
				if ( toggleData ) toggleData.remove();
				self.removeAttribute("style");
			}
		}
	};
	
	[].forEach.call(textFields, el => {
		if (el.querySelector(".inputUI") !== null) {
			let input = el.querySelector(".inputUI"),
				counter = el.dataset.count,
				counterDiv = el.querySelector(".counter"),
				infoDiv = el.querySelector(".info"),
				place = el.querySelector(".place"),
				data,
				actual,
				max,
				form;
			//	show the counter word or letter in the inputs
			if (input.value.trim().length > 0) {
				if (counter !== undefined) {
					data = counter.split("|");
					max = data[1] < 10 ? `0${data[1]}` : data[1] || `00`;
					actual = data[0].toLowerCase() === "word" ? countWord(input.value.trim()) : countChar(input.value.trim()) || `00`;
					actual = actual < 10 ? `0${actual}` : actual;
					// verify if counter div exist
					if (!counterDiv) {
						// verify if info div is exist
						if (!infoDiv) {
							infoDiv = document.createElement("span");
							infoDiv.className = `info`;
							el.appendChild(infoDiv);
						}
						counterDiv = document.createElement("span");
						counterDiv.className = `info counter`;
						el.appendChild(counterDiv);
					}
					// insert text into the counter div
					counterDiv.innerText = `${actual} / ${max}`;
					// verify if @actual is not more that @max
					if (parseInt(actual) > parseInt(max)) {
						// stop events for submit action
						if (form = searchParentElement(el, "form")) {
							form.addEventListener("submit", preventEventsForms, false);
						}
					}
					//	end
				}
				place.style.top = `15px`;
				place.style.fontSize = `11px`;
			} else {
				// verify if counter isn't undefined
				if (counter !== undefined) {
					data = counter.split("|");
					max = data[1] < 10 ? `0${data[1]}` : data[1] || `00`;
					actual = `00`;
					// verify if counter div exist
					if (!counterDiv) {
						// verify if info div is exist
						if (!infoDiv) {
							infoDiv = document.createElement("span");
							infoDiv.className = `info`;
							el.appendChild(infoDiv);
						}
						counterDiv = document.createElement("span");
						counterDiv.className = `info counter`;
						el.appendChild(counterDiv);
					}
					// insert text into the counter div
					counterDiv.innerText = `${actual} / ${max}`;
				}
			}
			//	add events to textFields
			input.addEventListener("focus", focusInput, false);
			input.addEventListener("blur", blurInput, false);
			input.addEventListener("input", inputText, false);
		}
	});
})();