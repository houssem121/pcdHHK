import React from 'react';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client'; // Changed from 'react-dom' to 'react-dom/client'

// Create a root container instance
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render your app within the context of BrowserRouter
root.render(
    
        <BrowserRouter>
            <App />
        </BrowserRouter>
    
);

// Unregister the service worker
serviceWorker.unregister();

/*import React from 'react';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import ReactDOM from 'react-dom';
const root = ReactDOM;
// Row Data Interface in react 

root.render(
    
    <BrowserRouter>
    <App />
    </BrowserRouter>


, document.getElementById('root'));


serviceWorker.unregister();

*/
 