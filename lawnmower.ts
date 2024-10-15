const	fs = require('node:fs')

type Field = {
	width: number,
	height: number
}

type LawnMower = {
	x: number,
	y: number,
	orientation: string,
	instructions: string
}

type Data = [Field, Array<LawnMower>]


function	main(argv: string[]): number
{
	const	input = fs.readFileSync(argv[2], 'utf-8')
	const	data = parseFile(input)
	if (!data)
	{
		console.error("Invalid Input File")
		return (-1)
	}

	playInstructions(data)
	return (0)
}

function	parseFile(input: string): Data | null
{
	const	lines: Array<string> = input.split('\n')
	if (lines.length < 3)
		return null

	const	dimensions = lines[0].split(' ')
	if (dimensions.length !== 2)
		return null

	const	field: Field = {
		width: parseInt(dimensions[0]),
		height: parseInt(dimensions[1])
	}
	if (isNaN(field.width) || isNaN(field.height))
		return null

	let		mowers: Array<LawnMower> = []

	lines.shift()
	for (let i = 0; i < lines.length; i += 2)
	{
		let		new_mower = { x: 0, y: 0, orientation: '', instructions: '' }
		const	coordinates = lines[i].split(' ')
		if (coordinates.length !== 3)
			return null

		new_mower.x = parseInt(coordinates[0])
		new_mower.y = parseInt(coordinates[1])
		if (isNaN(new_mower.x) || isNaN(new_mower.y))
			return null

		new_mower.orientation = coordinates[2]
		if (!isOrientation(new_mower.orientation))
			return null

		new_mower.instructions = lines[i + 1]
		if (!isInstructions(new_mower.instructions))
			return null
		mowers.push(new_mower)
	}
	return [field, mowers]
}

function isOrientation(orientation: string): boolean
{
	return (
		(orientation === 'N' ||
		orientation === 'E' ||
		orientation === 'S' ||
		orientation === 'W' ) &&
		orientation.length === 1
	)
}

function isInstructions(instructions: string): boolean
{
	for (const instruction of instructions)
	{
		if (instruction !== 'R' && instruction !== 'L' && instruction !== 'F')
			return false
	}
	return true
}

function	playInstructions(data: Data)
{
	const [field, mowers] = data

	for (let mower of mowers)
	{
		for (let instruction of mower.instructions)
		{
			if (instruction === 'F')
				moveMower(mower, field)
			else if (instruction === 'R' || instruction === 'L')
				rotateMower(mower, instruction)
			else
			{
				console.error("Invalid Instruction")
				break
			}
		}
		console.log(`${mower.x} ${mower.y} ${mower.orientation}`)
	}
}

function	moveMower(mower: LawnMower, field: Field)
{
	switch(mower.orientation)
	{
		case('N'):
			mower.y = Math.min(field.height, mower.y + 1)
			break;
		case('E'):
			mower.x = Math.min(field.width, mower.x + 1)
			break;
		case('S'):
			mower.y = Math.max(0, mower.y - 1)
			break;
		case('W'):
			mower.x = Math.max(0, mower.x - 1)
			break;
		default:
			console.error('Invalid Mower Orientation')
	}
}

function	rotateMower(mower: LawnMower, direction: string)
{
	const	orientations = "NESW"
	let		index = orientations.indexOf(mower.orientation)

	if (index === -1)
	{
		console.error("Invalid Mower Orientation")
		return
	}
	if (direction === 'R')
		index++
	else
		index--
	if (index < 0)
		index = 3
	if (index > 3)
		index = 0
	mower.orientation = orientations.charAt(index)
}

main(process.argv)
