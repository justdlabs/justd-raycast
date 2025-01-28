import { Action, ActionPanel, Icon, List } from "@raycast/api"
import { useFetch } from "@raycast/utils"

type Node = Folder
interface Item {
	type: "page"
	name: string
	url: string
	external?: boolean
	$ref?: {
		file: string
	}
}

interface Folder {
	$ref?: {
		metaFile?: string
	}
	type: "folder"
	name: string
	description?: string
	root?: boolean
	defaultOpen?: boolean
	index?: Item
	children: Item[]
}

export default function Command() {
	const { data, isLoading } = useFetch<Node[]>("http://localhost:3000/api/components", { keepPreviousData: true })

	const flattenedComponents = data?.flatMap((node) => {
		if (node.type === "folder") {
			return node.children.map((child) => ({ ...child, type: node.name }))
		}

		throw new Error("Invalid node type")
	})

	return (
		<List isLoading={isLoading}>
			{data?.map((node) => (
				<List.Section key={node.name} title={node.name}>
					{node.children.map((item) => (
						<List.Item
							key={item.name}
							title={item.name}
							actions={
								<ActionPanel>
									<Action.OpenInBrowser url={`https://getjustd.com/${item.url}`} />
								</ActionPanel>
							}
						/>
					))}
				</List.Section>
			))}
		</List>
	)
}
