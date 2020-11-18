import { Atom, valueToString, SExpr } from '../../lisp'
import { convert } from '../SwankUtils'
import { Return } from '../event/Return'

export class Eval {
    result: string[]

    constructor(result: string[]) {
        this.result = result
    }

    static parse(event: Return): Eval | undefined {
        if (event.info.status !== ':OK') {
            return undefined
        }

        const payload = event.info.payload

        if (!(payload instanceof SExpr)) {
            return undefined
        }

        const lines = []
        for (const item of payload.parts) {
            const expr = item as Atom
            const line = expr.value !== undefined ? valueToString(expr.value) : undefined

            if (line !== undefined) {
                const converted = convert(line)
                lines.push(`${converted}`)
            }
        }

        return new Eval(lines)
    }
}