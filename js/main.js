// This constant sets the number of tasks per trial. You can change it while you are experimenting, but it should be set back to 10 for the actual Bakeoff.
var tasksLength = 3;
// constants relating to the number of squares and the size of the canvas are defined in the framework, so you can refer to these (but should not change their values):
// canvasSize is the size in pixels of the biggest area of screen you may use (regardless of whether you are using the Canvas itself, an SVG, or a div.)
// As in HW4, it never hurts to put any code that requires access to page elements inside the handler for the load event.
window.addEventListener("load", function (e) {
    // =========== This part is required: =========== 
    // Initialize the "judge" object with the number of tasks per trial and your team name. 
    // The third parameter sets the trial engine in "verbose" mode or not -- if it is set to "true", all the events will be logged to the Console. (You may wish to set it to "false" if you find these logs overwhelming.)
    var trial = new Trial(tasksLength, "Team4", true);
    // =========== /end required =========== 
    // You *may* add listeners to the handful of provided Trial events: "newTask", "start", "testOver", "wrongSquare", "correctSquare", "stop" (but this will probably mostly be useful for debugging).
    trial.addEventListener("start", function () {
        console.log("starting!");
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
function makeSquaresUsingHTMLButtons(trial) {
    console.log("HTML button variant!");
    /* First, we get a the data about the squares from the "trial" engine. This will be 2D array (a list of lists) of "squares", where each square is an object like this:
    {
        id: 1, // a numerical id -- this is how you should identify this square when it is clicked (and you may want to display the number on the square, too)
        color: "#11eaea" // a string corresponding to a color (hex rgb). This is the color that the trial engine will display this square as, so you may want to use it, too.
    }
    The position in the nested array indicates where this square is in the the trial's task indicator grid (and you probably want to put it in the same place in yours). The outer array is rows (bottom to top) and each inner one is a square (left to right).
    */
    var squares = trial.getSquaresData();
    // Then we get the main div element so that we can add things to it, just like HW4.
    var mainDiv = document.getElementById("main");
    // Make a div to act as a container (not totally necessary but it will make the layout nicer).
    var grid = document.createElement("div");
    grid.classList.add("display"); // this class gets the thin black outline in the built-in CSS
    // By the rules of the Bakeoff, the area where we put the clickable elements cannot be bigger than the canvasSize variable supplied by the framework code. We'll set the "grid" container element to that size, to be sure.
    grid.style.width = canvasSize + "px";
    grid.style.height = canvasSize + "px";
    // And then, as in HW4, the grid is added as a child of the main element.
    mainDiv.appendChild(grid);
    // As documented above, the "squares" data object is a 2D array. We'll use nested loops to go over it.
    // The outer loop goes through the rows...
    for (var rowNumber = 0; rowNumber < squares.length; rowNumber++) {
        // Create a div to be sub-container for just this row.
        var row = document.createElement("div");
        var _loop_1 = function (columnNumber) {
            // get the id and color data for this square
            var squareID = squares[rowNumber][columnNumber].id;
            var squareColor = squares[rowNumber][columnNumber].color;
            // Make a button element
            var button = document.createElement("button");
            button.classList.add("hover-light");
            // Add the square's ID as the text of the button
            button.innerText = "" + squareID; // the empty string ("") is added to the squareID to convert it from a number (as it is stored in the squareData) to a string (which is what is needed for an innerText property). This is not strictly necessary in plain JavaScript -- JS will do the conversion implicitly -- but TypeScript does care, and I find it helpful to my own understanding/debugging to be careful about this kind of thing.
            button.style.fontSize = "50px"; // make the text bigger, so it's easier to read on the buttons (adjusting for larger button size)
            // style the button to have the square's color as its background color.
            button.style.background = squareColor;
            button.style.width = "165px"; // set the button to a standard width and height, for a more standardized game experience.
            button.style.height = "165px";
            button.style.margin = "5px"; // add some space between the buttons, so they don't look like one big mass of color.
            row.style.display = "flex"; // this makes the buttons in this row line up horizontally instead of vertically.x
            // Very important: we need to be able to tell the trial engine when this button has been clicked! Since we are making these as their own HTML elements, we can add a click listener to each. The handler will report the click to the trial engine using the trial.submitClick method. The handler function is being defined in-place (anonymously) right in the addEventListener method call.
            button.addEventListener("click", function () {
                // Depending on your programming background (which language[s] you are more familiar with), you may be suspicious about using the "squareID" variable in this click handler function, since you may have noticed that it is only declared within this inner loop and its value will be different each time through the loop.
                // However, *will* work in JS, using a language feature called a "closure": because the variable exists with a value at the time that the function is defined (right here, within this instance of the per-square loop), it will continuing existing within that function even if alternate-universe versions of it are created the other times through the loop. MDN's explanation (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures) is a little long/confusing IMO but here's a tiktok: https://www.tiktok.com/@snack.js/video/7606405733172694292
                // P.S. One of the "subtle differences between var and let" that I mentioned in class is how they work with closures -- see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures#creating_closures_in_loops_a_common_mistake for details.
                trial.submitClick(squareID);
            });
            // then, add this button to the row
            row.appendChild(button);
        };
        // ...and the inner loop goes through the squares in a row.
        for (var columnNumber = 0; columnNumber < squares[rowNumber].length; columnNumber++) {
            _loop_1(columnNumber);
        }
        // Now that this row has its buttons in it, add it to the grid. (We could actually have added it *before* filling it up -- appendChild would work either way -- but I use this approach to building up 2D grids with other data types as well, and there are several different kinds of mutability in JS.)
        grid.appendChild(row);
    }
}
//# sourceMappingURL=main.js.map