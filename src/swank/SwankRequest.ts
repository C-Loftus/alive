import { LispID, LispSymbol } from './LispID'
import { toWire } from './SwankUtils'

export class SwankRequest {
    msgID: number
    data: string[]

    constructor(msgID: number, data: string[]) {
        this.msgID = msgID
        this.data = data
    }

    encode() {
        this.data.push(toWire(this.msgID))

        const str = `(${this.data.join(' ')})`
        const len = str.length.toString(16).padStart(6, '0')

        return `${len}${str}`
    }
}

export function emacsRex(msgID: number, data: string, pkg: any, threadID: number | boolean) {
    const rexData = [toWire(new LispSymbol('emacs-rex')), data, toWire(pkg), toWire(threadID)]
    return new SwankRequest(msgID, rexData)
}

export function setPackageReq(msgID: number, pkg?: string) {
    const data = [new LispID('swank:set-package'), new LispID(pkg ?? '')]
    return emacsRex(msgID, toWire(data), new LispID(pkg ?? 'nil'), true)
}

export function listPackagesReq(msgID: number, pkg?: string) {
    const data = [new LispID('swank:list-all-package-names'), true, new LispID(pkg ?? '')]
    return emacsRex(msgID, toWire(data), new LispID(pkg ?? 'nil'), true)
}

export function docSymbolReq(msgID: number, symbol: string, pkg?: string) {
    const data = [new LispID('swank:documentation-symbol'), symbol]
    return emacsRex(msgID, toWire(data), new LispID(pkg ?? 'nil'), true)
}

export function completionsReq(msgID: number, prefix: string, pkg: string) {
    const data = [new LispID('swank:simple-completions'), prefix, pkg]
    return emacsRex(msgID, toWire(data), new LispID(pkg ?? 'nil'), true)
}

export function opArgsReq(msgID: number, name: string, pkg: string) {
    const data = [new LispID('swank:operator-arglist'), name, pkg]
    return emacsRex(msgID, toWire(data), new LispID(pkg ?? 'nil'), true)
}

export function connectionInfoReq(msgID: number, pkg?: string) {
    const data = [new LispID('swank:connection-info')]
    return emacsRex(msgID, toWire(data), new LispID(pkg ?? 'nil'), true)
}

export function evalReq(msgID: number, form: string, pkg?: string) {
    const data = [new LispID('swank:eval-and-grab-output'), form]
    return emacsRex(msgID, toWire(data), new LispID(pkg ?? 'nil'), true)
}

export function compileFileReq(msgID: number, fileName: string, pkg?: string) {
    const data = [new LispID('swank:compile-file-for-emacs'), fileName, false]
    return emacsRex(msgID, toWire(data), new LispID(pkg ?? 'nil'), true)
}

export function threadsReq(msgID: number, pkg?: string) {
    const data = [new LispID('swank:list-threads')]
    return emacsRex(msgID, toWire(data), new LispID(pkg ?? 'nil'), true)
}

export function frameLocalsReq(msgID: number, threadID: number, frameID: string, pkg?: string) {
    const data = [new LispID('swank:frame-locals-and-catch-tags'), frameID]
    return emacsRex(msgID, toWire(data), new LispID(pkg ?? 'nil'), threadID)
}

export function debuggerInfoReq(msgID: number, threadID: number, start: number, end: number, pkg?: string) {
    const data = [new LispID('swank:debugger-info-for-emacs'), start, end]
    return emacsRex(msgID, toWire(data), new LispID(pkg ?? 'nil'), threadID)
}

export function debuggerAbortReq(msgID: number, threadID: number, pkg?: string) {
    const data = [new LispID('swank:sldb-abort')]
    return emacsRex(msgID, toWire(data), new LispID(pkg ?? 'nil'), threadID)
}

export function debugThreadReq(msgID: number, threadNdx: number, pid: number, pkg?: string) {
    const data = [new LispID('swank:start-swank-server-in-thread'), threadNdx, `/tmp/slime.${pid}`]
    return emacsRex(msgID, toWire(data), new LispID(pkg ?? 'nil'), true)
}