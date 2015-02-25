var MainApp = require('./views/MainApp.jsx');
var actions = require('./actions/AppActionCreator');

$(function(){
	React.render( MainApp(), document.getElementById('container') );
})
