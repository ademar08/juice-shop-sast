/*
 * Archivo de demostración para el laboratorio SAST con Bearer.
 * VULNERABILIDAD INTENCIONAL: ejecuta eval() con un parámetro de la petición (CWE-95).
 */
import { type Request, type Response } from 'express'

export function calcular () {
  return (req: Request, res: Response) => {
    const expresion = req.query.expr as string
    const resultado = eval(expresion)
    res.json({ resultado })
  }
}
