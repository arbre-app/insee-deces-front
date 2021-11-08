import React from 'react';
import ReactDOM from 'react-dom';
import { Helmet } from 'react-helmet';
import { App } from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

ReactDOM.render(
  //<React.StrictMode>
  <App locale="fr" legacyUrl="#" headerCmp={() => <></>} helmetCmp={({ children }) => <Helmet>{children}</Helmet>} />,
  //</React.StrictMode>,
  document.getElementById('root'),
);
