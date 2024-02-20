import './App.css'
import ContextStateReducer from './exercises/context-state-reducer/ContextStateReducer'

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
				{/* <GarageDoor secondsToOpen={3} tickDurationMilliseconds={1000 / 60} /> */}
				<ContextStateReducer />
			</div>
		</div>
	)
}

export default App
