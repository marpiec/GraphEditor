namespace graph {

    export enum DragMode {
        dragNode, drawEdge
    }

    export class GraphModel {
        nodes: Array<GraphNode>;
        edges: Array<GraphEdge>;

        dragMode: DragMode = DragMode.dragNode;
        activeElement: GraphNode | GraphEdge | null;

        constructor(nodes: Array<GraphNode>, edges: Array<GraphEdge>) {
            this.nodes = nodes;
            this.edges = edges;
            this.activeElement = null;
        }

        static empty() {
            return new GraphModel([new GraphNode(1, new PositionXY(100, 100)), new GraphNode(2, new PositionXY(300, 200))], [new GraphEdge(1, 1, 2)]);
        }

        nodeById(id: number): GraphNode {
            return <GraphNode>_(this.nodes).find((n: GraphNode) => n.id === id);
        }
    }

    export class GraphNode {
        id: number;
        position: PositionXY;

        constructor(id: number, position: PositionXY) {
            this.id = id;
            this.position = position;
        }
    }

    export class GraphEdge {
        id: number;
        fromNodeId: number;
        toNodeId: number;

        constructor(id: number, fromNodeId: number, toNodeId: number) {
            this.id = id;
            this.fromNodeId = fromNodeId;
            this.toNodeId = toNodeId;
        }
    }

}