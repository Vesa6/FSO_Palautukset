import React, { useState } from 'react';

const StatisticsLine = (props) => {
    return (
      <tr>
      <td>{props.text}</td> 
      <td>{props.value}</td>
      </tr>
    )
  }

const Statistics = (props) => {

  const { good, neutral, bad } = props;
  //const good = props.good;
  //const neutral = props.neutral;
  //const bad = props.bad;

  const positive = () => {
    return (good / (good + neutral + bad)) * 100 + " %";
  }

  const average = () => {
    return (good - bad) / (good + neutral + bad); //Neutral doesn't affect the average.
  }

    if (good !== 0 || neutral !== 0 || bad !== 0) {
      
  return (
    <table>
      <tbody>
      <StatisticsLine text="good" value={props.good} />
      <StatisticsLine text="neutral" value={props.neutral} />
      <StatisticsLine text="bad" value={props.bad} />
      <StatisticsLine text="all" value={props.good + props.neutral + props.bad} />
      <StatisticsLine text="average" value={average()} />
      <StatisticsLine text="positive" value={positive()} />
      </tbody>
    </table>
  );

  } else {
    return <div>
      <p>No feedback given</p>
    </div>
  }

}


const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleGoodClick = () => {
    setGood(good + 1);
  };

  const handleNeutralClick = () => {
    setNeutral(neutral + 1);
  };

  const handleBadClick = () => {
    setBad(bad + 1);
  };

  const average = () => {
    return (good - bad) / (good + neutral + bad); //Neutral doesn't affect the average.
  }

  const positive = () => {
    return (good / (good + neutral + bad)) * 100;
  }
  return (<div>
    <h1>give feedback</h1>
    <button onClick={handleGoodClick}>Good</button>
    <button onClick={handleNeutralClick}>Neutral</button>
    <button onClick={handleBadClick}>Bad</button>
    <div>
      <h2>statistics</h2>
    <Statistics good={good} neutral={neutral} bad={bad} />
    </div>


  </div>)


}

export default App;
