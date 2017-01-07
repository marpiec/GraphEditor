///<reference path="../libs.d.ts/d3-v3.5.d.ts"/>
///<reference path="graph/GraphController.ts"/>

namespace main {

    import GraphController = graph.GraphController;
    import GraphCommandBus = graph.GraphCommandBus;
    import GraphModel = graph.GraphViewModel;

    export class Main {

        private graphController: GraphController;

        constructor() {
            const model = GraphModel.empty();
            const commandBus = new GraphCommandBus(model);

            const mainContainer = d3.select("#main");

            this.graphController = new GraphController(mainContainer, model, commandBus);
        }

        start() {
            this.graphController.updateView();
        }

    }

    new Main().start();

}