class ModalFX{
	
	constructor(object={}){
		this.title          = object.title || "Title";
		this.typeModal      = object.type || "modal";
		this.content        = object.body || "";
		this.in             = object.in || 300; // ms
		this.out            = object.out || 300; // ms
		this.callback       = object.accept || null;
		this.acceptMessage  = object.acceptMessage || "Agree";
		this.cancelMessage  = object.cancelMessage || "Disagree";
		this.url            = object.url || null;
		this.result         = false;
		this.isActive       = false;
		
		this.taxonomyModal();
	}
	
	generateModal(){
		this.modalBody = {
			backgroundModal:    document.createElement("div"),
			bodyModal:          document.createElement("div"),
			headerModal:        document.createElement("div"),
			contentModal:       document.createElement("div"),
			footerModal:        document.createElement("div"),
			acceptButton:       document.createElement("button"),
			cancelButton:       document.createElement("button"),
			closeButton:        document.createElement("button"),
			frameModal:         document.createElement("iframe")
		};
		return this.modalBody;
	}
	
	taxonomyModal(){
		let modal = this.generateModal();

		modal.backgroundModal.className                 = "backgroundModal disable";
		modal.backgroundModal.style.webkitTransition    = `all ${this.in}ms ease`;
		modal.backgroundModal.style.mozTransition       = `all ${this.in}ms ease`;
		modal.backgroundModal.style.oTransition         = `all ${this.in}ms ease`;
		modal.backgroundModal.style.transition          = `all ${this.in}ms ease`;
		
		switch ( this.typeModal.toLowerCase() ){
			case "modal":
				modal.bodyModal.className = "modal";
				modal.headerModal.className = "header";
				modal.contentModal.className = "content";
				modal.footerModal.className = "footer";
				modal.acceptButton.className = "btn flat flat_green";
				modal.cancelButton.className = "btn flat flat_red";
				// content
				modal.headerModal.innerText  = this.title;
				modal.contentModal.innerHTML = this.content;
				modal.acceptButton.innerText = this.acceptMessage;
				modal.cancelButton.innerText = this.cancelMessage;
				// append
				modal.backgroundModal.appendChild(modal.bodyModal);
				modal.bodyModal.appendChild(modal.headerModal);
				modal.bodyModal.appendChild(modal.contentModal);
				modal.bodyModal.appendChild(modal.footerModal);
				modal.footerModal.appendChild(modal.cancelButton);
				modal.footerModal.appendChild(modal.acceptButton);
				break;
			case "fixed":
				
				break;
			case "video":
				
				break;
		}
		
		document.body.appendChild(modal.backgroundModal);
	}
	
	
	
}