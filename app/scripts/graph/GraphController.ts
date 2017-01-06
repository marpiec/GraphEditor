namespace graph {

    export class GraphController {

        private model: GraphModel;
        private commandBus: GraphCommandBus;
        private config: GraphConfig;

        private canvas: d3.Selection<void>;
        private edgesLayer: d3.Selection<void>;
        private nodesLayer: d3.Selection<void>;

        constructor(container: d3.Selection<void>, model: GraphModel, commandBus: GraphCommandBus) {
            this.model = model;
            this.commandBus = commandBus;

            this.config = new GraphConfig();

            container.html(`
                <svg class="canvas">
                    <g class="edgesLayer"></g>
                    <g class="nodesLayer"></g>
                </svg>`);


            this.canvas = container.select(".canvas");
            this.edgesLayer = container.select(".edgesLayer");
            this.nodesLayer = container.select(".nodesLayer");

            d3.select(window).on('resize', () => {
                this.updateContainerSize();
            });

            this.updateContainerSize();

            this.commandBus.registerUpdateListener(() => {
                this.updateView();
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
                .on("click", (d: GraphEdge) => this.commandBus.activateElement(d));
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
                .classed("active", (d: GraphNode) => this.model.activeElement === d)
                .on("click", (d: GraphNode) => this.commandBus.activateElement(d));
        }
    }

}