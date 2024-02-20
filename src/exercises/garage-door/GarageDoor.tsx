import { useEffect, useState } from 'react'

type DoorStatus =
	| 'open'
	| 'closed'
	| 'opening'
	| 'closing'
	| 'stopped-opening'
	| 'stopped-closing'

const GarageDoor = ({
	doorWidth,
	doorHeight,
	secondsToOpen = 3,
	tickDurationMilliseconds = 1000 / 60,
}: {
	doorWidth: number
	doorHeight: number
	secondsToOpen: number
	tickDurationMilliseconds: number
}) => {
	const [height, setHeight] = useState(doorHeight)
	const [status, setStatus] = useState<DoorStatus>('closed')

	const ticksToOpen = (secondsToOpen * 1000) / tickDurationMilliseconds
	const moveHeightPerTick = doorHeight / ticksToOpen

	const tick = () => {
		// console.log(`tick - [${status}, ${height}]`)
		switch (status) {
			case 'opening':
				if (height - moveHeightPerTick < 0) {
					setStatus('open')
					setHeight(0)
				} else {
					setHeight(height - moveHeightPerTick)
				}
				break
			case 'closing':
				if (height + moveHeightPerTick > doorHeight) {
					setStatus('closed')
					setHeight(doorHeight)
				} else {
					setHeight(height + moveHeightPerTick)
				}
				break
			case 'stopped-closing':
			case 'stopped-opening':
			case 'open':
			case 'closed':
				// do nothing on tick
				break
			default:
				throw new Error(`tick - unexpected door status: ${status}`)
		}
	}

	useEffect(() => {
		const interval = setInterval(tick, tickDurationMilliseconds)
		return () => clearInterval(interval)
	}, [height, status])

	const onActivate = () => {
		// console.log(`onActivate - [${status}, ${height}]`)
		switch (status) {
			case 'open':
				setStatus('closing')
				break
			case 'closed':
				setStatus('opening')
				break
			case 'opening':
				setStatus('stopped-opening')
				break
			case 'closing':
				setStatus('stopped-closing')
				break
			case 'stopped-closing':
				setStatus('opening')
				break
			case 'stopped-opening':
				setStatus('closing')
				break
		}
	}

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '20px',
			}}
		>
			<button onClick={onActivate}>Push</button>
			<div
				style={{
					position: 'relative',
					width: `${doorWidth}px`,
					height: `${doorHeight}px`,
					backgroundColor: 'blue',
				}}
			>
				<div
					style={{
						position: 'absolute',
						top: 0,
						width: '100%',
						height: `${Math.ceil((height / doorHeight) * 100)}%`,
						backgroundColor: 'grey',
					}}
				></div>
			</div>
		</div>
	)
}

export default GarageDoor
