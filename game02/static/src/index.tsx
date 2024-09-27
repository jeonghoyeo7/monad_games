import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'jotai'; // Provider를 추가합니다.

import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <Provider>
      {" "}
      {/* Provider로 전체 애플리케이션을 감쌉니다. */}
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root"),
);
