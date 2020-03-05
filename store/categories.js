/* eslint-disable import/first */
/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
import MockAdapter from 'axios-mock-adapter'
import categoriesJson from '@/api/mock/data/categories.json'
const axios = require('axios');
export const state = () => ({
  categories: []
})

export const getters = {
  categoriesSortedGetter: state => {
    const sortKey = "sort";
    let sorted = JSON.parse(JSON.stringify(state.categories));
    // eslint-disable-next-line no-console
    sorted.sort((a, b) => {
      let compare = 0;
      if (a[sortKey] > b[sortKey]) {
        compare = 1;
      } else if (b[sortKey] > a[sortKey]) {
        compare = -1;
      }
      return compare;
    });
    return sorted
  }
}

const mock = new MockAdapter(axios);
mock.onGet('/v1/categories/tree').reply(200, {
  categories: categoriesJson
});
export const mutations = {
  setCategoriesTree(state, text) {
    state.categories = text
  },
  setNewChildren(state, context) {
    for (let currentCategory of context.contextState.categories) {
      if (currentCategory.id !== context.category.id) {
        for (let currentChild of currentCategory.children) {
          if (currentChild.id === context.category.id) {
            currentChild.children = context.children
            if (currentChild.children.length > 0) {
              currentChild.isFinal = false
            }
            if (currentChild.children.length === 0) {
              currentChild.isFinal = true
            }
            break
          }

        };
        continue
      } else {
        currentCategory.children = context.children
        if (currentCategory.children.length > 0) {
          currentCategory.isFinal = false
        }
        if (currentCategory.children.length === 0) {
          currentCategory.isFinal = true
        }
        break;
      }

    };

    state.categories = context.contextState.categories
  },
  concatChildren(state, context) {
    for (let currentCategory of context.contextState.categories) {
      if (currentCategory.id !== context.category.id) {
        for (let currentChild of currentCategory.children) {
          if (currentChild.id === context.category.id) {
            currentChild.children = currentChild.children.concat(context.children)
            if (currentChild.children.length > 0) {
              currentChild.isFinal = false
            }
            if (currentChild.children.length === 0) {
              currentChild.isFinal = true
            }
            break
          }

        };
        continue
      } else {
        currentCategory.children = currentCategory.children.concat(context.children)
        if (currentCategory.children.length > 0) {
          currentCategory.isFinal = false
        }
        if (currentCategory.children.length === 0) {
          currentCategory.isFinal = true
        }
        break;
      }

    };

    state.categories = context.contextState.categories
  },
}

export const actions = {
  initCategories({ commit }) {
    return axios.get('/v1/categories/tree').then((response) => {
      commit('setCategoriesTree', response.data.categories)
    })
  },
  setCategories({ commit, state }, categories) {
    commit('setCategoriesTree', categories.categories)
  },
  setNewChildren({ commit, state }, context) {
    const params = { category: context.category, children: context.newChildren, contextState: state }
    commit('setNewChildren', params)
  },
  concatChildren({ commit, state }, context) {
    const params = { category: context.category, children: context.newChildren, contextState: state }
    commit('concatChildren', params)
  }
}
