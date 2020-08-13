import { combineReducers } from 'redux';
import Sample1Reducer from './Sample1.reducer';

export interface RootState {
  Sample1Reducer: ReturnType<typeof Sample1Reducer>;
}

const appReducer = combineReducers({
  Sample1Reducer,
});

export default appReducer;
