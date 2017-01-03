namespace graph {

    export class GraphModel {
        nodes: Array<Node>;
        edges: Array<Edge>;

        constructor(nodes: Array<Node>, edges: Array<Edge>) {
            this.nodes = nodes;
            this.edges = edges;
        }

        static empty() {
            return new GraphModel([], []);
        }
    }

    export class Node {
        id: number;
        position: PositionXY;

        constructor(id: number, position: PositionXY) {
            this.id = id;
            this.position = position;
        }
    }

    export class Edge {
        fromNodeId: number;
        toNodeId: number;

        constructor(fromNodeId: number, toNodeId: number) {
            this.fromNodeId = fromNodeId;
            this.toNodeId = toNodeId;
        }
    }

}