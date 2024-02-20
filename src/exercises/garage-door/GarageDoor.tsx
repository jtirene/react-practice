import { useEffect, useState } from 'react'

type DoorStatus =
	| 'open'
	| 'closed'
	| 'opening'
	| 'closing'
	| 'stopped-opening'
	| 'stopped-closing'

const useGarageDoorController = ({
	secondsToOpen = 3,
	tickDurationMilliseconds = 1000 / 60,
}: {
	secondsToOpen: number
	tickDurationMilliseconds: number
}) => {
	const [height, setHeight] = useState(100)
	const [status, setStatus] = useState<DoorStatus>('closed')

	const ticksToOpen = (secondsToOpen * 1000) / tickDurationMilliseconds
	const moveHeightPerTick = 100 / ticksToOpen

	const tick = () => {
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
				if (height + moveHeightPerTick > 100) {
					setStatus('closed')
					setHeight(100)
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

	const activate = () => {
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

	const open = () => {
		if (height > 0) {
			setStatus('opening')
		}
	}

	const close = () => {
		if (height < 100) {
			setStatus('closing')
		}
	}

	return {
		height,
		status,
		activate,
		open,
		close,
	}
}

const GarageDoor = ({
	secondsToOpen,
	tickDurationMilliseconds,
}: {
	secondsToOpen: number
	tickDurationMilliseconds: number
}) => {
	const { status, height, activate, open, close } = useGarageDoorController({
		secondsToOpen,
		tickDurationMilliseconds,
	})

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '20px',
				height: '100%',
			}}
		>
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					gap: '20px',
				}}
			>
				<button onClick={open}>/\</button>
				<button onClick={activate}>Activate</button>
				<button onClick={close}>\/</button>
			</div>
			<div>
				{status} - {Math.ceil(height)}
			</div>
			<div
				style={{
					flexGrow: 1,
					position: 'relative',
					height: '100%',
					backgroundColor: 'blue',
				}}
			>
				<div
					style={{
						position: 'absolute',
						top: 0,
						width: '100%',
						height: `${Math.ceil((height / 100) * 100)}%`,
						backgroundColor: 'grey',
					}}
				></div>
			</div>
		</div>
	)
}

export default GarageDoor
