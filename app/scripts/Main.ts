///<reference path="../libs.d.ts/d3-v3.5.d.ts"/>
///<reference path="graph/GraphController.ts"/>

namespace main {

    import GraphController = graph.GraphController;
    import GraphCommandBus = graph.GraphCommandBus;
    import GraphModel = graph.GraphViewModel;
    import GraphConfig = graph.GraphConfig;

    export class Main {

        private graphController: GraphController;

        constructor() {
            const model = GraphModel.empty();
            const config = new GraphConfig();
            const commandBus = new GraphCommandBus(model, config);

            const mainContainer = d3.select("#main");

            this.graphController = new GraphController(mainContainer, model, commandBus, config);
        }

        start() {
            this.graphController.updateView();
        }

    }

    new Main().start();

}