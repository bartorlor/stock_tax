import state from '../state'
import router from '../router'
import {debug} from '../utils/logging'
let baseUrl

export async function $fetch (url, options) {
  debug(`fetch url :${JSON.stringify(url)}`)
  const finalOptions = Object.assign({}, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  }, options)
  const response = await fetch(`${baseUrl}${url}`, finalOptions)
  debug(`fetch response :${JSON.stringify(response)}`)
  if (response.ok) {
    let data = await response.json()
    // if(!fetch){
      debug(`fetch data :${JSON.stringify(data)}`)
    // }
    if(data !== null && typeof data.metadata !== 'undefined'){
      data = data.records
    }
    return data
  } else if (response.status === 403) {
    // If the session is no longer valid
    // We logout
    state.user = null

    // If the route is private
    // We go to the login screen
    if (router.currentRoute.matched.some(r => r.meta.private)) {
      router.replace({ name: 'login', params: {
        wantedRoute: router.currentRoute.fullPath,
      }})
    }
  } else {
    const message = await response.text()
    const error = new Error(message)
    error.response = response
    throw error
  }
}

export default {
  install (Vue, options) {
    console.log('Installed!', options)

    // Plugin options
    baseUrl = options.baseUrl

    // Fetch
    Vue.prototype.$fetch = $fetch
  },
}
