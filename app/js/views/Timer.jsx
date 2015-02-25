var actions = require('../actions/AppActionCreator');

var timer = 0;
var timerId;

/**
 * 
 */
var Header = React.createClass({

  getInitialState: function(){
    return{ timer: 0};
  },

  //
  componentDidMount: function() {
  },

  componentWillReceiveProps: function( nextProps, nextState ){
    
      // console.log( 'timer: ', nextProps );

      if(nextProps.enabled){
          if(!timerId){
            timerId = setInterval( function(){
                        this.setState({timer: timer++});
                      }.bind(this), 1000)
          }
      }else{
          clearInterval(timerId);
          timerId = null;
      }

      if( nextProps.isNewGame ){
          timer = 0;
          this.setState({timer: timer});
      }
  },

  //
  render: function() {

    return (
      <span>{this.state.timer}</span>
    );
  
  },

  //
  handleKeyDown: function(evt){
      if(evt.keyCode == 13){
          this.doSearch();
      }
  },

  handleSubmit: function(evt){
      this.doSearch();
  },

  doSearch: function(){
      actions.loadItem( this.$input.val() );
      this.$input.val('');
  },

  // todo
  handleShowTotal: function(evt){
      actions.countTotal();
  },

  //
  noop: function(){
  }

});

module.exports = Header;