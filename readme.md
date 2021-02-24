












<figure>
	<img src='/img/components/reading-points/reading-points-1500x750.jpg' width='100%' />
	<figcaption></figcaption>
</figure>

##### Open Source DOM Component

# Reading Points

## Percentage read, reading time & points


<address>
<img src='/img/48x48/rwtools.png' /> by <a href='https://readwritetools.com' title='Read Write Tools'>Read Write Tools</a> <time datetime=2020-01-20>Jan 20, 2020</time></address>



<table>
	<tr><th>Abstract</th></tr>
	<tr><td>The <span class=product>rwt-reading-points</span> DOM component provides site visitors with a clue about a document's reading-level, using a descriptive <i>learning level</i> and <i>experience points</i> system.  </td></tr>
</table>

### Motivation

When user's browse technical documentation it's not always easy to know if a
page is meant for first timers or advanced users. This DOM component provides
that information using an ephemeral notification-style text block.

As the user reads, a timer tracks how many seconds is spent reading. As the user
scrolls down, the readers progress (as percent read) is tracked. This
information is saved to the user's local storage for use with the <span>
rwt-reading-summary</span> DOM component.

#### In the wild

To see an example of this component in use, visit the <a href='https://rwserve.readwritetools.com/features.blue'>READ WRITE SERVE</a>
website. The component is visible immediately after loading for about five
seconds before fading away. To understand what's going on under the hood, use
the browser's inspector to view the HTML source code and network activity, and
follow along as you read this documentation.

### Installation

#### Prerequisites

The <span>rwt-reading-points</span> DOM component works in any
browser that supports modern W3C standards. Templates are written using <span>
BLUE</span><span>PHRASE</span> notation, which can be compiled into HTML using the
free <a href='https://hub.readwritetools.com/desktop/rwview.blue'>Read Write View</a>
desktop app. It has no other prerequisites. Distribution and installation are
done with either NPM or via Github.

#### Download


<details>
	<summary>Download using NPM</summary>
	<p><b>OPTION 1:</b> Familiar with Node.js and the <code>package.json</code> file?<br />Great. Install the component with this command:</p>
	<pre lang=bash>
npm install rwt-reading-points<br />	</pre>
	<p><b>OPTION 2:</b> No prior experience using NPM?<br />Just follow these general steps:</p>
	<ul>
		<li>Install <a href='https://nodejs.org'>Node.js/NPM</a> on your development computer.</li>
		<li>Create a <code>package.json</code> file in the root of your web project using the command:</li>
		<pre lang=bash>
npm init<br />		</pre>
		<li>Download and install the DOM component using the command:</li>
		<pre lang=bash>
npm install rwt-reading-points<br />		</pre>
	</ul>
	<p style='font-size:0.9em'>Important note: This DOM component uses Node.js and NPM and <code>package.json</code> as a convenient <i>distribution and installation</i> mechanism. The DOM component itself does not need them.</p>
</details>


<details>
	<summary>Download using Github</summary>
	<p>If you prefer using Github directly, simply follow these steps:</p>
	<ul>
		<li>Create a <code>node_modules</code> directory in the root of your web project.</li>
		<li>Clone the <span class=product>rwt-reading-points</span> DOM component into it using the command:</li>
		<pre lang=bash>
git clone https://github.com/readwritetools/rwt-reading-points.git<br />		</pre>
	</ul>
</details>

### Using the DOM component

After installation, you need to add two things to your HTML page to make use of
it.

   * Add a `script` tag to load the component's `rwt-reading-points.js` file:
```html
<script src='/node_modules/rwt-reading-points/rwt-reading-points.js' type=module></script>             
```

   * Add the component tag anywhere on the page. The actual placement on the page
      will be determined using JavaScript.

      * For scripting purposes, apply an `id` attribute.
      * Provide a value for the number of experience points the visitor will gain by
         reading the document, using the `data-points` attribute.
      * Provide an assessment of the reading difficulty using the `data-time` attribute,
         using descriptions such as: <samp>Simple</samp>, <samp>Moderate</samp>, <samp>
Difficult</samp>, <samp>Challenging</samp>, etc.
      * Provide an estimate of the reading time, in seconds, using the `data-time` attribute.

      * Provide a descriptive word to catagorize the document, using the `data-category` attribute.

```html
<rwt-reading-points id=reading-points data-time='190' data-points='4' data-level='Moderate' data-category='Phrasing'></rwt-reading-points>             
```


Initially the component is hidden. It appears soon after the page first loads.
It fades away after a few seconds.

The position of the text block is always immediately after the document element
with the identifier `objectives`. You should style your page to provide a small
amount of whitespace in that area using `margin-bottom` or something similar. The
component itself is designed so that it does not occupy space.

The user's reading time is tracked by movement of the scroll bar placed on the
document's outermost frame, which should be identified as `frame`.

If the page does not have either the `objectives` element or the `frame` element,
the component will be disabled. This is intentional, as it allows a generic
template to be used for a website.

If the `data-time` attribute is zero or the `data-points` attribute is zero, the
component will also be disabled.

#### Dialog size and appearance

The slide-in text panel is sized using four CSS variables, which may be
overridden with new values, for example:

```css
rwt-reading-points {
    --font-size: 0.8rem;
    --panel-width: 12rem;
    --panel-height: 3rem;
    --panel-destination: 6rem;
}
```

#### Color scheme

The default color palette for the panel can be overridden as well, for example:

```css
rwt-reading-points {
    --color: #333;
    --background: #ddd;
    --accent-color1: #00c;
}
```

### Internals

The visitor's reading time and experience points are stored in local-storage
under the key `favorite-data`.

### Life-cycle events

The component issues life-cycle events.


<dl>
	<dt><code>component-loaded</code></dt>
	<dd>Sent when the component is fully loaded and ready to be used. As a convenience you can use the <code>waitOnLoading()</code> method which returns a promise that resolves when the <code>component-loaded</code> event is received. Call this asynchronously with <code>await</code>.</dd>
</dl>

---

### Reference


<table>
	<tr><td><img src='/img/48x48/read-write-hub.png' alt='DOM components logo' width=48 /></td>	<td>Documentation</td> 		<td><a href='https://hub.readwritetools.com/components/reading-points.blue'>READ WRITE HUB</a></td></tr>
	<tr><td><img src='/img/48x48/git.png' alt='git logo' width=48 /></td>	<td>Source code</td> 			<td><a href='https://github.com/readwritetools/rwt-reading-points'>github</a></td></tr>
	<tr><td><img src='/img/48x48/dom-components.png' alt='DOM components logo' width=48 /></td>	<td>Component catalog</td> 	<td><a href='https://domcomponents.com/components/reading-points.blue'>DOM COMPONENTS</a></td></tr>
	<tr><td><img src='/img/48x48/npm.png' alt='npm logo' width=48 /></td>	<td>Package installation</td> <td><a href='https://www.npmjs.com/package/rwt-reading-points'>npm</a></td></tr>
	<tr><td><img src='/img/48x48/read-write-stack.png' alt='Read Write Stack logo' width=48 /></td>	<td>Publication venue</td>	<td><a href='https://readwritestack.com/components/reading-points.blue'>READ WRITE STACK</a></td></tr>
</table>

### License

The <span>rwt-newton</span> DOM component is licensed under the MIT
License.

<img src='/img/blue-seal-mit.png' width=80 align=right />

<details>
	<summary>MIT License</summary>
	<p>Copyright © 2020 Read Write Tools.</p>
	<p>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</p>
	<p>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</p>
	<p>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>
</details>

