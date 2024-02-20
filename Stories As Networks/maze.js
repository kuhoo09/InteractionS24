var numberOfCells = 0;
var visitedCells = 0;

class Wall {
  constructor(options = {}) {
    this.leftCell = options.leftCell || null;
    this.rightCell = options.rightCell || null;
    this.topCell = options.topCell || null;
    this.bottomCell = options.bottomCell || null;
    this.demolished = false;
  }
  
  demolish() {
    this.demolished = true;
  }
  
}

class Cell {
  constructor(options = {}) {
    this.leftWall = options.leftWall || null;
    this.rightWall = options.rightWall || null;
    this.topWall = options.topWall || null;
    this.bottomWall = options.bottomWall || null;
    this.visited = false;
    numberOfCells++;
  }
  
  visit() {
    this.visited = true;
    visitedCells++;
  }
  
  hasUnvisitedNeighbours () {
    if (this.leftWall && this.leftWall.leftCell && !this.leftWall.leftCell.visited) return true;
    if (this.rightWall && this.rightWall.rightCell && !this.rightWall.rightCell.visited) return true;
    if (this.topWall && this.topWall.topCell && !this.topWall.topCell.visited) return true;
    if (this.bottomWall && this.bottomWall.bottomCell && !this.bottomWall.bottomCell.visited) return true;
    return false;
  }
  
  getUnvisitedNeighbours () {
    let result = [];
    if (this.leftWall && this.leftWall.leftCell && !this.leftWall.leftCell.visited) {
      result.push({cell: this.leftWall.leftCell, wall: this.leftWall});
    }
    if (this.rightWall && this.rightWall.rightCell && !this.rightWall.rightCell.visited) {
      result.push({cell: this.rightWall.rightCell, wall: this.rightWall});
    }
    if (this.topWall && this.topWall.topCell && !this.topWall.topCell.visited) {
      result.push({cell: this.topWall.topCell, wall: this.topWall});
    }
    if (this.bottomWall && this.bottomWall.bottomCell && !this.bottomWall.bottomCell.visited) {
        result.push({cell: this.bottomWall.bottomCell, wall: this.bottomWall});
    }
    return result;
  }
  
  getRandomUnvisitedNeighbour () {
    let unvisitedNeighbours = this.getUnvisitedNeighbours()
    return unvisitedNeighbours[Math.floor(Math.random()*unvisitedNeighbours.length)]
  }
}

var cellMatrix = [];

function initMaze(horizontalCells, verticalCells) {
  
  // build cells
  for (let i = 0; i < verticalCells; i++) {
    cellMatrix[i] = [];
    for (let j = 0; j < horizontalCells; j++) {
        cellMatrix[i][j] = new Cell();
    } 
  }
  
  //build horizontal walls
  for (let i = 0; i < verticalCells; i++) {
    for (let j = 0; j < (horizontalCells - 1); j++) {
      let wall = new Wall();
      wall.leftCell = cellMatrix[i][j];
      wall.rightCell = cellMatrix[i][j + 1];
      cellMatrix[i][j].rightWall = wall;
      cellMatrix[i][j + 1].leftWall = wall;
      
      if (j === 0) {
        cellMatrix[i][j].leftWall = new Wall();
        cellMatrix[i][j].leftWall.rightCell = cellMatrix[i][j]; 
      }
      
      if (i === verticalCells - 1) {
        cellMatrix[i][j].bottomWall = new Wall();
        cellMatrix[i][j].bottomWall.topCell = cellMatrix[i][j];
      }
      
    }
    // let wall = new Wall();
    // wall.leftCell = cellMatrix[i][horizontalCells - 1];
    // cellMatrix[i][horizontalCells - 1].rightWall = null; 
  }
  
  // build vertical walls
  for (let i = 0; i < (verticalCells - 1); i++) {
    for (let j = 0; j < horizontalCells; j++) {
      let wall = new Wall();
      wall.topCell = cellMatrix[i][j];
      wall.bottomCell = cellMatrix[i + 1][j];
      cellMatrix[i][j].bottomWall = wall;
      cellMatrix[i + 1][j].topWall = wall;
      
      if (i === 0) {
        cellMatrix[i][j].topWall = new Wall();
        cellMatrix[i][j].topWall.bottomCell = cellMatrix[i][j];
        if (j === 0) cellMatrix[i][j].topWall.demolish();
      }
      
      if (j === horizontalCells - 1) {
        cellMatrix[i][j].rightWall = new Wall();
        cellMatrix[i][j].rightWall.leftCell = cellMatrix[i][j];
      }
      
    } 
  }
  
}

function generateMaze(startingCell) {
  const cellStack = [];
  let currentCell = startingCell;
  let neighbour = null;
  startingCell.visit();
  
  for (let i = 0; visitedCells <= numberOfCells; i++) {
    if (i > 10000) break;
    if (currentCell.hasUnvisitedNeighbours()) {
      neighbour = currentCell.getRandomUnvisitedNeighbour();
      cellStack.push(currentCell);
      neighbour.wall.demolish();
      currentCell = neighbour.cell;
      currentCell.visit();
    } else {
      if (cellStack.length) currentCell = cellStack.pop();  
    }
  }
}

function renderWithCssBorder(BOX_WIDTH, BOX_HEIGHT, cellMatrix, htmlParent) {
  // let box = document.createElement("div");
  // const BOX_WIDTH = 10
  // const BOX_HEIGHT = 10
  const BORDER_SIZE = 1
  
  htmlParent.style.display = 'block'
  htmlParent.style.position = 'relative'
  // htmlParent.style.width = (BOX_WIDTH + BORDER_SIZE) * cellMatrix.length + "px"
  // htmlParent.style.height = (BOX_HEIGHT + BORDER_SIZE) * cellMatrix[0].length + "px"
  
  for (let i = 0; i < cellMatrix.length; i++) {
    for (let j = 0; j < cellMatrix[i].length; j++) {
      let box = document.createElement("div");
      box.style.position = 'absolute'
      box.style.top = (BOX_HEIGHT * i) + "px"
      box.style.left = (BOX_WIDTH * j) + "px"
      box.style.display = 'block'
      box.style.width = BOX_WIDTH + "px"
      box.style.height = BOX_HEIGHT + "px"
      // box.style.boxSizing = "border-box"
      // box.style.border = "2px solid red"
      
      const EMPTY_WALL = BORDER_SIZE + "px solid transparent"
      const SOLID_WALL = BORDER_SIZE + "px solid red"
      
      if (cellMatrix[i][j].leftWall) box.style.borderLeft = cellMatrix[i][j].leftWall.demolished ? EMPTY_WALL : SOLID_WALL;
      if (cellMatrix[i][j].rightWall) box.style.borderRight = cellMatrix[i][j].rightWall.demolished ? EMPTY_WALL : SOLID_WALL;
      if (cellMatrix[i][j].topWall) box.style.borderTop = cellMatrix[i][j].topWall.demolished ? EMPTY_WALL : SOLID_WALL;
      if (cellMatrix[i][j].bottomWall) box.style.borderBottom = cellMatrix[i][j].bottomWall.demolished ? EMPTY_WALL : SOLID_WALL;

      
      htmlParent.appendChild(box);
    }
    
  }
  
}

//initMaze(40, 40);
//generateMaze(cellMatrix[0][0]);
//renderWithCssBorder(cellMatrix, document.getElementById("maze"));

const domElement = document.getElementById("maze");

function generateAndPrint(horizontalCells, verticalCells, boxWidth, boxHeight) {
  numberOfCells = 0;
  visitedCells = 0;
  cellMatrix = [];
  
  initMaze(horizontalCells, verticalCells);
  generateMaze(cellMatrix[0][0]);
  domElement.innerHTML = "";
  renderWithCssBorder(boxWidth, boxHeight, cellMatrix, domElement);
}

document.forms[0].addEventListener('submit', function(event){
  event.preventDefault();
  let cellHeight = event.target.elements['cell-height'].value;
  let cellWidth  = event.target.elements['cell-width'].value;
  let horizontalCells = event.target.elements['horizontal-cells'].value;
  let verticalCells = event.target.elements['vertical-cells'].value;
  generateAndPrint(horizontalCells, verticalCells, cellWidth, cellHeight);
})

generateAndPrint(40, 40, 10, 10);