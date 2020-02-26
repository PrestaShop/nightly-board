/* eslint-disable */
import URLS from '~/constants/urls'
const REPORT_URL_API = URLS.domain + URLS.reports

export const strict = false

export const state = () => {
  let localConfig = {
    isShowSuccess: true,
    isShowPending: true,
    isShowFailed: true,
    isDark: false
  }

  return {
    pageTitle: 'Nightly Board',
    startDate: null,
    endDate: null,
    localConfig,
    testsOpened: [],
    searchOpened: [],
    search: '',
    graph: {
      period: '',
      version: ''
    },
    graphDatasets: {},
    report: {}
  }
}

function toggleTests(state, values) {
  console.log(values.suite)
  Object.keys(values.suite.suites).forEach(e => {
    if (!state.testsOpened.includes(values.suite.suites[e].id)) {
      state.testsOpened.push(values.suite.suites[e].id)

      if (values.suite.suites[e].suites) {
        toggleTests(state, {suite: values.suite.suites[e], show: true})
      }
    } else if (!values.show) {
      const indexToDelete = state.testsOpened.indexOf(values.suite.suites[e].id)
      state.testsOpened = [...state.testsOpened.slice(0, indexToDelete), ...state.testsOpened.slice(indexToDelete + 1)]
    }
  })
}

export const mutations = {
  changePageTitle(state, pageTitle) {
    state.pageTitle = pageTitle
  },
  changeDate(state, dates) {
    Object.assign(state, dates)
  },
  changeLocalConfig(state, config) {
    Object.assign(state.localConfig, config)

    localStorage.setItem('localConfig', JSON.stringify(state.localConfig))
  },
  toggleTests(state, values) {
    if (!state.testsOpened.includes(values.suite.id)) {
      state.testsOpened.push(values.suite.id)

      if (values.suite.suites) {
        toggleTests(state, values)
      }
    } else if (!values.show) {
      const indexToDelete = state.testsOpened.indexOf(values.suite.id)
      state.testsOpened = [...state.testsOpened.slice(0, indexToDelete), ...state.testsOpened.slice(indexToDelete + 1)]
    }
  },
  updateSearch(state, values) {
    state.search = values
  },
  toggleSearch(state, values) {
    if (!state.searchOpened.includes(values.suite.id)) {
      state.searchOpened.push(values.suite.id)
    } else if (!values.show) {
      const indexToDelete = state.searchOpened.indexOf(values.suite.id)
      state.searchOpened = [...state.searchOpened.slice(0, indexToDelete), ...state.searchOpened.slice(indexToDelete + 1)]
    }
  },
  toggleGraphFilter(state, values) {
    Object.assign(state.graph, values.value)
  },
  async getSuites(state, values) {
    let url = `${REPORT_URL_API}/${values.params.id}`
    let hasParams = false
    let counter = 0
    state.report = {}

    Object.keys(state.localConfig).forEach(e => {
      if (state.localConfig[e]) {
        if (!hasParams) {
          url += '?'
        } else {
          url += '&'
        }

        switch (e) {
          case 'isShowSuccess':
            url += `filter_state[${counter}]=passed`

            break
          case 'isShowPending':
            url += `filter_state[${counter}]=pending`

            break
          case 'isShowFailed':
            url += `filter_state[${counter}]=failed`

            break
          default:
        }

        hasParams = true
        counter += 1
      }
    })

    if (state.search !== '') {
      if (hasParams) {
        url += `&search=${state.search}`
      } else {
        url += `?search=${state.search}`
      }
    }

    try {
      const {data} = await this.$axios.get(url, {
        crossdomain: true
      })

      state.pageTitle = `Report - ${this.$moment(data.date).format('DD/MM/YYYY')}`

      Object.assign(state, {
        startDate: this.$moment(data.start_date).format('DD/MM/YYYY hh:mm'),
        endDate: this.$moment(data.end_date).format('DD/MM/YYYY hh:mm')
      })

      state.report = data
    } catch (error) {
      state.report = false
    }
  },
  resetReport(state) {
    state.report = false
  }
}
