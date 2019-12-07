<!-- prettier-ignore -->
<template>
  <div class="tree">
    <div :class="iconClasses" class="label-wrapper" @click="toggleChildren">
      <div :style="indent" :class="labelClasses">
        <i v-if="children" class="fa"></i>
        {{ name }}
      </div>
    </div>
    <Tree
      v-for="child in children"
      :key="child.id" 
      :children="child.children" 
      :name="child.name"
      :depth="depth + 1"   
    >
    {{child.name}}
    </Tree>
  </div>
</template>

<script>
/* eslint-disable prettier/prettier */
import Tree from "./Tree";
export default { 
    name: 'Tree',
    components: {
    Tree
  },
    props: ['id', 'name', 'price_multiplier', 'depth', 'game_id', 'created_at', 'updated_at', 'sort', 'commission', 'show_price', 'show_count', 'show_time', 'multiple_sale', 'status', 'parent_id', 'is_instant_delivery', 'is_allow_multiple_offers', 'isFinal', 'children' ],
  data() {
     return {
       showChildren: false
     }
  },
  computed: {
    iconClasses() {
      return {
        'fa-plus-square-o': !this.showChildren,
        'fa-minus-square-o': this.showChildren
      }
    },
    labelClasses() {
      return { 'has-children': this.children }
    },
    indent() {
      return { transform: `translate(${this.depth * 50}px)` }
    }
  },
  methods: {
    toggleChildren() {
       this.showChildren = !this.showChildren;
    }
  }
}
</script>