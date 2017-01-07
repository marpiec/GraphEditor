///<reference path="GraphModel.ts"/>

namespace graph {

    export class GraphCommandBus {

        model: GraphModel;
        config: GraphConfig;
        updateListeners: Array<() => void> = [];

        constructor(model: GraphModel, config: GraphConfig) {
            this.model = model;
            this.config = config;
        }

        registerUpdateListener(listener: () => void): void {
            this.updateListeners.push(listener);
        }

        callUpdateListeners(): void {
            this.updateListeners.forEach(listener => listener());
        }

        activateElement(element: GraphNode | GraphEdge): void {
            this.model.activeElement = element;
            this.callUpdateListeners();
        }

        deleteActiveElement() {
            if (this.model.activeElement instanceof GraphNode) {
                const node = this.model.activeElement;
                this.model.nodes = this.model.nodes.filter(n => n !== node);
                this.model.edges = this.model.edges.filter(e => e.fromNodeId !== node.id && e.toNodeId != node.id);
                this.callUpdateListeners();
            } else if (this.model.activeElement instanceof GraphEdge) {
                this.model.edges = this.model.edges.filter(e => e !== this.model.activeElement);
                this.callUpdateListeners();
            }
        }

        addNode(x: number, y: number) {
            let maxId = 0;
            this.model.nodes.forEach(n => maxId = Math.max(maxId, n.id));
            this.model.nodes.push(new GraphNode(maxId + 1, new PositionXY(x, y)));
            this.callUpdateListeners();
        }

        toggleDragMode() {
            if(this.model.dragMode === DragMode.dragNode) {
                this.model.dragMode = DragMode.drawEdge;
            } else {
                this.model.dragMode = DragMode.dragNode;
            }
            this.callUpdateListeners();
        }

        updateNodePosition(node: GraphNode, position: PositionXY) {
            node.position = position;
            this.callUpdateListeners();
        }

        addEdgeIfPossible(fromNode: GraphNode, position: PositionXY) {

            const matchingNodes = this.model.nodes.filter(n =>
                        Math.pow(n.position.x - position.x, 2) + Math.pow(n.position.y - position.y, 2) < this.config.nodesRadius * this.config.nodesRadius);

            if(matchingNodes.length > 0) {
                const toNode = matchingNodes[0];
                const edgeNotYetExists = this.model.edges.filter(e => e.fromNodeId === fromNode.id && e.toNodeId === toNode.id ||
                    e.fromNodeId === toNode.id && e.toNodeId === fromNode.id).length == 0;
                const differentNodes = fromNode.id !== toNode.id;
                if(edgeNotYetExists && differentNodes) {
                    let maxId = 0;
                    this.model.nodes.forEach(n => maxId = Math.max(maxId, n.id));
                    this.model.edges.push(new GraphEdge(maxId + 1, fromNode.id, matchingNodes[0].id));
                    this.callUpdateListeners();
                }

            }

        }
    }

}