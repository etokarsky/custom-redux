const counter = document.querySelector('#counter')
const upBtn = document.querySelector('#up')
const downBtn = document.querySelector('#down')
const themeBtn = document.querySelector('#theme')

// TYPES
const INCREMENT = 'INCREMENT'
const DECREMENT = 'DECREMENT'
const CHANGE_THEME = 'CHANGE_THEME'

// ACTION CREATORS
function increment() {
	return {
		type: INCREMENT
	}
}

function decrement() {
	return {
		type: DECREMENT
	}
}

function changeTheme(payload) {
	return {
		type: CHANGE_THEME,
		payload: payload
	}
}

// REDUCERS
// COUNTER REDUCER
function counterReducer(state = 0, action) {
	switch (action.type) {
		case INCREMENT:
			return state + 1
			break
		case DECREMENT:
			return state - 1
			break
		default:
			return state
	}
}

// THEME REDUCER
const initialThemeState = {
	value: 'light'
}

function themeReducer(state = initialThemeState, action) {
	switch (action.type) {
		case CHANGE_THEME:
			state = { ...state, value: action.payload }
			return state
			break
		default:
			return state
	}
}

// COMBINE REDUCERS
function combineReducers(obj) {
	return function (state, action) {
		// initialization
		if (!state) {
			state = {}
		}

		// [counterState, themeState]
		const keys = Object.keys(obj)
		keys.forEach(key => {
			state[key] = obj[key](state[key], action)
		})

		return state
	}
}

const rootReducer = combineReducers({
	counterState: counterReducer,
	themeState: themeReducer
})

// CREATE STORE
function createStore(rootReducer, initialState) {
	const listeners = []
	let state = rootReducer(initialState, { type: '__INIT__' })

	return {
		dispatch(action) {
			state = rootReducer(state, action)
			listeners.forEach(fn => fn())
		},
		subscribe(listener) {
			listeners.push(listener)
		},
		getState() {
			return state
		}
	}
}

const store = createStore(rootReducer)

store.subscribe(() => {
	const state = store.getState()
	counter.textContent = state.counterState
	document.body.className = state.themeState.value
})

// INIT DISPATCH
store.dispatch({ type: 'INIT_APPLICATION' })

// INDEX PAGE
upBtn.addEventListener('click', () => {
	store.dispatch(increment())
})

downBtn.addEventListener('click', () => {
	store.dispatch(decrement())
})

themeBtn.addEventListener('click', () => {
	const newTheme = document.body.classList.contains('light')
		? 'dark'
		: 'light'

	store.dispatch(changeTheme(newTheme))
})