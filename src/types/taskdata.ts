export type TaskData = {
	_id: string
	title: string
	checked: boolean
	list: string
	position: { x: number | 'unset'; y: number | 'unset' }
	rotation: '5deg' | '-5deg'
}
