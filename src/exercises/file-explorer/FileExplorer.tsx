import {
	QueryClient,
	QueryClientProvider,
	useQuery,
} from '@tanstack/react-query'
import {
	File as FileIcon,
	Folder as FolderIcon,
	Home as HomeIcon,
} from 'lucide-react'
import {
	Link,
	RouterProvider,
	createBrowserRouter,
	useLocation,
	useNavigate,
} from 'react-router-dom'

type DirectoryNode = {
	type: 'directory'
	name: string
	children: Record<string, Node>
}
type FileNode = {
	type: 'file'
	name: string
	size: string
}
type Node = DirectoryNode | FileNode

const useFileQuery = () =>
	useQuery<Node>({
		queryKey: ['files'],
		queryFn: async () => (await fetch('/file-explorer-data.json')).json(),
	})

const File = (props: { file: FileNode }) => {
	return <div>File: {props.file.name}</div>
}

const Directory = (props: { directory: DirectoryNode }) => {
	const { pathname } = useLocation()
	const navigate = useNavigate()
	const basePath = pathname === '/' ? '' : pathname

	const directories = Object.values(props.directory.children)
		.filter((node) => node.type === 'directory')
		.map((node) => node as DirectoryNode)
	const files = Object.values(props.directory.children)
		.filter((node) => node.type === 'file')
		.map((node) => node as FileNode)

	return (
		<table className="text-left w-full table-fixed">
			<thead>
				<tr>
					<th className="p-2">Name</th>
					<th className="p-2">Size</th>
				</tr>
			</thead>
			<tbody>
				{directories.map((directory) => (
					<tr
						key={directory.name}
						onClick={() => navigate(`${basePath}/${directory.name}`)}
						className="hover:bg-gray-300 cursor-pointer"
					>
						<td className="p-2 flex gap-4 w-[75%]">
							<FolderIcon />
							<span>{directory.name}</span>
						</td>
						<td className="p-2">-</td>
					</tr>
				))}
				{files.map((file) => (
					<tr
						key={file.name}
						onClick={() => navigate(`${basePath}/${file.name}`)}
						className="hover:bg-gray-300 cursor-pointer"
					>
						<td className="p-2 flex gap-4 w-[75%]">
							<FileIcon />
							<span>{file.name}</span>
						</td>
						<td className="p-2">{file.size}</td>
					</tr>
				))}
			</tbody>
		</table>
	)
}

const Breadcrumb = () => {
	const { pathname } = useLocation()
	const pathSegments = pathname
		.split('/')
		.filter((p) => p !== '')
		.reverse()

	let remainingPathname = pathname
	const crumbs: {
		name: string
		path: string
	}[] = []
	for (const pathSegment of pathSegments) {
		crumbs.push({
			name: pathSegment,
			path: remainingPathname,
		})
		remainingPathname = remainingPathname.replace(`/${pathSegment}`, '')
	}

	return (
		<div className="flex gap-2">
			<span>
				<Link to="/">
					<HomeIcon />
				</Link>
			</span>
			{crumbs.reverse().map((crumb) => (
				<span key={crumb.path} className="flex gap-2">
					<span>/</span>
					<Link to={crumb.path}>
						<span>{crumb.name}</span>
					</Link>
				</span>
			))}
		</div>
	)
}

const FileExplorer = () => {
	const { pathname } = useLocation()
	const { isLoading, isError, error, data } = useFileQuery()

	if (isLoading) return <div>Loading...</div>
	if (isError) return <div>Error: {error.message}</div>
	if (!data) return <div>No data</div>

	const pathSegments = pathname.split('/').filter((p) => p !== '')

	let currentNode = data
	for (const pathSegment of pathSegments) {
		if (currentNode.type === 'file') {
			throw new Error('Attempted to index a file: ' + pathname)
		} else {
			currentNode = currentNode.children[pathSegment]
		}
	}

	if (!currentNode) throw new Error('Invalid path: ' + pathSegments)

	const Node =
		currentNode.type === 'file' ? (
			<File file={currentNode} />
		) : (
			<Directory directory={currentNode} />
		)

	return (
		<div className="flex flex-col gap-4 items-start">
			<Breadcrumb />
			{Node}
		</div>
	)
}

const router = createBrowserRouter([
	{
		path: '*',
		element: <FileExplorer />,
	},
])

const client = new QueryClient()

export default () => {
	return (
		<QueryClientProvider client={client}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	)
}
