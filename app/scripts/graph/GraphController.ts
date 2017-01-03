namespace graph {

    export class GraphController {

        private container: HTMLElement;
        private model: GraphModel;
        private commandBus: GraphCommandBus;

        constructor(container: HTMLElement, model: GraphModel, commandBus: GraphCommandBus) {
            this.container = container;
            this.model = model;
            this.commandBus = commandBus;
        }

        start() {
            d3.select(this.container).html("Hello world");
        }
    }

}