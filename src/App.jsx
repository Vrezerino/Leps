import ladybug from './ladybug.png';
import './App.css';
import './PieTimer.css';
import { useState } from 'react';
//const scream = require('./utils/scream').sound
const pop = require('./utils/pop').sound

const App = () => {
	const winWidth = window.innerWidth;
	const winHeight = window.innerHeight;

	const getRandomPos = (min, max) => Math.random() * (max - min - 50) + min;

	const [randomTop, setRandomTop] = useState(getRandomPos(0, winHeight));
	const [randomLeft, setRandomLeft] = useState(getRandomPos(0, winWidth));
	const [fail, setFail] = useState(false); // Set to true when user fails to press/click on the ladybug in a given time.
	const [time, setTime] = useState(3100);
	const [score, setScore] = useState(0); // Successful consecutive presses on the ladybug.
	const [timer, setTimer] = useState(null); // Stored in state so it can be cleared.

	const timeout = () => {
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
		time > 1500 ? setTime(time - 100) : setTime(time - 50);
		timeout(); // Set new timer with shorter timeout duration.
	}

	const newTry = () => {
		setFail(false);
		setScore(0);
		setTime(3100);
	}

	const ladyBugImage = (className, style, onClick) => <img src={ladybug} draggable='false' className={className} alt='ladybug' style={style} onClick={onClick} />;

	if (!fail) {
		let sheets = document.styleSheets;
		const selector = '.pie::after';

		// Update pie chart timer animation duration.
		for (let sheet of sheets) {
			for (let rule of sheet.cssRules) {
				if (rule.selectorText === selector) {
					rule.style['animation'] = `pieAniAfter ${time / 1000}s linear 1`;
				}
			}
		}

		return (
			<div className='App'>
				{score > 0 &&
					<>
						<div className='timeDisplay'>Time: {time / 1000} sec</div>
						{/* By adding a key to the element, React will properly re-mount it and update the CSS pie timer animation, when the key changes. */}
						<div key={time} className='pie'></div>
					</>}
				<div className='ladybugContainer' onClick={clicked} style={{ top: randomTop, left: randomLeft }}>
					{score === 0 &&
						<>
							<span className='clickText'>Click!</span>
							<br />
						</>}
					{ladyBugImage('ladybug', { animation: `spin ${time / 3100}s linear infinite` }, null)}
				</div>
			</div>
		)
	} else {
		//scream.play()
		return (
			<div>
				<h1>FAIL</h1>
				<h2>Score: {score}</h2>
				{time < 300 && <h2>Also, you are insanely fast.</h2>}
				{ladyBugImage('ladybugBig', null, newTry)}
			</div>);
	}
}

export default App;
