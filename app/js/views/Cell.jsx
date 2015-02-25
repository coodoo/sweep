var actions = require('../actions/AppActionCreator');
var classSet = React.addons.classSet;

/**
 * 
 */
var Comp = React.createClass({

  componentDidMount: function() {
      this.$node = $(this.getDOMNode())
      this.$btnClose = this.$node.find('.listItem-removeBtn');
  },

  /**
   * 
   */
  render: function() {
    
      var t = this.props.truth;
      
      var item;

      var classes = classSet({
          bomb: t.isBomb && t.isClicked,
          clicked: t.isClicked,
          unclicked: !t.isClicked,
          flagged: t.isFlagged,
          debug: t.isBomb
      });

      if( t.isClicked ){
          var num = t.bombCount == 0 ? '' : t.bombCount;
          item = (
            <td className={classes}>
              {t.isBomb ? <img src="assets/images/bomb.png" /> : num }
            </td>
          )
      
      }else if( t.isFlagged ){
          item = (
            <td className={classes} 
                onContextMenu={this.handleRightClick}>
              <img src="assets/images/flag.png" />
            </td>
          )
      
      }else{
          item = (
            <td className={classes}
              onClick={this.handleClick} 
              onContextMenu={this.handleRightClick}>
            </td>  
          )
      }

      return item;
  
  },

  //
  handleClick: function(evt){
      // console.log( 'click' );
      this.props.onClick(this.props.truth);
  },

  //
  handleRightClick: function(evt){
      // console.log( 'right click' );
      evt.preventDefault();
      this.props.onRightClick(this.props.truth);
  },

  //
  noop: function(){
  }

});


module.exports = Comp;