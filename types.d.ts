export default class Trackball {
  constructor(
    el: HTMLElement,
    options: {
      homeTilt?: number,
      startSpin?: number,
      autoTick?: boolean,
      friction?: number
    },
  )
  getMatrix(): number[]
}
