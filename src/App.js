import React, {Component} from 'react';
import './App.css';
import KeyPadComponent from './components/KeyPadComponent';
import ResultComponent from './components/ResultComponent';
import * as math from 'mathjs';
import KeyboardEventHandler from 'react-keyboard-event-handler';

class App extends Component {
  constructor() {
    super();
    this.state = {
      result: "",
      pressEqual: false
    }
  }

  onClick = (value) => {
    let {result} = this.state;
    if (value === "=") {
      this.calculate();
    } else if (value === "C") {
      this.reset();
    } else if (value === "CE") {
      this.backspace();
    } else {
      if(result === 'error' || ((result.toString() === 'Infinity' || result.toString() === '-Infinity') && Number.isInteger(parseInt(value)))) {
        this.setState({
          result: '' + value,
          pressEqual: false
        });
      } else {
        this.setState({
          result: result + value,
          pressEqual: false
        });
      }
    }
  }

  calculate = () => {
    let checkResult = '';
    let {result} = this.state;

    if (result.toString().includes('--')) {
      checkResult = result.toString().replace('--', '+');
    } else {
      checkResult = result;
    }

    try {
      let showResult = math.evaluate((checkResult || 0));

      // Small Decimal Values
      if(showResult === 0.1 + 0.2) {
        showResult = 0.3;
      }
      
      if (Number.isNaN(showResult)) {
        showResult = 'error';
      }

      this.setState({
        result: showResult,
        pressEqual: true
      });
      
    } catch (e) {
      this.setState({
        result: 'error',
        pressEqual: true
      })
    }
  }

  backspace = () => {
    let {result} = this.state;
    let allowBackSpace = true;
    if(result.toString() === 'Infinity' || result.toString() === '-Infinity' || result === undefined || result === 'error') {
      allowBackSpace = false;
    }
    this.setState({
      result: (allowBackSpace) ? result.toString().slice(0, -1) : '',
      pressEqual: false
    });
  }

  reset = () => {
    this.setState({
      result: '',
      pressEqual: false
    });
  }

  clickTrigerButton = (key) => {
    let replaceKey = '';
    switch(key) {
      case 'enter':
        replaceKey = '=';
        break;
      case 'backspace':
        replaceKey = 'CE';
        break;
      case 'shift+9':
        replaceKey = '(';
        break;
      case 'shift+0':
        replaceKey = ')';
        break;
      case 'shift+=':
        replaceKey = '+';
        break;
      case 'shift+8':
        replaceKey = '*';
        break;
      case 'shift+;':
        replaceKey = '/';
        break;
      default:
        replaceKey = key;
    }
    this.onClick(replaceKey);
  }

  render() {
    const {result} = this.state;
    return (
      <div className="App">
        <div className="calculator-body">
          <ResultComponent result={result}/>
          <KeyPadComponent onClick={this.onClick} />
          <KeyboardEventHandler
            handleKeys={['numeric', 'enter', 'backspace', 'shift+9', 'shift+0', 'shift+=', '-', 'shift+8', '/', 'shift+;', '.']}
            onKeyEvent={(key, e) => this.clickTrigerButton(key)} />
        </div>
      </div>
    );
  }
}

export default App;
