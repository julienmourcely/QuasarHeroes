import createStore from '../store'

export default async ({ app }) => {
  app.provide('store', createStore)
}
