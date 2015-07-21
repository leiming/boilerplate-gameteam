"use strict";

var React = require('react')

var HelloMessage = React.createClass({
  render: function () {
    return <div>Hello {this.props.name}!</div>;
  }
})
React.render(<HelloMessage name="John"/>, document.getElementById('ele-react-es5'))



class Hello extends React.Component {
  render() {
    return <div>Hello, {this.props.name}!</div>
  }
}

React.render(<Hello name="Harmony"/>, document.getElementById('ele-react-es6'))
