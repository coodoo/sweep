var actions = require('../actions/AppActionCreator');
var Cell = require('./Cell.jsx');

//
var Comp = React.createClass({

  render: function() {
    
    var t = this.props.truth;
    var rows = t.rows;
    var totalBombs = t.totalBombs;
    
    //
    var items = rows.map(function(row){
        return (
          <tr>
            {row.map(function(cell){
              return <Cell truth={cell} 
                           onClick={this.handleClick} 
                           onRightClick={this.handleRightClick} />
            }.bind(this))}
          </tr>  
        )
    }.bind(this))

    return (
      <table className="boardBox">
        <tbody>
          {items}
        </tbody>
      </table>
    );
  
  },

  //
  handleClick: function(cell){

      // avoid bombing on first click
      if( cell.isBomb && this.props.truth.isNewGame ){
          actions.avoidInitialBomb(cell);
      }else{
          actions.openCell(cell);
      }
  },

  //
  handleRightClick: function(cell){
      actions.flagCell(cell);
  },

  //
  noop: function(){
  }

});

module.exports = Comp;