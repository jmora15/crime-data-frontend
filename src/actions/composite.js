import { updateFilters } from './filters'
import { fetchNibrs } from './nibrs'
import { fetchSummaries } from '../actions/summary'
import { fetchUcrParticipation } from '../actions/participation'
import { fetchAgencies } from '../actions/agencies'
import history, { createNewLocation } from '../util/history'
import { getPlaceId, validateFilter } from '../util/location'
import { shouldFetchAgencies } from '../util/agencies'
import offensesUtil from '../util/offenses'

import {
  shouldFetchNibrs,
} from '../util/participation'

const fetchData = () => (dispatch, getState) => {
  const { filters, region, states, agencies } = getState()
  if (region.loaded && states.loaded) {
    if (!filters.placeId) {
      filters.placeId = getPlaceId(filters, region.region, states.states);
    }
    if (offensesUtil.includes(filters.crime) && validateFilter(filters, region.regions, states.states)) {
      if (shouldFetchAgencies(filters) && agencies.locations !== filters.place && filters.placeType !== 'agency') dispatch(fetchAgencies(filters))
      dispatch(fetchUcrParticipation(filters))
      dispatch(fetchSummaries(filters))
      if (shouldFetchNibrs(filters)) dispatch(fetchNibrs(filters))
    }
  }
}

export const updateApp = (change, router) => dispatch => {
  dispatch(updateFilters(change))

  if (router) {
    const loc = createNewLocation({ change, router })
    if (window.caches) {
      caches
        .open('crime-data-explorer')
        .then(cache => cache.addAll([loc.pathname]))
    }
    history.push(loc)
  }

  return dispatch(fetchData())
}
