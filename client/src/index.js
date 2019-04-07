import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// import drizzle functions and contract artifact
import { Drizzle, generateStore } from "drizzle";
// import { DrizzleContext } from 'drizzle-react';
import Reversi from "./contracts/Reversi.json";
const options = { contracts: [Reversi] };
const drizzleStore = generateStore(options);
const drizzle = new Drizzle(options, drizzleStore)



ReactDOM.render(<App drizzle={drizzle} />, document.getElementById('root'));
