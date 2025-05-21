export interface IMouseBubbleController {
  /**
   * Inicia el seguimiento del movimiento del mouse y la animación.
   * Este método agrega un listener para el evento de movimiento del mouse y comienza la animación
   * del elemento interactivo.
   */
  start(): void;
  /**
   * Detiene el seguimiento del movimiento del mouse y la animación.
   * Este método elimina el listener del evento de movimiento del mouse y cancela la animación
   * si está en curso.
   */
  stop(): void;
}
