namespace graph {

    import DragBehavior = d3tools.DragBehavior;

    export class GraphNodeDrag extends DragBehavior<GraphNode> {

        private commandBus: GraphCommandBus;

        constructor(selection: d3.Selection<GraphNode>, commandBus: GraphCommandBus) {
            super(selection);
            this.commandBus = commandBus;
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
        dragOrigin(draggedElement: d3.Selection<GraphNode>, eventPosition: PositionXY, model: GraphNode): {x: number; y: number} {
            return {x: model.position.x, y: model.position.y};
        }

        dragStarted(draggedElement: d3.Selection<GraphNode>, eventPosition: PositionXY, model: GraphNode): void {
        }

        dragged(draggedElement: d3.Selection<GraphNode>, eventPosition: PositionXY, model: GraphNode): void {
        }

        dragEnded(draggedElement: d3.Selection<GraphNode>, eventPosition: PositionXY, model: GraphNode): void {
        }

    }

}