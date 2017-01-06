///<reference path="graph/GraphController.ts"/>

namespace main {

    import GraphController = graph.GraphController;
    import GraphCommandBus = graph.GraphCommandBus;
    import GraphModel = graph.GraphModel;

    export class Main {

        private model: GraphModel;
        private commandBus: GraphCommandBus;
        private mainContainer: d3.Selection<void>;

        private graphController: GraphController;

        constructor() {
            this.model = GraphModel.empty();
            this.commandBus = new GraphCommandBus(this.model);

            this.mainContainer = d3.select("#main");

            this.graphController = new GraphController(this.mainContainer, this.model, this.commandBus);
        }

        start() {
            this.graphController.updateView();
        }

    }

    new Main().start();

}