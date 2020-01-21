//=============================================================================
//
// File:         /node_modules/rwt-reading-points/rwt-reading-points.js
// Language:     ECMAScript 2015
// Copyright:    Read Write Tools © 2020
// License:      MIT
// Initial date: Jan 14, 2020
// Purpose:      Percentage read, reading time & points
//
//=============================================================================

import ReadersData from './readers-data.class.js';

export default class RwtReadingPoints extends HTMLElement {

	constructor() {
		super();
		
		// external elements
		this.frame = null;
		
		// child elements
		this.panel = null;
		this.container = null;
		this.level = null;
		this.points = null;

		// data
		this.skillCategory = 'General';
		this.skillLevel = 'Simple';
		this.skillPoints = 1;
		this.percentRead = 0;
		
		// readingTime
		this.loadTime = Date.now();
		this.firstScrollTime = null;
		this.lastScrollTime = null;
		
		Object.seal(this);
	}
	
	//-------------------------------------------------------------------------
	// customElement life cycle callbacks
	//-------------------------------------------------------------------------
	async connectedCallback() {		
		// guard against possible call after this has been disconnected
		if (!this.isConnected)
			return;
		
		var htmlFragment = await this.fetchTemplate();
		if (htmlFragment == null)
			return;
		
		var styleElement = await this.fetchCSS();
		if (styleElement == null)
			return;

		// append the HTML and CSS to the custom element's shadow root
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(htmlFragment); 
		this.shadowRoot.appendChild(styleElement); 
		
		this.identifyChildren();
		this.registerEventListeners();
		this.initializeText();
		this.show();
	}
	
	//-------------------------------------------------------------------------
	// initialization
	//-------------------------------------------------------------------------

	//^ Fetch the HTML template
	//< returns a document-fragment suitable for appending to shadowRoot
	//< returns null if server does not respond with 200 or 304
	async fetchTemplate() {
		var response = await fetch('/node_modules/rwt-reading-points/rwt-reading-points.blue', {cache: "no-cache", referrerPolicy: 'no-referrer'});
		if (response.status != 200 && response.status != 304)
			return null;
		var templateText = await response.text();
		
		// create a template and turn its content into a document fragment
		var template = document.createElement('template');
		template.innerHTML = templateText;
		return template.content;
	}
	
	//^ Fetch the CSS styles and turn it into a style element
	//< returns an style element suitable for appending to shadowRoot
	//< returns null if server does not respond with 200 or 304
	async fetchCSS() {
		var response = await fetch('/node_modules/rwt-reading-points/rwt-reading-points.css', {cache: "no-cache", referrerPolicy: 'no-referrer'});
		if (response.status != 200 && response.status != 304)
			return null;
		var css = await response.text();

		var styleElement = document.createElement('style');
		styleElement.innerHTML = css;
		return styleElement;
	}
	
	//^ Identify this component's children
	identifyChildren() {
		this.frame = document.getElementById('frame');
		this.panel = this.shadowRoot.getElementById('panel');
		this.container = this.shadowRoot.getElementById('container');
		this.level = this.shadowRoot.getElementById('level');
		this.points = this.shadowRoot.getElementById('points');
	}		

	registerEventListeners() {
		// window events
		window.addEventListener('unload', this.onDocumentUnload.bind(this));

		// document events
		this.frame.addEventListener('scroll', this.onScroll.bind(this));
	}

	initializeText() {
		if (this.hasAttribute('data-category'))
			this.skillCategory = this.getAttribute('data-category');

		if (this.hasAttribute('data-level'))
			this.skillLevel = this.getAttribute('data-level');

		if (this.hasAttribute('data-points'))
			this.skillPoints = parseInt(this.getAttribute('data-points'));

		this.level.innerText = this.skillLevel;
		this.points.innerText = this.skillPoints;
	}
	
	//-------------------------------------------------------------------------
	// window events
	//-------------------------------------------------------------------------
	
	onDocumentUnload() {
		var readersData = new ReadersData();			
		var rc = readersData.readFromStorage();
		var title = encodeURIComponent(document.querySelector('title').innerText);
		readersData.addPage(window.location.pathname, title, this.skillCategory, this.skillLevel, this.skillPoints, this.percentRead, this.calculateReadingTime());
		readersData.writeToStorage();
	}
	
	//-------------------------------------------------------------------------
	// document events
	//-------------------------------------------------------------------------
	
	// capture the percentage read, a number from 0.0 to 1.0
	// capture the current time of this scroll event
	onScroll() {
		var percent = (this.frame.scrollTop + this.frame.offsetHeight) / this.frame.scrollHeight;
		percent = Math.min(percent.toFixed(2), 1.00);				// this may be greater than 1.00 if there are top and bottom borders, so normalize it back to 1.00
		this.percentRead = Math.max(percent, this.percentRead);		// if the user has scrolled up, and away from the bottom, retain the larger value
		
		if (this.firstScrollTime == null)
			this.firstScrollTime = Date.now();
		else
			this.lastScrollTime = Date.now();
	}
	
	//-------------------------------------------------------------------------
	// component methods
	//-------------------------------------------------------------------------
	
	show() {
		this.panel.classList.remove('hide');
		this.panel.classList.add('show');
	}
	
	//< returns time in seconds
	// The firstChunk is the amount of time between page load and the first scrolling event.
	// The lastChunk is the amount of time between page load and the final scrolling event.
	// In both cases, assume that the amount of reading time after the last scrolling event is equal to the firstChunk 
	calculateReadingTime() {
		if (this.firstScrollTime == null)
			return 0;
		
		var firstChunk = Math.round((this.firstScrollTime - this.loadTime) / 1000);
		if (this.lastScrollTime == null)
			return firstChunk + firstChunk;
		
		var lastChunk = Math.round((this.lastScrollTime - this.loadTime) / 1000);
		return lastChunk + firstChunk;
	}
}

window.customElements.define('rwt-reading-points', RwtReadingPoints);
