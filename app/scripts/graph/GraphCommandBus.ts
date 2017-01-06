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

    }

}