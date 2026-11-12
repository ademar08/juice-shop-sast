/*
 * Archivo de demostración para el laboratorio SAST con Bearer.
 * CORREGIDO: ya no usa eval(). Se valida la entrada y se evalúa con un
 * analizador aritmético propio que solo acepta números y + - * /.
 */
import { type Request, type Response } from 'express'

const EXPRESION_VALIDA = /^\s*\d+(\.\d+)?(\s*[-+*/]\s*\d+(\.\d+)?)*\s*$/

function evaluarAritmetica (expresion: string): number {
  const tokens = expresion.match(/\d+(\.\d+)?|[-+*/]/g) ?? []
  // Primero multiplicaciones y divisiones, luego sumas y restas
  const pila: number[] = [Number(tokens[0])]
  for (let i = 1; i < tokens.length; i += 2) {
    const operador = tokens[i]
    const valor = Number(tokens[i + 1])
    if (operador === '*') pila.push(pila.pop()! * valor)
    else if (operador === '/') pila.push(pila.pop()! / valor)
    else if (operador === '-') pila.push(-valor)
    else pila.push(valor)
  }
  return pila.reduce((a, b) => a + b, 0)
}

export function calcular () {
  return (req: Request, res: Response) => {
    const expresion = String(req.query.expr ?? '')
    if (!EXPRESION_VALIDA.test(expresion)) {
      res.status(400).json({ error: 'Expresión no válida' })
      return
    }
    res.json({ resultado: evaluarAritmetica(expresion) })
  }
}
