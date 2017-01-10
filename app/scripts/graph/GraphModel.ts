namespace graph {

    export enum DragMode {
        dragNode, drawEdge
    }

    export class GraphNode {
        constructor(readonly id: number, public position: PositionXY) {}
    }

    export class GraphEdge {
        constructor(readonly id: number, public fromNodeId: number, public toNodeId: number) {}
    }

    export class GraphViewModel {

        readonly nodesRadius = 30;

        constructor(public nodes: Array<GraphNode>,
                    public edges: Array<GraphEdge>,
                    public dragMode: DragMode,
                    public activeElement: GraphNode | GraphEdge | null) {

        }

        static empty() {
            return new GraphViewModel([], [], DragMode.dragNode, null);
        }

        nodeById(id: number): GraphNode {
            return <GraphNode>_(this.nodes).find((n: GraphNode) => n.id === id);
        }

        nodeByPosition(position: PositionXY): GraphNode | null {
            const matchingNodes = this.nodes.filter(n =>
                Math.pow(n.position.x - position.x, 2) + Math.pow(n.position.y - position.y, 2) < this.nodesRadius * this.nodesRadius);

            if(matchingNodes.length > 0) {
                return matchingNodes[0];
            } else {
                return null;
            }
        }

    }

}