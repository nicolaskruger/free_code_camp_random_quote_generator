import React from 'react';
import * as ReactRedux from 'react-redux';
import * as Redux from 'redux';
import ReactDOM from 'react-dom';
import ReduxThunk from 'redux-thunk';
import './index.css';

const {Provider, connect} = ReactRedux;
const {applyMiddleware, createStore} = Redux;

const NEXT_MSG = "NEXT_MSG";
const GET_MSG = "GET_MSG";

/**
 * 
 * @param {number} len 
 */
const nextMsg = (len) => {
  const val = Number.parseInt(Math.random()*len);
  return {
    type: NEXT_MSG,
    currIndex: val
  }
}



const getMsg = () => (dispatch) => {
    fetch('https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json')
    .then(v => v.json())
    .then(v=>{
      dispatch({
        type: GET_MSG,
        quotes: v.quotes
      })
    })
}

const initial_state = {
  currIndex: 0,
  quotes: [{
    quote: '',
    author: ''
  }]
}
/**
 * 
 * @param {{currIndex:number,quotes:{quote:string,author:string}[]}} state 
 * @param {{type:string,currIndex:number,quotes:{quote:string,author:string}[]}} action
 * 
 * @returns {{currIndex:number,quotes:{quote:string,author:string}[]}} 
 */
const reducerQuotes = (state = initial_state, action) => {
  switch (action.type) {
    case NEXT_MSG:
      return {
        ...state,
        currIndex: action.currIndex,
      }
    case GET_MSG:
      return {
        ...state,
        quotes: action.quotes
      }
  
    default:
      return state;
  }
}

const store = createStore(reducerQuotes, applyMiddleware(ReduxThunk));
store.dispatch(getMsg());
setTimeout(()=>{store.dispatch(nextMsg(store.getState().quotes.length))},100)

/**
 * 
 * @param {{
 * currIndex:number,
 * quotes:{quote:string,author:string}[],
 * next:(number)=>void,
 * get:()=>void
 * }} Props 
 * @returns 
 */
let App = ({currIndex,quotes,next,get}) => {
  const quote = quotes[currIndex].quote;
  const author = quotes[currIndex].author;
  return (
    <section id="quote-box">
      <h1 id="text">
         " {quote} "
      </h1>
      <h2 id="author">
        -- {author}
      </h2>
      <div className="quote-div">
        <button id="new-quote" onClick={()=>next(quotes.length)}>
          new quote
        </button>
        <a 
          id= "tweet-quote"
          target="_blank"
          href={'https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=' +
          encodeURIComponent('"' + quote + '" ' + author)}
          >
          tweet
        </a>

      </div>
    </section>
  )
}

/**
 * 
 * @param {{currIndex:number,quotes:{quote:string,author:string}[]}} state 
 * @returns 
 */
const mapStateToProps = (state) => {
  return { ...state}
}

const mapDispatchToProps = (dispatch) => {
  return {
    next: (len) => {
      dispatch(nextMsg(len))
    },
    get: () => {
      dispatch(getMsg())
    }
  }
}


App = connect(mapStateToProps,mapDispatchToProps)(App);

ReactDOM.render(
  <React.StrictMode>
    <section className="app__display">
      
      <Provider store={store}>
        <App/>
      </Provider>

    </section>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA