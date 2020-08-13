import React from 'react';
import ReactDOM from 'react-dom';
import { loadableReady } from '@loadable/component';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import appReducer from '../../shared/reducers/reducers';

import App from './App';

loadableReady(() => {
  const store = createStore(appReducer, {
    Sample1Reducer: {
      number: 100
    }
  });
  const root = document.getElementById('root');
  ReactDOM.hydrate(
    <Provider store={store}>
      <App />
    </Provider>,
    root
  );
});
