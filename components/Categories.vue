<!-- prettier-ignore -->
<template>
  <div id="categories-list">
    <template v-for="(item) in newData">
      <drag-node
        :model="item"
        :allowDrag="allowDrag"
        :allowDrop="allowDrop"
        :depth="increaseDepth"
        :defaultText="defaultText"
        :disableDBClick="disableDBClick"
        :key="item.id"
        v-slot="slotProps"
      >
        <slot :nodeName="slotProps.nodeName" :isClicked="slotProps.isClicked"></slot>
      </drag-node>
    </template>
  </div>
</template>
<script>
/* eslint-disable prettier/prettier */
import Vue from 'vue'
import Sortable from 'vue-sortable'
import DragNode from './DragNode'
Vue.use(Sortable)
export default {
  components: {
    DragNode
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    allowDrag: {
      type: Function,
      default: () => true
    },
    allowDrop: {
      type: Function,
      default: () => true
    },
    defaultText: {
      type: String,
      default: 'New Node'
    },
    depth: {
      type: Number,
      default: 0
    },
    disableDBClick: {
      type: Boolean,
      default: false
    }
  },
  watchQuery: true,
  computed: {
    increaseDepth() {
      return this.depth + 1
    },
    newData: {
      get() {
        if (this.data.length === 0) {
          this.InitCategories()
        }
        return this.data
      },
      set(newValue) {
        const length = this.data.length
        for (let i = 0; i < length; i++) {
          this.data.shift(i)
        }
        this.data = Object.assign(this.data, newValue)
        this.$store.dispatch({
          type: 'categories/setCategories',
          categories: newValue
        })
      }
    }
  },
  mounted() {
    if (process.browser) {
      const Sortable = require('sortablejs').default
      const el = document.getElementById('categories-list')
      this.sortable = Sortable.create(el, {})
    }
  },
  methods: {
    InitCategories() {
      this.$store.dispatch('categories/initCategories')
      this.newData = JSON.parse(
        JSON.stringify(this.$store.getters['categories/categoriesSortedGetter'])
      )
    },
    setData() {
      const categories = {
        categories: JSON.parse(
          JSON.stringify(
            this.$store.getters['categories/categoriesSortedGetter']
          )
        )
      }
      this.$set(this.data, 0, categories)
      return this.data
    },
    emitCurNodeClicked(model, component) {
      this.$emit('current-node-clicked', model, component)
    },
    emitDrag(model, component, e) {
      this.$emit('drag', model, component, e)
    },
    emitDragEnter(model, component, e) {
      this.$emit('drag-enter', model, component, e)
    },
    emitDragLeave(model, component, e) {
      this.$emit('drag-leave', model, component, e)
    },
    emitDragOver(model, component, e) {
      this.$emit('drag-over', model, component, e)
    },
    emitDragEnd(model, component, e) {
      this.$emit('drag-end', model, component, e)
    },
    emitDrop(model, component, e) {
      this.$emit('drop', model, component, e)
    }
  }
}
</script>
