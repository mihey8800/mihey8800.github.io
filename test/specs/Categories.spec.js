import axios from 'axios'
import { shallowMount } from '@vue/test-utils'
import categories from 'api/mock/data/categories.json'
import Categories from '@/components/Categories'
const MockAdapter = require('axios-mock-adapter')
const mock = new MockAdapter(axios)
describe('Categories', () => {
  afterAll(() => {
    mock.restore()
  })
  beforeEach(() => {
    mock.reset()
  })

  it('loads categories', async () => {
    mock.onGet('/v1/categories/tree').reply(200, categories)
    const wrapper = shallowMount(Categories)
    await wrapper.vm.loadCategories()
    const listItems = wrapper.findAll('li')
    expect(listItems).toHaveLength(3)
  })
})
