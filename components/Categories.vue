<!-- prettier-ignore -->
<template>
    <div>
      <template v-for='(item,index) in newData'>
          <drag-node :model='item' :allowDrag='allowDrag' :allowDrop='allowDrop' :depth='increaseDepth' :defaultText='defaultText' :disableDBClick='disableDBClick' :key='index' v-slot='slotProps'>
            <slot :nodeName="slotProps.nodeName" :isClicked='slotProps.isClicked'></slot>
          </drag-node>
      </template>
    </div>
</template>
<script>
/* eslint-disable prettier/prettier */
import { mapMutations } from 'vuex'
import DragNode from "./DragNode";

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
      default: "New Node"
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
    categories () {
      this.UpdateCategories();
      return this.$store.state.categories
    },
    increaseDepth() {
      return this.depth + 1;
    },
    newData: {
      get() {
        return this.data;
      },
      set(newValue) {
        const length = this.data.length;
        for (let i = 0; i < length; i++) {
          this.data.shift(i);
        }
        this.data = Object.assign(this.data, newValue);
        this.$store.dispatch({type: "categories/setCategories", categories: newValue})
      }
    }
  },
  created(){
    this.UpdateCategories();
    this.newData = Object.assign(this.newData, this.categories.categories);
  },
  methods: {
    UpdateCategories(){
        return this.$store.dispatch("categories/getCategories")
    },
    emitCurNodeClicked(model, component) {
      this.$emit("current-node-clicked", model, component);
    },
    emitDrag(model, component, e) {
      this.$emit("drag", model, component, e);
    },
    emitDragEnter(model, component, e) {
      this.$emit("drag-enter", model, component, e);
    },
    emitDragLeave(model, component, e) {
      this.$emit("drag-leave", model, component, e);
    },
    emitDragOver(model, component, e) {
      this.$emit("drag-over", model, component, e);
    },
    emitDragEnd(model, component, e) {
      this.$emit("drag-end", model, component, e);
    },
    emitDrop(model, component, e) {
      this.$emit("drop", model, component, e);
    },
    ...mapMutations({
      getCategories: 'categories/getCategories'
    })
  }
}
</script>
