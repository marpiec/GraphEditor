namespace d3tools {

    /**
     * It is a wrapper of drag functionality of D3.
     * It provides child class with a support for multiple drag phases.
     */
    export abstract class DragBehavior<T> {

        private selection: d3.Selection<any, T, any, any>;
        /** Dragged distance is used to determine if it was a drag, or a click. */
        private draggedDistance: number = 0;

        constructor(selection: d3.Selection<any, T, any, any>) {
            this.selection = selection;
        }

        abstract dragOrigin(draggedElement: d3.Selection<any, T, any, any>, eventPosition: PositionXY, model: T): {x: number;y: number};

        abstract dragStarted(draggedElement: d3.Selection<any, T, any, any>, eventPosition: PositionXY, model: T): void;

        abstract dragged(draggedElement: d3.Selection<any, T, any, any>, eventPosition: PositionXY, model: T): void;

        abstract dragEnded(draggedElement: d3.Selection<any, T, any, any>, eventPosition: PositionXY, model: T): void;

        init() {
            const drag = d3.drag()
                .origin(this.dragOriginInternal())
                .on("dragstart", this.internalStart())
                .on("drag", this.internalDragged())
                .on("dragend", this.internalEnd());

            this.selection.call(drag);
        }

        isInPlaceClick() {
            return this.draggedDistance < 8;
        }

        dragOriginInternal() {
            const externalThis = this;
            return function (d: T) {

                const x = d3.mouse(document.body)[0];
                const y = d3.mouse(document.body)[1];
                const eventTarget = d3.select(<any>this);
                const origin = externalThis.dragOrigin(eventTarget, new PositionXY(x, y), <T>d);
                (<any>this)["__origin__"] = origin;
                (<any>this)["__origin_mouse__"] = new PositionXY(x, y);
                return origin;
            }
        }

        internalStart() {
            const externalThis = this;
            return function (d: T) {

                externalThis.draggedDistance = 0;
                const eventTarget = d3.select(<any>this);
                const origin = (<any>this)["__origin__"];
                const originMouse = <PositionXY>(<any>this)["__origin_mouse__"];
                const eventX = origin.x + d3.mouse(document.body)[0] - originMouse.x;
                const eventY = origin.y + d3.mouse(document.body)[1] - originMouse.y;

                (<any>this)["__last_position__"] = {x: eventX, y: eventY};
                externalThis.dragStarted(eventTarget, new PositionXY(eventX, eventY), <T>d);
            }
        }


        internalDragged() {
            const externalThis = this;
            return function (d: T) {

                externalThis.draggedDistance++;
                const eventTarget = d3.select(<any>this);
                const origin = (<any>this)["__origin__"];
                const originMouse = <PositionXY>(<any>this)["__origin_mouse__"];
                const eventX = origin.x + d3.mouse(document.body)[0] - originMouse.x;
                const eventY = origin.y + d3.mouse(document.body)[1] - originMouse.y;
                (<any>this)["__last_position__"] = {x: eventX, y: eventY};
                externalThis.dragged(eventTarget, new PositionXY(eventX, eventY), <T>d);
            }
        }

        internalEnd() {
            const externalThis = this;
            return function (d: T) {
                const eventTarget = d3.select(<any>this);
                delete (<any>this)["__origin__"];
                delete (<any>this)["__origin_mouse__"];
                const lastPosition: {x: number;y: number} = (<any>this)["__last_position__"];
                delete (<any>this)["__last_position__"];
                externalThis.dragEnded(eventTarget, new PositionXY(lastPosition.x, lastPosition.y), <T>d);
            }
        }


    }
}
