namespace graph {

    export class GraphCommandBus {

        model: GraphModel;

        updateListeners: Array<() => void> = [];

        constructor(model: GraphModel) {
            this.model = model;
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
    }

}