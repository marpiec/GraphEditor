///<reference path="../tools/PositionXY.ts"/>
///<reference path="../tools/DragBehavior.ts"/>
///<reference path="GraphConfig.ts"/>
///<reference path="GraphCommandBus.ts"/>
///<reference path="GraphNodeDrag.ts"/>

namespace graph {

    export class GraphController {

        private model: GraphViewModel;
        private commandBus: GraphCommandBus;
        private config: GraphConfig;

        private canvas: d3.Selection<void>;
        private edgesLayer: d3.Selection<void>;
        private nodesLayer: d3.Selection<void>;
        private dragModeButton: d3.Selection<void>;
        private edgeMock: d3.Selection<void>;

        constructor(container: d3.Selection<void>, model: GraphViewModel, commandBus: GraphCommandBus, config: GraphConfig) {
            this.model = model;
            this.commandBus = commandBus;

            this.config = config;

            container.html(`
                <svg class="canvas">
                    <g class="edgesLayer"></g>
                    <line class="edgeMock hidden"></line>
                    <g class="nodesLayer"></g>              
                </svg>
                <button class="dragModeButton"><i class="fa fa-pencil" aria-hidden="true"></i></button>`);


            this.dragModeButton = container.select(".dragModeButton");
            this.canvas = container.select(".canvas");
            this.edgesLayer = container.select(".edgesLayer");
            this.nodesLayer = container.select(".nodesLayer");
            this.edgeMock = container.select(".edgeMock");


            d3.select(window).on('resize', () => {
                this.updateContainerSize();
            });

            d3.select("body").on("keydown", () => {
                const deleteKeyCode = 46;
                if((<KeyboardEvent>d3.event).keyCode === deleteKeyCode) {
                    this.commandBus.deleteActiveElement();
                }
            });

            this.canvas.on("dblclick", () => {
                const mouseEvent = (<MouseEvent>d3.event);
                this.commandBus.addNode(mouseEvent.x, mouseEvent.y);
            });

            this.updateContainerSize();

            this.commandBus.registerUpdateListener(() => {
                this.updateView();
            });

            this.dragModeButton.on("mousedown", () => {
               this.commandBus.toggleDragMode();
            });
        }


        private updateContainerSize() {

            const width = window.innerWidth
                || document.documentElement.clientWidth
                || document.body.clientWidth;

            const height = window.innerHeight
                || document.documentElement.clientHeight
                || document.body.clientHeight;

            this.canvas
                .attr("width", width)
                .attr("height", height);
        }

        updateView() {
            this.updateEdgesView();
            this.updateNodesView();
            this.updateButtonsView();
            this.initNodesDrag();
        }

        private updateEdgesView() {
            // Bind data to edges
            const edges = this.edgesLayer.selectAll("line.graphEdge")
                .data(this.model.edges);

            // Create missing lines
            edges.enter()
                .append("line")
                .classed("graphEdge", true);

            // Remove not needed lines
            edges.exit()
                .remove();

            this.edgesLayer.selectAll("line.graphEdge")
                .attr("x1", (d: GraphEdge) => this.model.nodeById(d.fromNodeId).position.x)
                .attr("y1", (d: GraphEdge) => this.model.nodeById(d.fromNodeId).position.y)
                .attr("x2", (d: GraphEdge) => this.model.nodeById(d.toNodeId).position.x)
                .attr("y2", (d: GraphEdge) => this.model.nodeById(d.toNodeId).position.y)
                .classed("active", (d: GraphEdge) => this.model.activeElement === d)
                .on("mousedown", (d: GraphEdge) => {
                    this.commandBus.activateElement(d);
                    (<MouseEvent>d3.event).preventDefault();
                });
        }

        private updateNodesView() {
            // Bind data to nodes
            const nodes = this.nodesLayer.selectAll("circle.graphNode")
                .data(this.model.nodes);

            // Create missing circles
            nodes.enter()
                .append("circle")
                .classed("graphNode", true);

            // Remove not needed circles
            nodes.exit()
                .remove();

            this.nodesLayer.selectAll("circle.graphNode")
                .attr("cx", (d: GraphNode) => d.position.x)
                .attr("cy", (d: GraphNode) => d.position.y)
                .attr("r", this.config.nodesRadius)
                .classed("active", (d: GraphNode) => this.model.activeElement === d);
        }

        private initNodesDrag() {
            if(this.model.dragMode === DragMode.dragNode) {
                GraphNodeDrag.enable(this.nodesLayer.selectAll("circle.graphNode"), this.commandBus);
            } else if(this.model.dragMode === DragMode.drawEdge) {
                GraphNodeEdgeDraw.enable(this.nodesLayer.selectAll("circle.graphNode"), this.commandBus, this.model, this.edgeMock);
            }


        }

        private updateButtonsView() {
            this.dragModeButton
                .classed("enabled", this.model.dragMode === DragMode.drawEdge);
        }
    }

}