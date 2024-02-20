import './App.css'
import GarageDoor from './exercises/garage-door/GarageDoor'

function App() {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '20px',
			}}
		>
			<div
				style={{
					width: '500px',
					height: '1450px',
				}}
			>
				<GarageDoor secondsToOpen={3} tickDurationMilliseconds={1000 / 60} />
			</div>
		</div>
	)
}

export default App
