import { createContext, useReducer } from 'react'
import TaskCompleteCount from './TaskCompleteCount'

type Task = {
	id: number
	text: string
	done: boolean
}

type TaskState = Task[]
type TaskActions =
	| {
			type: 'complete-task'
			id: number
	  }
	| {
			type: 'uncomplete-task'
			id: number
	  }

const tasksReducer = (tasks: TaskState, action: TaskActions) => {
	switch (action.type) {
		case 'complete-task':
			return tasks.map((task) =>
				task.id === action.id ? { ...task, done: true } : task,
			)
		case 'uncomplete-task':
			return tasks.map((task) =>
				task.id === action.id ? { ...task, done: false } : task,
			)
	}
}

const initialTasks: Task[] = [
	{
		id: 1,
		text: "Philosopher's Path",
		done: true,
	},
	{
		id: 2,
		text: 'Visit the temple',
		done: false,
	},
	{
		id: 3,
		text: 'Drink matcha',
		done: false,
	},
]

export const TasksContext = createContext(initialTasks)

const ContextStateReducer = () => {
	const [tasks, dispatch] = useReducer(tasksReducer, initialTasks)

	const completeTask = (id: number) => {
		dispatch({
			type: 'complete-task',
			id,
		})
	}

	const uncompleteTask = (id: number) => {
		dispatch({
			type: 'uncomplete-task',
			id,
		})
	}

	return (
		<TasksContext.Provider value={tasks}>
			<div
				style={{
					display: 'flex',
					gap: '8px',
				}}
			>
				<TaskCompleteCount />
				{tasks.map((task) => (
					<div
						key={task.id}
						style={{
							border: '1px solid black',
							borderRadius: '4px',
							padding: '8px',
						}}
					>
						<div>Task: {task.text}</div>
						<div>{task.done ? 'Done' : 'Not done'}</div>
						{task.done ? (
							<button onClick={() => uncompleteTask(task.id)}>
								Uncomplete
							</button>
						) : (
							<button onClick={() => completeTask(task.id)}>Complete</button>
						)}
					</div>
				))}
			</div>
		</TasksContext.Provider>
	)
}

export default ContextStateReducer
