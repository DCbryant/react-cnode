import AppState from './app-state'

export const createStoreMap = () => {
    return {
        appState:new AppState()
    }
}