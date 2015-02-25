//========================================================================
//
// IMPORT

var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var actions = require('../actions/AppActionCreator');

var objectAssign = require('object-assign');
var EventEmitter = require('events').EventEmitter; // 取得一個 pub/sub 廣播器

//========================================================================
//
// event handlers

var Store = {};
objectAssign( Store, EventEmitter.prototype, {

    getAll: function(){
        return {
            rows: arrRows || createRows(),
            totalBombs: totalBombs,
            gameLose: gameLose,
            gameWon: this.isWon(),
            isNewGame: isNewGame
        }
    },

    isWon: function(){
        var failed = [], arr;
        arrRows.forEach(function(row){
            arr = row.filter(function(cell){
                return (cell.isBomb && cell.isClicked) || (!cell.isBomb && !cell.isClicked);
            })
            failed = failed.concat(arr);
        })
        return failed.length == 0;
    },

    //
    noop: function(){}
});

//
Store.dispatchToken = AppDispatcher.register( function eventHandlers(evt){

    var action = evt.action;

    switch (action.actionType) {
        
        // persist new size and trigger redraw
        case AppConstants.SIZE_CHANGE:

            size = action.size;
            createRows();
            Store.emit( AppConstants.CHANGE_EVENT );
            break;

        //    
        case AppConstants.CELL_OPEN:

            var cell = action.cell;

            cell.isClicked = true;
            
            if( cell.isBomb ){
                gameLose = true;
            }

            //
            if( cell.bombCount == 0)
                clickNeighbors( arrRows, cell );

            isNewGame = false;

            //
            Store.emit( AppConstants.CHANGE_EVENT );

            break;

        case AppConstants.CELL_FLAG:

            var cell = action.cell;


            cell.isFlagged = !cell.isFlagged;

            totalBombs += (cell.isFlagged ? -1 : 1);

            isNewGame = false;

            Store.emit( AppConstants.CHANGE_EVENT );

            break;

        case AppConstants.GAME_RESET:

            var s = action.size;

            if( s != null ){
                size += ( s == 'bigger' ? 1 : -1) 
            }

            // minimum size is 3
            size = Math.max(3, size);

            resetGame();

            Store.emit( AppConstants.CHANGE_EVENT );

            break;

        // avoid bomb when first clicked
        // solution: shuffle the bombs on the fly
        case AppConstants.GAME_AVOID:

            var pos = action.cell.info;
            
            // reset
            resetGame();

            var rows;
            var ok = false;
            var newCell;

            while(!ok){
                rows = createRows();
                newCell = rows[pos.row][pos.col];
                ok = rows[pos.row][pos.col].isBomb == false;
            }

            Store.emit( AppConstants.CHANGE_EVENT );

            setTimeout(function(){
                var actions = require('../actions/AppActionCreator');
                actions.openCell(rows[pos.row][pos.col]);
            }.bind(this), 90)

            break;


        default:
            //
    }

})

//========================================================================
//
// Public API

// generated rows
var arrRows;

// number of cells per row
var size = 8;

// how difficult the game is, the higher the harder
var level = 0.3;

// number of bombs
var totalBombs = 0;

var gameWon = false;
var gameLose = false;
var isNewGame = true;

function resetGame(){
    arrRows = null;
    totalBombs = 0;
    gameWon = gameLose = false;
    isNewGame = true;
}

//
function createRows(){
    arrRows = [];
    for(var i=0; i<size; i++){
      arrRows.push( createCells( size, i ) );
    }

    while(totalBombs==0){
        resetGame();
        createRows();
    }
    
    updateBombCount(arrRows);

    return arrRows;
}

//
function createCells( numOfCells, idxRow ){
  
  var cells = [];
  
  for(var i=0; i<numOfCells; i++){
      var isBomb = Math.random() < level;
      if( isBomb ) totalBombs++;
      cells.push({
          bombCount: 0,  
          isBomb: isBomb,
          isClicked: false,
          isFlagged: false,
          info: {row: idxRow, col: i}
      })
  }

  return cells;

}

function updateBombCount( rows ){
    rows.forEach(function(row){
        row.forEach(function(cell){
            var neighbors = findNeighbors(rows, cell.info.row, cell.info.col);
            var count = neighbors.reduce( function( sum, item){
                // console.log( 'isBomb: ', rows[item.row][item.col].isBomb );
                return sum + (rows[item.row][item.col].isBomb ? 1 : 0);
            }, 0);

            // console.log( '\ncnt: ', count );
            cell.bombCount = count;
        })
    })
}

// the spot, not cell itself
function findNeighbors(rows, i, j) {
    var arrNeighbors = [
    {row: i-1, col: j-1},
    {row: i-1, col: j},
    {row: i-1, col: j+1},
    {row: i, col: j-1},
    {row: i, col: j},
    {row: i, col: j+1},
    {row: i+1, col: j-1},
    {row: i+1, col: j},
    {row: i+1, col: j+1}
  ];

  return arrNeighbors.filter(function(item, idx){
    return !(item.row < 0 || item.row >= rows.length ||
             item.col < 0 || item.col >= rows.length)
  })
}

//
function clickNeighbors( rows, targetCell ) {
  var me = this;
  
  var spots = findNeighbors(rows, targetCell.info.row, targetCell.info.col);
  
  var cells = spots.map( function(spot) {
    return rows[spot.row][spot.col];
  });
  
  //
  cells.forEach( function(cell) {
  
    if (cell != targetCell &&
        !cell.isClicked &&
        !cell.isBomb /*&&
        cell.bombCount == 0*/) {

            cell.isClicked = true;
            cell.isFlagged = false;
            
            if(cell.bombCount == 0)
                clickNeighbors(rows, cell);
    }
  
  }.bind(this))
}

module.exports = Store;
