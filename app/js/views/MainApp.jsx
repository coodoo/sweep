
// var React = require('react');
var Board = require('./Board.jsx');
var Timer = require('./Timer.jsx');
var GameStore = require('../stores/GameStore');
var AppConstants = require('../constants/AppConstants');
var actions = require('../actions/AppActionCreator');
var classSet = React.addons.classSet;

var MainApp = React.createClass({

    getInitialState: function() {
        var o = this.getTruth(); 
        return o;
    },

    componentWillMount: function() {
        GameStore.addListener( AppConstants.CHANGE_EVENT, this._onChange );
    },


    componentDidMount: function() {
    },  

    //========================================================================
    //
    // unmount

    componentWillUnmount: function() {
        GameStore.removeChangeListener( this._onChange );
    },

    componentDidUnmount: function() {
        //
    },

    //========================================================================
    //
    // update

    componentWillReceiveProps: function(nextProps) {
        //
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        return true;
    },

    componentWillUpdate: function(nextProps, nextState) {
    },

    componentDidUpdate: function(prevProps, prevState) {
    },

    //========================================================================
    //
    // render

    render: function() {

        var isRunning = this.state.gameLose == false && this.state.gameWon == false;

        var gameStatus = classSet({
            gameLose: this.state.gameLose == true,
            gameWon: this.state.gameWon == true,
            gameRunning: isRunning,
            resetButton: true
        })
        return (

            <div className="mainBox">
                
                <div className="headerBox">
                    <span id="numBombs">{this.state.totalBombs}</span>
                    <div className="controls">
                        <span className="sizeButton" onClick={this.handleSizeChange.bind(this, false)}>–</span>
                        <span className={gameStatus} onClick={this.handleReset}>Reset</span>
                        <span className="sizeButton" onClick={this.handleSizeChange.bind(this, true)}>＋</span>
                    </div>
                    <Timer enabled={isRunning} isNewGame={this.state.isNewGame} />
                </div>

                <Board truth={this.state} />

            </div>
        )
        
    },

    handleReset: function(){
        actions.resetGame( null );
    },

    handleSizeChange: function(bigger){
        actions.resetGame( bigger ? 'bigger' : 'smaller');
    },

    //
    _onChange: function(){
        this.setState( this.getTruth() );
    },

    //
    getTruth: function() {
        return GameStore.getAll();
    }



});

module.exports = MainApp;
