const initialState = {
  good: 0,
  ok: 0,
  bad: 0
}

     // The ...state basically corresponds to this:
      // return {
      //   good: state.good + 1,
      //   ok: state.ok,
      //   bad: state.bad
      // }

const counterReducer = (state = initialState, action) => {
  console.log(action)
  switch (action.type) {
    case 'GOOD':
      return { ...state, good: state.good + 1 }
    case 'OK':
      console.log('Ok clicked')
      return { ...state, ok: state.ok + 1 }
    case 'BAD':
      console.log('Bad clicked')
      return { ...state, bad: state.bad + 1 }
    case 'ZERO':
      console.log('Zero clicked')
      // all zero
      return initialState
    default: return state
  }
  
}

export default counterReducer
