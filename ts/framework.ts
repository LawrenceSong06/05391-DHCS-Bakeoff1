// =========== Data types. ======================= 
type resultData = {
	splits: Array<number>, 
	wrongClicks: number, 
	teamName: string
}

type squareData = {id:number, color:string};

type judgeEvent = 
	"newTask" // a new task has begun
	| "start" // a new trial has started
	| "testOver" // we are out of tasks for this trial
	| "wrongSquare" // the wrong square was clicked
	| "correctSquare" // the right square was clicked
	| "stop"; // the trial has been stopped (e.g. with the stop button)

// =========== /end of types. ======================= 

// =========== configuration constants =========== 
// consts for the number of squares and the size of the drawable area
const numberOfSquaresWide : number = 4;
const numberOfSquaresTall : number = 4;
const canvasSize : number = 700;

// Trial configuration
const reportURL : string = "https://bakeoff-1-data.cmu-dhcs.workers.dev/";
const competitionNumberOfTasks : number = 10;

// Some nice colored squares for us to use. Note that their IDs are 1-indexed (there is no square 0, and the biggest number is 16).
const squares:Array<Array<squareData>> = [
    [
        {"id": 1, "color": "#B4EA5E"},
        {"id": 2, "color": "#9CD18D"},
        {"id": 3, "color": "#84B9BB"},
        {"id": 4, "color": "#6CA0EA"}
    ],
    [
        {"id": 5, "color": "#CDEB71"},
        {"id": 6, "color": "#BCCF97"},
        {"id": 7, "color": "#AAB4BC"},
        {"id": 8, "color": "#9998E2"}
    ],
    [
        {"id": 9, "color":  "#E6EC83"},
        {"id": 10, "color": "#DCCDA0"},
        {"id": 11, "color": "#D1AEBE"},
        {"id": 12, "color": "#C78FDB"}
    ],
    [
        {"id": 13, "color": "#FFED96"},
        {"id": 14, "color": "#FBCBAA"},
        {"id": 15, "color": "#F8A9BF"},
        {"id": 16, "color": "#F487D3"}
    ]
];
// =========== /end the constants ================ 



// Durstenfeld shuffle algorithm from 
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array: Array<any>) {
    for (var i = array.length - 1; i >= 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

// MiniView class renders the current square that should be clicked by the user.
class MiniView {
	// consts to change the size/layout of the display
	margin : number = 0; //set the margin around the squares
	padding : number = 2; // padding between buttons and also their width/height
	squareSize : number = 25; // padding between buttons and also their width/height
	width: number = numberOfSquaresWide*(this.squareSize+this.padding) - this.padding + this.margin; // overall view width
	height: number = numberOfSquaresTall*(this.squareSize+this.padding) - this.padding + this.margin; // overall view height

	draw : CanvasRenderingContext2D;
	squares: Array<Array<squareData>>;

	constructor(canvasElement: HTMLCanvasElement, squares:Array<Array<squareData>>) {
		// set up the canvas and get its rendering context
		canvasElement.width = this.width;
		canvasElement.height = this.height;
		this.draw = canvasElement.getContext("2d");

		// load in our data
		this.squares = squares;

		// Format the text labels -- only need to do this once because we never change it.
		this.draw.textBaseline = "middle";
		this.draw.textAlign = "center";
		this.draw.font = "bold 16px sans-serif";

		// and kick us off by drawing a blank one
		this.clear();
	}

	clear() {
		// clear the screen
		this.draw.clearRect(0,0,this.width, this.height);

		// draw 'em all in grey
		for (let i=0; i<this.squares.length; i++) {
			for (let j=0; j<squares[i].length; j++) {
				let x = (j * (this.padding + this.squareSize)) + this.margin;
				let y = (i * (this.padding + this.squareSize)) + this.margin;
				this.draw.fillStyle = "#ccc";
				this.draw.fillRect(x, y, this.squareSize, this.squareSize);
			}
		}
	}

	render(highlightedID: number) {
		// clear the screen
		this.draw.clearRect(0,0,this.width, this.height);

		// draw in the squares -- go through them all
		for (let i=0; i<this.squares.length; i++) {
			for (let j=0; j<squares[i].length; j++) {
				let x = (j * (this.padding + this.squareSize)) + this.margin;
				let y = (i * (this.padding + this.squareSize)) + this.margin;

				// get the id for this square
				let squareID : number = squares[i][j].id;

				// if it's the one that is supposed to be highlighted...
				if (squareID == highlightedID) {
					let squareColor : string = squares[i][j].color;

					// set the fill color to the color of this square
					this.draw.fillStyle = squareColor;
					// and draw it
					this.draw.fillRect(x, y, this.squareSize, this.squareSize);

					// also, add a text label of this square's ID
					this.draw.fillStyle = "#000"; // black, to draw the text
					this.draw.fillText(""+squareID, x+(this.squareSize/2), y+(this.squareSize/2));
				}
				// otherwise, draw an anonymous grey square
				else {
					this.draw.fillStyle = "#ccc";
					this.draw.fillRect(x, y, this.squareSize, this.squareSize);
				}

			}
		}
	}

}

// Trial class makes tasks, assesses whether the task has been fulfilled, records the timing, and (when told to do so) reports the data to the server.
class Trial {
	// configuration: how many tasks per trial? what are the targets?
	numberOfTasks: number;
	squares : Array<Array<squareData>> = squares;

	// record-keeping: are we live? what's the current list of tasks, time-splits, and mistables?
	live: boolean = false;
	tasks : Array<number> = [];
	startTime : number;
	currentTaskNumber : number = 0;
	splits : Array<number> = [];
	wrongClicks : number = 0;
	
	// what team name should this data get recorded as?
	teamName : string;

	// listener events
	events : Partial<Record<judgeEvent, ()=>void>> = {};
	verbose : boolean = false;

	// UI
	realTrialIndicator : HTMLInputElement;
	trialButton : HTMLButtonElement;
	renderer : MiniView;

	constructor(numberOfTasks: number, teamName: string, verbose?: boolean) {
		console.log("%c DHCS S26 Section D Bakeoff 1 Judge v1 ", "color: black; padding:3px; border-radius:3px; font-size: 14px; font-weight: bold; background: linear-gradient(90deg, #B4EA5E 0%, #9CD18D 20%, #84B9BB 30%, #6CA0EA 45%, #9998E2 60%, #C78FDB 80%, #F487D3 100%);");

		if (typeof verbose !== "undefined") this.verbose = verbose;

		this.numberOfTasks = numberOfTasks;
		if (numberOfTasks !== competitionNumberOfTasks) {
			console.warn("Note: numberOfTasks is set to "+numberOfTasks +". (this will need to be changed to "+ competitionNumberOfTasks + " for the actual Bakeoff)");
		}

		this.teamName = teamName;
		if (teamName == "teamName" || typeof teamName == "undefined") {
			console.warn("You must supply a team name (and it shouldn't be 'teamName').")
		}

		this.trialButton = document.getElementById("trialButton") as HTMLButtonElement;
		this.trialButton.onclick = () => {
			this.toggle();
		};

		this.realTrialIndicator = document.getElementById("realTrial") as HTMLInputElement;

		this.renderer = new MiniView(document.getElementById("trial_display") as HTMLCanvasElement, this.squares);

		// default events
		this.addEventListener("testOver", ()=>{ console.log("Test over. Splits:", this.splits, "; wrong clicks: ", this.wrongClicks);});
		this.addEventListener("wrongSquare", ()=>{console.log("Wrong square clicked.");});
		this.addEventListener("correctSquare", ()=>{console.log("Correct square clicked in:", this.splits.slice(-1)[0]);});

		this.reset();
	}

	// what happens when the start/stop button is pressed
	toggle() {
		if (this.live == false) {
			this.start();
		}
		else this.stop();
	}

	// start a new trial
	start() { 
		this.reset();
		this.live = true;
		this.call("start");
		document.body.classList.add("active");
		this.trialButton.innerText = "stop/reset";
		this.renderTask();
	}

	// stop the trial
	stop() { 
		this.live = false;
		this.call("stop");
		document.body.classList.remove("active");
		this.trialButton.innerText = "start trial";
		this.renderer.clear();
	}

	// roll new tasks, and start back at the first one
	reset() { 
		let possibleTasks: Array<number> = [];
		for (let i=1; i<=numberOfSquaresTall*numberOfSquaresWide; i++) {
			possibleTasks.push(i);
		}

		this.tasks = shuffleArray(possibleTasks).slice(0,this.numberOfTasks);

		this.currentTaskNumber = 0;
		this.startTime = Date.now();
		this.splits = [];
	}

	// send the task to the renderer
	renderTask() {
		this.renderer.render(this.tasks[this.currentTaskNumber]);
	}

	// record the time since the last timepoint
	recordSplit() {
		let now = Date.now();
		this.splits.push(now - this.startTime);
		this.startTime = now;
	}

	// send trial data to the scoring server
	postToServer(data : resultData) : void {
		if (this.numberOfTasks !== competitionNumberOfTasks) {
			console.warn("Data is being sent to the server with the wrong numberOfTasks ("+this.numberOfTasks +" instead of "+ competitionNumberOfTasks + ").")
		}
		
		if (this.verbose) console.log("Sending to server:", JSON.stringify(data));

		fetch(reportURL, {
			method: "POST",
			mode: "cors",
			headers: {
				'Accept': 'application/text',
				'Content-Type': "application/json"
			},
			body: JSON.stringify(data)
		})
		.then(response => {
			return response.text();
		})
		.then(text => {
			if (this.verbose) console.log("Received from server:", text);
		})
		.catch((error) => {
			console.error('Server error:', error);
		});
	}

	// move onto the next task (or finish the trial, if we are out of tasks)
	nextTask() : void {
		this.currentTaskNumber++; 
		if (this.currentTaskNumber < this.tasks.length) { // if there's at least one task left
			this.renderTask();
		}
		else { // if we're out of tasks
			this.call("testOver");

			if (this.realTrialIndicator.checked == true) {
				let data : resultData = {splits: this.splits, wrongClicks: this.wrongClicks, teamName: this.teamName};
				this.postToServer(data);
			}

			this.stop();
		}
	}

	// call any registered event listener handlers
	call(eventName: judgeEvent) : void {
		if (this.verbose) console.log("[judge event]: ", eventName);
		if (typeof this.events[eventName] !== "undefined") {
			this.events[eventName]();
		}
	}


// ==================== Public functions =======================================
/* 
	The below three functions are the only ones that should be called from your code.
	JS/TS doesn't really have public vs private functions, so this is on the honor system. :)
*/

/* 
	getSquaresData returns a 2D array (a list of lists) of "squares", where each square is an object like this:
	{
		id: 1, // a numerical id -- this is how you should identify this square when it is clicked (and you may want to display the number on the square, too)
		color: "#11eaea" // a string corresponding to a color (hex rgb). This is the color that the trial engine will display this square as, so you may want to use it, too.
	}
	The position in the nested array indicates where this square is in the the trial's task indicator grid (and you probably want to put it in the same place in yours). The outer array is rows (bottom to top) and each inner one is a square (left to right).
*/
	getSquaresData(): Array<Array<squareData>> {
		return this.squares;
	}

/*
	submitClick is how you tell the system that a square has been clicked on. The index should be the numerical ID that was associated with this square in the squares data you got from getSquaresData.
*/
	submitClick(index:number) { 
		if (this.verbose) console.log("Submitted:", index);
		// check whether this click is the right one
		if (typeof this.tasks[this.currentTaskNumber] !== "undefined" && index == this.tasks[this.currentTaskNumber]) { //lea sort this!
			// if so, record that split
			this.recordSplit();
			// let them know it was right
			this.call("correctSquare");
			// and move on
			this.nextTask();
		}
		else {
			// otherwise, add it to the wrongClicks tally
			this.wrongClicks++;
			// and let them know it was wrong
			this.call("wrongSquare");
		}
	}

/*
	Just like in the HTML DOM: use "addEventListener" to add a new listener for any of the judgeEvents. The available events are:
	"newTask" // a new task has begun
	"start" // a new trial has started
	"testOver" // we are out of tasks for this trial
	"wrongSquare" // the wrong square was clicked
	"correctSquare" // the right square was clicked
	"stop"; // the trial has been stopped (e.g. with the stop button)
*/
	addEventListener(eventName: judgeEvent, callback: ()=>void) : void {
		this.events[eventName] = callback;
	}


}
