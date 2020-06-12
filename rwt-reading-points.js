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

	static elementInstance = 1;
	static htmlURL  = '/node_modules/rwt-reading-points/rwt-reading-points.blue';
	static cssURL   = '/node_modules/rwt-reading-points/rwt-reading-points.css';
	static htmlText = null;
	static cssText  = null;

	constructor() {
		super();
		
		// initialization
		this.hasShadowDom = false;
		
		// external elements
		this.frame = null;				// #frame : use scrolling events of this element to track reading time
		this.positioner = null;			// #objectives : insert the fly-in panel immediately below this element 
		
		// child elements
		this.panel = null;
		this.container = null;
		this.level = null;
		this.points = null;

		// data
		this.hasValidSetup = true;			// true when data- attributes are valid and #objectives element found
		this.skillCategory = 'General';		// open ended value
		this.skillLevel = 'Simple';			// Simple, Moderate, Challenge
		this.skillPoints = 1;				// 1,2,3,4,5, ...
		this.suggestedReadingTime = 60;		// suggested reading time in seconds
		this.percentRead = 0;				// determined with calculateReadingTime()
		
		// readingTime
		this.loadTime = Date.now();
		this.firstScrollTime = null;
		this.lastScrollTime = null;
		
		// properties
		this.instance = RwtReadingPoints.elementInstance++;

		Object.seal(this);
	}
	
	//-------------------------------------------------------------------------
	// customElement life cycle callbacks
	//-------------------------------------------------------------------------
	async connectedCallback() {		
		if (!this.isConnected)
			return;
		
		// connectedCallback is called again when this customElement is re-inserted back into the document (see below)
		if (this.hasShadowDom == true)
			return;
		
		try {
			var htmlFragment = await this.getHtmlFragment();
			var styleElement = await this.getCssStyleElement();

			this.attachShadow({mode: 'open'});
			this.shadowRoot.appendChild(htmlFragment); 
			this.shadowRoot.appendChild(styleElement); 
			this.hasShadowDom = true;
			
			this.identifyChildren();
			this.registerEventListeners();
			this.readAttributes();
			this.initializeText();
			this.validateSetup();
			this.show();
		}
		catch (err) {
			console.log(err.message);
		}
	}	
	
	//-------------------------------------------------------------------------
	// initialization
	//-------------------------------------------------------------------------

	// Only the first instance of this component fetches the HTML text from the server.
	// All other instances wait for it to issue an 'html-template-ready' event.
	// If this function is called when the first instance is still pending,
	// it must wait upon receipt of the 'html-template-ready' event.
	// If this function is called after the first instance has already fetched the HTML text,
	// it will immediately issue its own 'html-template-ready' event.
	// When the event is received, create an HTMLTemplateElement from the fetched HTML text,
	// and resolve the promise with a DocumentFragment.
	getHtmlFragment() {
		return new Promise(async (resolve, reject) => {
			var htmlTemplateReady = `RwtReadingPoints-html-template-ready`;
			
			document.addEventListener(htmlTemplateReady, () => {
				var template = document.createElement('template');
				template.innerHTML = RwtReadingPoints.htmlText;
				resolve(template.content);
			});
			
			if (this.instance == 1) {
				var response = await fetch(RwtReadingPoints.htmlURL, {cache: "no-cache", referrerPolicy: 'no-referrer'});
				if (response.status != 200 && response.status != 304) {
					reject(new Error(`Request for ${RwtReadingPoints.htmlURL} returned with ${response.status}`));
					return;
				}
				RwtReadingPoints.htmlText = await response.text();
				document.dispatchEvent(new Event(htmlTemplateReady));
			}
			else if (RwtReadingPoints.htmlText != null) {
				document.dispatchEvent(new Event(htmlTemplateReady));
			}
		});
	}
	
	// Use the same pattern to fetch the CSS text from the server
	// When the 'css-text-ready' event is received, create an HTMLStyleElement from the fetched CSS text,
	// and resolve the promise with that element.
	getCssStyleElement() {
		return new Promise(async (resolve, reject) => {
			var cssTextReady = `RwtReadingPoints-css-text-ready`;

			document.addEventListener(cssTextReady, () => {
				var styleElement = document.createElement('style');
				styleElement.innerHTML = RwtReadingPoints.cssText;
				resolve(styleElement);
			});
			
			if (this.instance == 1) {
				var response = await fetch(RwtReadingPoints.cssURL, {cache: "no-cache", referrerPolicy: 'no-referrer'});
				if (response.status != 200 && response.status != 304) {
					reject(new Error(`Request for ${RwtReadingPoints.cssURL} returned with ${response.status}`));
					return;
				}
				RwtReadingPoints.cssText = await response.text();
				document.dispatchEvent(new Event(cssTextReady));
			}
			else if (RwtReadingPoints.cssText != null) {
				document.dispatchEvent(new Event(cssTextReady));
			}
		});
	}
	
	//^ Identify this component's children
	identifyChildren() {
		this.frame = document.getElementById('frame');
		this.positioner = document.getElementById('objectives');
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

	readAttributes() {
		if (this.hasAttribute('data-category'))
			this.skillCategory = this.getAttribute('data-category');

		if (this.hasAttribute('data-level'))
			this.skillLevel = this.getAttribute('data-level');

		if (this.hasAttribute('data-points'))
			this.skillPoints = parseInt(this.getAttribute('data-points'));

		if (this.hasAttribute('data-time'))
			this.suggestedReadingTime = parseInt(this.getAttribute('data-time'));
	}
	
	initializeText() {
		this.level.innerText = this.skillLevel;
		this.points.innerText = this.skillPoints;
	}

	validateSetup() {
		// if the data attributes are not properly set, do not display the panel
		if (isNaN(this.skillPoints) || this.skillPoints == 0)
			this.hasValidSetup = false;
		if (isNaN(this.suggestedReadingTime) || this.suggestedReadingTime == 0)
			this.hasValidSetup = false;
		
		// if the #frame or #objectives element were not found, do not display panel
		if (this.frame == null)
			this.hasValidSetup = false;
		if (this.positioner == null)
			this.hasValidSetup = false;
	}
	
	//-------------------------------------------------------------------------
	// window events
	//-------------------------------------------------------------------------
	
	onDocumentUnload() {
		if (!this.hasValidSetup)
			return;

		var readersData = new ReadersData();			
		var rc = readersData.readFromStorage();
		var title = document.querySelector('title').innerText;
		var cappedReadingTime = this.calculateReadingTime();
		readersData.addPage(window.location.pathname, title, this.skillCategory, this.skillLevel, this.skillPoints, this.suggestedReadingTime, this.percentRead, cappedReadingTime);
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
	
	// do not show the fly-in panel if the data- attributes were not properly set
	show() {
		if (!this.hasValidSetup)
			return;

		// re-insert the customElement to be just below the #objectives positioner
		this.positioner.after(this);
		
		this.panel.classList.remove('hide');
		this.panel.classList.add('show');
	}
	
	//< returns time in seconds
	// The firstChunk is the amount of time between page load and the first scrolling event.
	// The lastChunk is the amount of time between page load and the final scrolling event.
	// In both cases, assume that the amount of reading time after the last scrolling event is equal to the firstChunk 
	// Cap the reading time at two times the suggested reading time.
	calculateReadingTime() {		
		var cappedReadingTime = (2 * this.suggestedReadingTime);

		if (this.firstScrollTime == null)
			return 0;
		
		var firstChunk = Math.round((this.firstScrollTime - this.loadTime) / 1000);
		if (this.lastScrollTime == null)
			return Math.min(firstChunk + firstChunk, cappedReadingTime);
		
		var lastChunk = Math.round((this.lastScrollTime - this.loadTime) / 1000);
		return Math.min(lastChunk + firstChunk, cappedReadingTime);
	}
}

window.customElements.define('rwt-reading-points', RwtReadingPoints);
