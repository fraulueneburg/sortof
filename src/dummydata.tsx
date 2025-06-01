const toDoData: ToDoData = {
	lists: {
		'list-1': {
			_id: 'list-1',
			title: 'To Do',
			color: '#ff6b6b',
		},
		'list-2': {
			_id: 'list-2',
			title: 'In Progress',
			color: '#4ecdc4',
		},
		'list-3': {
			_id: 'list-3',
			title: 'Done',
			color: '#45b7d1',
		},
	},
	tasksByList: {
		'list-1': ['task-1', 'task-3'],
		'list-2': ['task-2'],
		'list-3': ['task-4', 'task-5'],
	},
	tasks: {
		'task-1': {
			_id: 'task-1',
			title: 'Buy groceries',
			checked: false,
			list: 'list-1',
		},
		'task-2': {
			_id: 'task-2',
			title: 'Review code',
			checked: false,
			list: 'list-2',
		},
		'task-3': {
			_id: 'task-3',
			title: 'Call dentist',
			checked: false,
			list: 'list-1',
		},
		'task-4': {
			_id: 'task-4',
			title: 'Submit report',
			checked: true,
			list: 'list-3',
		},
		'task-5': {
			_id: 'task-5',
			title: 'Update resume',
			checked: true,
			list: 'list-3',
		},
	},
}
