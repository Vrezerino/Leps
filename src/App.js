import ladybug from './ladybug.png';
import './App.css';
import './timer.css';
import { useState } from 'react';
const scream = require('./utils/scream').sound
const pop = require('./utils/pop').sound

const App = () => {
	const winWidth = window.innerWidth;
	const winHeight = window.innerHeight;

	const getRandomPos = (min, max) => {
		return Math.random() * (max - min - 50) + min;
	}

	const [randomTop, setRandomTop] = useState(getRandomPos(0, winHeight));
	const [randomLeft, setRandomLeft] = useState(getRandomPos(0, winWidth));
	const [fail, setFail] = useState(false); // Set to true when user fails to press/click on the ladybug in a given time.
	const [time, setTime] = useState(3100); // 3.1 seconds is the initial time.
	const [score, setScore] = useState(0); // Successful consecutive presses on the ladybug.
	const [timer, setTimer] = useState(null); // Stored in state so it can be cleared.

	const timeout = () => {
		//console.log(time);
		setTimer(setTimeout(() => {
			setFail(true);
		}, time));
	}

	const clicked = () => {
		pop.play();
		setScore(score + 1);
		clearTimeout(timer);
		setRandomTop(getRandomPos(0, winHeight));
		setRandomLeft(getRandomPos(0, winWidth));

		// After each click, user has less time to press on the ladybug, increasing difficulty.
		if (time > 1000) {
			setTime(time - 100)
		} else {
			setTime(time - 50)
		}
		timeout(); // Set new timer with shorter timeout duration.
	}

	const newTry = () => {
		setFail(false);
		setScore(0);
		setTime(3100);
	}

	if (!fail) {
		return (
			<div className='App'>
				{score > 0 && <div className='timeDisplay'>Time: {time / 1000} sec</div>}
				<div className='ladybugContainer'
					onClick={clicked}
					style={{ top: randomTop, left: randomLeft }}>
					<img src={ladybug}
						draggable='false'
						className='ladybug'
						alt='ladybug'
						width='30px'
						style={{ animation: `spin ${time / 3100}s linear infinite` }} />
				</div>
			</div>
		)
	} else {
		scream.play()
		return (
			<div>
				<h1>FAIL</h1>
				<h2>Score: {score}</h2>
				{time < 300 && <h2>Also, you are insanely fast.</h2>}
				<img src={ladybug}
					draggable='false'
					className='ladybugBig'
					alt='ladybug'
					width='80%'
					onClick={() => newTry()} />
			</div>);
	}
}

export default App;
