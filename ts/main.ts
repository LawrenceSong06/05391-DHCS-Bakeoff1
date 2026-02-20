// This constant sets the number of tasks per trial. You can change it while you are experimenting, but it should be set back to 10 for the actual Bakeoff.
const tasksLength = 3;

// constants relating to the number of squares and the size of the canvas are defined in the framework, so you can refer to these (but should not change their values):
// canvasSize is the size in pixels of the biggest area of screen you may use (regardless of whether you are using the Canvas itself, an SVG, or a div.)

// As in HW4, it never hurts to put any code that requires access to page elements inside the handler for the load event.
window.addEventListener("load", (e: Event) => {

	// =========== This part is required: =========== 
	// Initialize the "judge" object with the number of tasks per trial and your team name. 
	// The third parameter sets the trial engine in "verbose" mode or not -- if it is set to "true", all the events will be logged to the Console. (You may wish to set it to "false" if you find these logs overwhelming.)
	const trial = new Trial(tasksLength, "teamName", true);
	// =========== /end required =========== 
	

	// You *may* add listeners to the handful of provided Trial events: "newTask", "start", "testOver", "wrongSquare", "correctSquare", "stop" (but this will probably mostly be useful for debugging).
	trial.addEventListener("start", () => {
		console.log("starting!");
	});

	// =========== This part is required: =========== 
	// Draw your clickable squares/buttons somehow. Your elements should, when clicked, invoke the trial.submitClick method, with their numerical ID as the argument: if I click button 1, it should call `trial.submitClick(1)` 
	// Try un-commenting each of these (one at a time) to see how they work.

	makeSquaresUsingHTMLButtons(trial);	
	// makeSquaresUsingCanvasAPI(trial);	
	// makeSquaresUsingSVG(trial);	// if you un-comment this one, you also need to un-comment the line `<script src="./js/svg.js"></script>` near the end of the index.html (this is the only change you are allowed to make to the index.htm)
});

// =============================================================
// ========== How to make a grid of clickable elements =========
// =============================================================

// This section includes three different ways to draw a grid of clickable elements. Any of these is allowed for Bakeoff 1, as long as the overall area they are drawn it is no bigger than the canvasSize const provided by the framework.
// Note that *all of them* somehow invoke the trial.submitClick method: this is a necessary part of the trial framework.


// This version is most similar to how we did things in HW4: it makes the clickable squares out of HTML button elements.
function makeSquaresUsingHTMLButtons(trial: Trial) {
	console.log("HTML button variant!");

	/* First, we get a the data about the squares from the "trial" engine. This will be 2D array (a list of lists) of "squares", where each square is an object like this:
	{
		id: 1, // a numerical id -- this is how you should identify this square when it is clicked (and you may want to display the number on the square, too)
		color: "#11eaea" // a string corresponding to a color (hex rgb). This is the color that the trial engine will display this square as, so you may want to use it, too.
	}
	The position in the nested array indicates where this square is in the the trial's task indicator grid (and you probably want to put it in the same place in yours). The outer array is rows (bottom to top) and each inner one is a square (left to right).
	*/

	let squares : Array<Array<squareData>> = trial.getSquaresData();

	// Then we get the main div element so that we can add things to it, just like HW4.

	let mainDiv = document.getElementById("main") as HTMLDivElement;

	// Make a div to act as a container (not totally necessary but it will make the layout nicer).
	let grid : HTMLDivElement = document.createElement("div");
	grid.classList.add("display"); // this class gets the thin black outline in the built-in CSS

	// By the rules of the Bakeoff, the area where we put the clickable elements cannot be bigger than the canvasSize variable supplied by the framework code. We'll set the "grid" container element to that size, to be sure.
	grid.style.width = canvasSize+"px";
	grid.style.height = canvasSize+"px";

	// And then, as in HW4, the grid is added as a child of the main element.
	mainDiv.appendChild(grid);

	// As documented above, the "squares" data object is a 2D array. We'll use nested loops to go over it.
	// The outer loop goes through the rows...
	for (let rowNumber=0; rowNumber<squares.length; rowNumber++) {
		// Create a div to be sub-container for just this row.
		let row : HTMLDivElement = document.createElement("div");
		
		// ...and the inner loop goes through the squares in a row.
		for (let columnNumber=0; columnNumber<squares[rowNumber].length; columnNumber++) {
			// get the id and color data for this square
			let squareID : number = squares[rowNumber][columnNumber].id;
			let squareColor : string = squares[rowNumber][columnNumber].color;

			// Make a button element
			let button : HTMLButtonElement = document.createElement("button");

			// Add the square's ID as the text of the button
			button.innerText = ""+squareID; // the empty string ("") is added to the squareID to convert it from a number (as it is stored in the squareData) to a string (which is what is needed for an innerText property). This is not strictly necessary in plain JavaScript -- JS will do the conversion implicitly -- but TypeScript does care, and I find it helpful to my own understanding/debugging to be careful about this kind of thing.

			// style the button to have the square's color as its background color.
			button.style = "background: "+squareColor+";";

			// Very important: we need to be able to tell the trial engine when this button has been clicked! Since we are making these as their own HTML elements, we can add a click listener to each. The handler will report the click to the trial engine using the trial.submitClick method. The handler function is being defined in-place (anonymously) right in the addEventListener method call.
			button.addEventListener("click", () => {
				// Depending on your programming background (which language[s] you are more familiar with), you may be suspicious about using the "squareID" variable in this click handler function, since you may have noticed that it is only declared within this inner loop and its value will be different each time through the loop.
				// However, *will* work in JS, using a language feature called a "closure": because the variable exists with a value at the time that the function is defined (right here, within this instance of the per-square loop), it will continuing existing within that function even if alternate-universe versions of it are created the other times through the loop. MDN's explanation (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures) is a little long/confusing IMO but here's a tiktok: https://www.tiktok.com/@snack.js/video/7606405733172694292
				// P.S. One of the "subtle differences between var and let" that I mentioned in class is how they work with closures -- see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures#creating_closures_in_loops_a_common_mistake for details.
				trial.submitClick(squareID);
			});

			// then, add this button to the row
			row.appendChild(button);
		}
		// Now that this row has its buttons in it, add it to the grid. (We could actually have added it *before* filling it up -- appendChild would work either way -- but I use this approach to building up 2D grids with other data types as well, and there are several different kinds of mutability in JS.)
		grid.appendChild(row);
	}
}

// Here is a version using the Canvas API. "canvas" is a built-in HTML element type that has a special set of features such that you can draw raster images directly into it using functions like "fillRect". If you are familiar with Processing, you will find that it has very similar capabilities. Here's the main MDN documentation page:
// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
// ...and I do recommend their tutorial:
// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial
function makeSquaresUsingCanvasAPI(trial: Trial) {
	console.log("Canvas variant!");

	// Just as in the above version of the grid-drawing function, you'll need the squares data and the mainDiv.
	let squares : Array<Array<squareData>> = trial.getSquaresData();
	let mainDiv = document.getElementById("main") as HTMLDivElement;

	// This time, make a *canvas* element
	let canvasElement : HTMLCanvasElement = document.createElement("canvas");

	// And, as before, set it to the Bakeoff rules max size and append it to the mainDiv.
	canvasElement.width = canvasSize;
	canvasElement.height = canvasSize;
	mainDiv.appendChild(canvasElement);

	// Somewhat confusingly, we don't address Canvas API calls to the canvas element itself. We need a "rendering context," which we ask the canvas for. (There are several different ones -- we're going to use the "2d" one, for drawing shaps/pixels in 2D.) All the drawing methods belong to this "draw" variable, not the underlying canvas element.
	let draw : CanvasRenderingContext2D = canvasElement.getContext("2d");

	// Some consts to change where the squares are drawn.
	const margin : number = 200; // the margin around the squares
	const padding : number = 50; // padding between squares
	const squareSize : number = 40; // their width/height

	// As in the above version, we use a nested loop to go through the 2D array of squares data.
	for (let rowNumber=0; rowNumber<squares.length; rowNumber++) {
		for (let columnNumber=0; columnNumber<squares[rowNumber].length; columnNumber++) {
			// Calculate where this square should be, based on the padding and margins:
			let x = (columnNumber * (padding + squareSize)) + margin;
			let y = (rowNumber * (padding + squareSize)) + margin;

			// get the id and color data for this square
			let squareID : number = squares[rowNumber][columnNumber].id;
			let squareColor : string = squares[rowNumber][columnNumber].color;

			// set the fill color to the color of this square
			draw.fillStyle = squareColor;
			// and draw a rectangle here
			draw.fillRect(x, y, squareSize, squareSize);

			// add a text label of this square's ID
			draw.fillStyle = "#000"; // black, to draw the text
			draw.fillText(""+squareID, x, y);
		}
	}

	// The major drawback of using pure raw pixels is that our "buttons" are actually just rectangles drawn on the page -- they don't have any interactive ability of their own. So to know when a rectangle is clicked, we need to listen for a click *anywhere* on the canvas, then figure out which (if any) rectangle is at that place on the canvas.
	canvasElement.addEventListener("click", (e: PointerEvent) => {
		// First, get the x and y locations of the click from the event object that was passed into this handler by the listener.
		// Pointer events (like click and move) give you several different x and y options. The "offsetX" and "offsetY" variants are the ones that tell you the coordinates relative to the bounding box of the element (so, the same coordinate system as we used while drawing).
		let x = e.offsetX;
		let y = e.offsetY;

		// To get the row/column number, have to reverse the math of how we drew the squares in the first place...
		let rowNumber = Math.floor((y - margin)/(padding + squareSize));
		let columnNumber = Math.floor((x - margin)/(padding + squareSize));

		// ...and then we use those to look up the id number in the squares data.
		if (rowNumber>=0 && rowNumber<squares.length && columnNumber>=0 && columnNumber<squares[0].length) {	// make sure there's a square here	
			let squareID = squares[rowNumber][columnNumber].id;
			// console.log(squareID);

			// and submit it to the trial judge!
			trial.submitClick(squareID);
		}
		else {
			// trial.submitClick(-1);
		}

	})
}


// Here is a version using the svg.js library to produce an svg (vector) display. Like the HTML button variant and unlike the Canvas variant, you can attach an event listener to an SVG element. Unlike the HTML button variant and more like the Canvas variant, you have a lot more control over the exact shape/position of the clickable elements. The drawback is that SVG has some quirks. I've found that the svg.js library makes many of these less bad, though it does introduce some of its own.
// I've included the svg.js in this directory for portability, but it was *not written by me*. The documentation is at: https://svgjs.dev/docs/3.0/
// If you want to use the SVG library, you *must* uncomment the line `<script src="./js/svg.js"></script>` near the end of the index.html (this is the only change you are allowed to make to the index.htm).
function makeSquaresUsingSVG(trial: Trial) {
	console.log("SVG variant!");

	// As before, get the squares data.
	let squares = trial.getSquaresData();

	// Some consts to change where the squares are drawn.
	const margin : number = 200; // the margin around the squares
	const padding : number = 50; // padding between squares
	const squareSize : number = 40; // their width/height

	// SVG.js will handling making the necessary new SVG container element and setting its size; you just have to tell it what parent element to add to. In this case, the # in "#main" means "id='main'" -- this is a syntax shorthand that many JS frameworks use.
	let svg = SVG().addTo('#main').size(canvasSize, canvasSize);

	// As before -- a nested loop to go through the provided squares data.
	for (let rowNumber=0; rowNumber<squares.length; rowNumber++) {
		for (let columnNumber=0; columnNumber<squares[rowNumber].length; columnNumber++) {
			// Calculate where this square should be:
			let x = (columnNumber) * (padding + squareSize) + margin;
			let y = Math.floor(rowNumber) * (padding + squareSize) + margin;

			// get the id and color data for this square
			let squareID : number = squares[rowNumber][columnNumber].id;
			let squareColor : string = squares[rowNumber][columnNumber].color;

			// In svg.js, instead of drawing a rectangle "at" a location, "with" a particular color, we first make a rectangle at a particular size...
			let square = svg.rect(squareSize, squareSize);
			// ...and then we move it to where we want it. (This is different from Processing or the Canvas API, where we make them "in the right place" to start with.)
			square.move(x, y);
			// and we can change the element's color at any time after it exists:
			square.fill(squareColor);
			// (see the svg.js documentation for more information on colors, fill vs stroke, etc)


			// SVG.js has a slightly different way of doing event listeners. For the click event, it looks like this:
			square.click(()=>{
				trial.submitClick(squareID)
			});
		}
	}
}
