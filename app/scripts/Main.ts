///<reference path="graph/GraphController.ts"/>

namespace main {

    import GraphController = graph.GraphController;
    import GraphCommandBus = graph.GraphCommandBus;
    import GraphModel = graph.GraphModel;

    const model = GraphModel.empty();
    const commandBus = new GraphCommandBus(model);

    new GraphController(document.getElementById("main"), model, commandBus).start();


}