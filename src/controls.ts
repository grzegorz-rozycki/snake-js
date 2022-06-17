export default class Controls {
    actions = Object.create(null);
    // action fifo queue
    actionQueue: string[] = [];
    // key kode to action bindings
    bindings: Record<number, string | Handler> = Object.create(null);

    static createDefaults() {
        const instance = new Controls()

        instance.actions.n = false;
        instance.actions.e = false;
        instance.actions.s = false;
        instance.actions.w = false;

        instance.actionQueue = [];

        instance.bindings[65] = "w"; // a key
        instance.bindings[68] = "e"; // d key
        instance.bindings[87] = "n"; // w key
        instance.bindings[83] = "s"; // s key
        instance.bindings[37] = "w"; // left-arrow
        instance.bindings[39] = "e"; // right arrow
        instance.bindings[38] = "n"; // up arrow
        instance.bindings[40] = "s"; // down arrow
        //instance.bindings[27] = function () {}; ESC key
        //instance.bindings[80] = function () {}; p key

        return instance;
    };

    keyUp(event: KeyboardEvent) {
        if (!(event.keyCode in this.bindings)) {
            return;
        }

        let binding: Handler | string = this.bindings[event.keyCode];

        if (binding instanceof Handler) {
            binding.action();
        } else if (binding in this.actions) {
            this.actionQueue.push(binding);
        }
    }

    hasNextAction(): boolean {
        return this.actionQueue.length > 0;
    }

    getNextAction(): null | string {
        return this.actionQueue.shift() ?? null;
    }

    purgeActions(): void {
        this.actionQueue = [];
    }

    hasBinding(keyCode: number) {
        return (keyCode in this.bindings);
    }

    registerHandler(keyCode: number, handler: Handler) {
        this.bindings[keyCode] = handler;
    }
}

export class Handler {
    constructor(public readonly action: Function, public readonly on: string) {
    }
}
