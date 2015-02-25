var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var GameStore = require('../stores/GameStore');

var AppActionCreators = {

    //
    openCell: function( cell ){
        AppDispatcher.handleViewAction({
            actionType: AppConstants.CELL_OPEN,
            cell: cell
        });
    },

    flagCell: function( cell ){
        AppDispatcher.handleViewAction({
            actionType: AppConstants.CELL_FLAG,
            cell: cell
        });
    },

    resetGame: function( size ){
        AppDispatcher.handleViewAction({
            actionType: AppConstants.GAME_RESET,
            size: size
        });
    },

    avoidInitialBomb: function( cell ){
        AppDispatcher.handleViewAction({
            actionType: AppConstants.GAME_AVOID,
            cell: cell
        });
    },

    // dummy
    noop: function(){}
};


module.exports = AppActionCreators;
