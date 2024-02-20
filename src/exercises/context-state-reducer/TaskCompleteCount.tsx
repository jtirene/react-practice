import { useContext } from 'react'
import { TasksContext } from './ContextStateReducer'

const TaskCompleteCount = () => {
	const tasks = useContext(TasksContext)
	return <div>{tasks.filter((task) => task.done).length} tasks completed</div>
}

export default TaskCompleteCount
