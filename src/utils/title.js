import {
  systemTitle
} from '../config/index'

export function changeTitle(name) {
  document.title = `${name}-${systemTitle}`
}