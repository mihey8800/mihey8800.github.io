/* eslint-disable prettier/prettier */
import categoriesJson from '@/api/mock/data/categories.json'
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
export const state = () => ({
  categories: []
})
const mock = new MockAdapter(axios);
mock.onGet('/v1/categories/tree').reply(200, {
  categories: categoriesJson
});
export const mutations = {
  setCategoriesTree (state, text) {
    state.categories = text
  },
}

export const actions = {
   getCategories({ commit }) {
    return axios.get('/v1/categories/tree').then((response) => {
      commit('setCategoriesTree', response.data.categories)
    })
  }
}
