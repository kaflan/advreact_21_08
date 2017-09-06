import {appName} from '../config'
import {Record, List} from 'immutable'
import {put, call, takeEvery, take} from 'redux-saga/effects'
import {generateId, fbDatatoEntities} from './utils'
// import {createSelector} from 'reselect'
import {reset} from 'redux-form'
import firebase from 'firebase'

const ReducerState = Record({
    entities: new List([]),
    loading: false,
    loaded: false
})

const PersonRecord = Record({
    id: null,
    firstName: null,
    lastName: null,
    email: null
})

export const moduleName = 'people'
const prefix = `${appName}/${moduleName}`
export const ADD_PERSON_REQUEST = `${prefix}/ADD_PERSON_REQUEST`
export const ADD_PERSON = `${prefix}/ADD_PERSON`
export const ADD_ERROR = `${prefix}/ADD_ERROR`
export const FETCH_REQUEST = `${prefix}/FETCH_REQUEST`
export const FETCH_SUCCESS = `${prefix}/FETCH_LAZY_SUCCESS`

export default function reducer(state = new ReducerState(), action) {
    const {type, payload} = action

    switch (type) {
        case FETCH_REQUEST:
          return state
            .set('loading', true)
        case FETCH_SUCCESS:
          return state
          .set('loading', false)
          .set('loaded', true)
          .mergeIn(['entities'], fbDatatoEntities(payload, PersonRecord))
        case ADD_PERSON:
            return state.update('entities',
                entities => entities.push(new PersonRecord(payload)))
        default:
            return state
    }
}

export function addPerson(person) {
    return {
        type: ADD_PERSON_REQUEST,
        payload: person
    }
}

export const addPersonSaga = function * (action) {
    const id = yield call(generateId)
    const ref = firebase.database().ref('/users')

    const data = yield call([ref, ref.once], ref.push({...action.payload, id}))

    try {
      yield put({
        type: ADD_PERSON,
        payload: data.val()
      })
      yield put(reset('person'))
    } catch (error) {
      yield put({
        type: ADD_ERROR,
        error
      })
    }
}

export const fetchPersonSaga = function * (action) {
  while (true) {
    yield take(FETCH_REQUEST)

    const ref = firebase.database().ref('/users')

    const data = yield call([ref, ref.once], 'value')

    yield put({
      type: FETCH_SUCCESS,
      payload: data.val()
    })
  }
}

/*
export function addPerson(person) {
    return (dispatch) => {
        dispatch({
            type: ADD_PERSON,
            payload: {
                person: {id: Date.now(), ...person}
            }
        })
    }
}
*/

export const saga = function * () {
    yield takeEvery(ADD_PERSON_REQUEST, addPersonSaga)
}
