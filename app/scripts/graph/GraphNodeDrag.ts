///<reference path="../tools/DragBehavior.ts"/>


namespace graph {

    import DragBehavior = d3tools.DragBehavior;

    export class GraphNodeDrag extends DragBehavior<GraphNode> {

        private commandBus: GraphCommandBus;

        private constructor(selection: d3.Selection<GraphNode>, commandBus: GraphCommandBus) {
            super(selection);
            this.commandBus = commandBus;
        }

        static enable(selection: d3.Selection<GraphNode>, commandBus: GraphCommandBus) {
            new GraphNodeDrag(selection, commandBus).init();
        }

        dragOrigin(draggedElement: d3.Selection<GraphNode>, eventPosition: PositionXY, model: GraphNode): {x: number; y: number} {
            return {x: model.position.x, y: model.position.y};
        }

        dragStarted(draggedElement: d3.Selection<GraphNode>, eventPosition: PositionXY, model: GraphNode): void {
            this.commandBus.updateNodePosition(model, eventPosition);
        }

        dragged(draggedElement: d3.Selection<GraphNode>, eventPosition: PositionXY, model: GraphNode): void {
            this.commandBus.updateNodePosition(model, eventPosition);
        }

        dragEnded(draggedElement: d3.Selection<GraphNode>, eventPosition: PositionXY, model: GraphNode): void {
            this.commandBus.updateNodePosition(model, eventPosition);
        }

    }


    export class GraphNodeEdgeDraw extends DragBehavior<GraphNode> {

        private commandBus: GraphCommandBus;
        private model: GraphModel;
        private edgeMock: d3.Selection<void>;

        constructor(selection: d3.Selection<GraphNode>, commandBus: GraphCommandBus, model: GraphModel, edgeMock: d3.Selection<void>) {
            super(selection);
            this.commandBus = commandBus;
            this.model = model;
            this.edgeMock = edgeMock;
        }

        static enable(selection: d3.Selection<GraphNode>, commandBus: GraphCommandBus, model: GraphModel, edgeMock: d3.Selection<void>) {
            new GraphNodeEdgeDraw(selection, commandBus, model, edgeMock).init();
        }

        dragOrigin(draggedElement: d3.Selection<GraphNode>, eventPosition: PositionXY, model: GraphNode): {x: number; y: number} {
            return {x: eventPosition.x, y: eventPosition.y};
        }

        dragStarted(draggedElement: d3.Selection<GraphNode>, eventPosition: PositionXY, model: GraphNode): void {
            this.edgeMock
                .classed("hidden", false)
                .attr("x1", model.position.x)
                .attr("y1", model.position.y)
                .attr("x2", eventPosition.x)
                .attr("y2", eventPosition.y);
        }

        dragged(draggedElement: d3.Selection<GraphNode>, eventPosition: PositionXY, model: GraphNode): void {
            this.edgeMock
                .attr("x1", model.position.x)
                .attr("y1", model.position.y)
                .attr("x2", eventPosition.x)
                .attr("y2", eventPosition.y);
        }

        dragEnded(draggedElement: d3.Selection<GraphNode>, eventPosition: PositionXY, model: GraphNode): void {
            this.edgeMock
                .classed("hidden", true);

            this.commandBus.addEdgeIfPossible(model, eventPosition);
        }

    }

}