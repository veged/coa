export function Cmd(cmd?: classes.Cmd): classes.Cmd;
export function Opt(cmd?: classes.Cmd): classes.Opt;
export function Arg(cmd?: classes.Cmd): classes.Arg;

export namespace classes {
    class Arg {
        constructor(cmd: Cmd);
        name(name: string): Arg;
        title(title: string): Arg;
        arr(): Arg;
        req(): Arg;
        val(validation: (this: Arg, value: any) => any): Arg;
        def(def: any): Arg;
        input(): Arg;
        output(): Arg;
        comp(fn: (opts: any) => any): Arg;
        apply(fn: Function, ...args: any[]): Arg;
        reject(reason: any): any;
        end(): Cmd;
    }

    class Cmd {
        constructor(cmd?: Cmd);
        static create(cmd?: Cmd): Cmd;
        readonly api: any;
        readonly isRootCmd: boolean;
        name(name: string): Cmd;
        title(title: string): Cmd;
        cmd(cmd?: Cmd): Cmd;
        opt(): Opt;
        arg(): Arg;
        act(act: (opts: any, args: any, res: any) => any, force?: boolean): Cmd;
        apply(fn: Function, ...args: any[]): Cmd;
        comp(fn: (opts: any) => any): Cmd;
        helpful(): Cmd;
        completable(): Cmd;
        extendable(pattern?: string): Cmd;
        usage(): string;
        run(argv?: string[]): Cmd;
        invoke(cmds?: string | string[], opts?: any, args?: any): Promise<any>;
        do(argv?: string[]): Promise<any>;
        reject(reason: any): any;
        end(): Cmd;
    }

    class Opt {
        constructor(cmd: Cmd);
        name(name: string): Opt;
        title(title: string): Opt;
        short(short: string): Opt;
        long(long: string): Opt;
        flag(): Opt;
        arr(): Opt;
        req(): Opt;
        only(): Opt;
        val(validation: (this: Opt, value: any) => any): Opt;
        def(def: any): Opt;
        input(): Opt;
        output(): Opt;
        act(act: (opts: any, args: any, res: any) => any): Opt;
        comp(fn: (opts: any) => any): Opt;
        apply(fn: Function, ...args: any[]): Opt;
        reject(reason: any): any;
        end(): Cmd;
    }
}

export namespace shell {
    function escape(w: string): string;
    function unescape(w: string): string;
}
