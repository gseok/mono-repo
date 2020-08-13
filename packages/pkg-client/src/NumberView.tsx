import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../shared/reducers/reducers';

const NumberDisplay = () => {
  const number1 = useSelector((state: RootState) => state.Sample1Reducer.number);

  return (
    <>
      <h5>Number Display...</h5>
      <div>{number1}</div>
    </>
  );
};

export default NumberDisplay;
