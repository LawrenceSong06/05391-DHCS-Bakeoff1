// This constant sets the number of tasks per trial. You can change it while you are experimenting, but it should be set back to 10 for the actual Bakeoff.
const tasksLength = 10;

// constants relating to the number of squares and the size of the canvas are defined in the framework, so you can refer to these (but should not change their values):
// canvasSize is the size in pixels of the biggest area of screen you may use (regardless of whether you are using the Canvas itself, an SVG, or a div.)

// As in HW4, it never hurts to put any code that requires access to page elements inside the handler for the load event.
window.addEventListener("load", (e: Event) => {

	// =========== This part is required: =========== 
	// Initialize the "judge" object with the number of tasks per trial and your team name. 
	// The third parameter sets the trial engine in "verbose" mode or not -- if it is set to "true", all the events will be logged to the Console. (You may wish to set it to "false" if you find these logs overwhelming.)
	const trial = new Trial(tasksLength, "Team4", false);
	// =========== /end required =========== 

	// You *may* add listeners to the handful of provided Trial events: "newTask", "start", "testOver", "wrongSquare", "correctSquare", "stop" (but this will probably mostly be useful for debugging).
	trial.addEventListener("start", () => {
		console.log("starting!");
	});

	// Create a report for the trial
	trial.addEventListener("stop", () => {
		// This is the total number of clicks happened during the testing
		// it is just all correct clicks + all wrong clicks
		let total_click : number = trial.wrongClicks + tasksLength;

		// The penalty caused by wrong clicks by given formula in the bakeoff
		let penalty : number = 0.1 * trial.wrongClicks;

		// Total time elapsed in ms. This is just summing all splits together
		let time_elapsed = trial.splits.reduce((a : number, b : number) : number => {
			return a + b;
		}, 0);

		// Printing the report
		console.log("\n==========Trial Summary===========\n"+
					"---------------Clicks-------------\n"+
					"Number of Rounds: " + tasksLength + "\n"+
					"Total clicks: " + total_click + "\n"+
					"Wrong clicks: " + trial.wrongClicks +"\n"+
					"Accuracy: " + (tasksLength / total_click)*100 + "%\n"+
					"Penalty: " + penalty + "ms\n"+
					"---------------Time---------------\n"+
					"Total time elapsed: " + time_elapsed + "s\n"+
					"Average time per correct click: " + time_elapsed/tasksLength + "ms\n"+
					"------------Final Score-----------\n"+
					time_elapsed/1000 + penalty + penalty ? 1 : 0);

		// Reset wrongClicks (there is no reset)
		trial.wrongClicks = 0;

		// Recover all greyed out squares
		setTimeout(() => {
			Array.from(document.getElementsByClassName("square")).map((button : HTMLButtonElement)=>{
			button.style.opacity = "1";
			button.style.pointerEvents = "initial";
		});
		}, 0);
	});

	// =========== This part is required: =========== 
	// Draw your clickable squares/buttons somehow. Your elements should, when clicked, invoke the trial.submitClick method, with their numerical ID as the argument: if I click button 1, it should call `trial.submitClick(1)` 
	// Try un-commenting each of these (one at a time) to see how they work.
	makeSquaresUsingHTMLButtons(trial);	
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

	// Create a div for displaying messages about whether user clicked the right square or not 
	let message : HTMLDivElement = document.createElement("div");
	message.style.width = "280px"; // make sure the width is the same as rows of the buttons
	message.style.height = "50px";  
	message.style.fontSize = "20px";
	message.id = "message";
	// The initial status of message div. All status: waiting, correct, incorrect 
	// Where correct means the message for correct click on the target is currently displayed
	// and vice-versa
	message.className = "waiting"; 

	// The timeout id tracker for restoring message to `waiting` status
	// This will be used later when buttons are clicked and the message status is changed
	// (We have to restore the message status when it is changed to correct or incorrect after some time
	// to enhance feedback)
	// The defualt value is 0, meaning that there is no timeout set.
	let restore_message_timeout : number = 0;

	// Add it to the grid
	grid.appendChild(message);

	// As documented above, the "squares" data object is a 2D array. We'll use nested loops to go over it.
	// The outer loop goes through the rows...
	for (let rowNumber=0; rowNumber<squares.length; rowNumber++) {
		// Create a div to be sub-container for just this row.
		let row : HTMLDivElement = document.createElement("div");

		// Use flex box to align all buttons to the right (closer to the sidebar)
        row.style.display = "flex";
        row.style.flexDirection = "row";
        row.style.justifyContent = "flex-end";
		
		// ...and the inner loop goes through the squares in a row.
		for (let columnNumber=0; columnNumber<squares[rowNumber].length; columnNumber++) {
			// get the id and color data for this square
			let squareID : number = squares[rowNumber][columnNumber].id;
			let squareColor : string = squares[rowNumber][columnNumber].color;
			
			// Make a button element
			let button : HTMLButtonElement = document.createElement("button");
			button.classList.add("square");

			// Add the square's ID as the text of the button
			button.innerText = ""+squareID; // the empty string ("") is added to the squareID to convert it from a number (as it is stored in the squareData) to a string (which is what is needed for an innerText property). This is not strictly necessary in plain JavaScript -- JS will do the conversion implicitly -- but TypeScript does care, and I find it helpful to my own understanding/debugging to be careful about this kind of thing.

			button.style.fontSize = "35px"; // make the text bigger, so it's easier to read on the buttons (adjusting for larger button size)
			button.style.display = "flex";
			button.style.alignItems = "center";
			button.style.justifyContent = "center"; // Align all the text to the center
			button.style.border = "rgb(126, 126, 126) 2px solid";
			// style the button to have the square's color as its background color. Helps the user recognize it from the indicator grid.
			button.style.background = squareColor;

			button.style.width = "65px"; // set the button to a standard width and height, for a more standardized game experience.
			button.style.height = "65px";
			button.style.cursor = "pointer"; // set the cursor to pointer to enhance user's perception for mouse location

			button.style.margin = "3px"; // add some space between the buttons, so they don't look like one big mass of color.
			row.style.display = "flex"; // this makes the buttons in this row line up horizontally instead of vertically.x

			// Very important: we need to be able to tell the trial engine when this button has been clicked! Since we are making these as their own HTML elements, we can add a click listener to each. The handler will report the click to the trial engine using the trial.submitClick method. The handler function is being defined in-place (anonymously) right in the addEventListener method call.
			button.addEventListener("click", () => {
				// Depending on your programming background (which language[s] you are more familiar with), you may be suspicious about using the "squareID" variable in this click handler function, since you may have noticed that it is only declared within this inner loop and its value will be different each time through the loop.
				// However, *will* work in JS, using a language feature called a "closure": because the variable exists with a value at the time that the function is defined (right here, within this instance of the per-square loop), it will continuing existing within that function even if alternate-universe versions of it are created the other times through the loop. MDN's explanation (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures) is a little long/confusing IMO but here's a tiktok: https://www.tiktok.com/@snack.js/video/7606405733172694292
				// P.S. One of the "subtle differences between var and let" that I mentioned in class is how they work with closures -- see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures#creating_closures_in_loops_a_common_mistake for details.
				
				// HACKING the framework lol
				// This value is the number of wrong clicks before current click
				// It will be used to compare to the number of wrong clicks after current click
				// If it increased, then we have a wrong click! Otherwise, it is correct
				// We can then set the message using this information
				let wrongClicks_before : number = trial.wrongClicks;
				trial.submitClick(squareID);

				// The boolean value for correctness of the click
				// This will be used soon after for modifying the class of massage div
				let incorrect : boolean = trial.wrongClicks > wrongClicks_before

				// Change the status of message based on correctness of the click
				// CSS is used to controll the message content and background,
				// so we do not have to worry about those here
				if(incorrect){
					message.className = "incorrect";
				}else{
					// Since each square can only be correctly hit once,
					// we grey it out after it is clicked. (Also, it cannot be clicked anymore)
					button.style.opacity = ".3";
					button.style.pointerEvents = "none";
					message.className = "correct";
				}

				// Restore waiting status after 1 second
				// If there is a current timeout counting down, reset it so that
				// the message will not frequently flash 
				// (which will probably be considered buggy and might confuse the users)
				clearTimeout(restore_message_timeout);
				restore_message_timeout = setTimeout(function(){
					message.className = "waiting";
				}, 1000);
			});

			// then, add this button to the row
			row.appendChild(button);
		}
		// Now that this row has its buttons in it, add it to the grid. (We could actually have added it *before* filling it up -- appendChild would work either way -- but I use this approach to building up 2D grids with other data types as well, and there are several different kinds of mutability in JS.)
		grid.appendChild(row);
	}
}