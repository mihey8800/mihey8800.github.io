<!-- prettier-ignore -->
<template>
  <div>
    <Tree 
             :children="categories.categories" 
             :depth="0"
             ></Tree>
  </div>
</template>
<script>
/* eslint-disable prettier/prettier */
import { mapMutations } from 'vuex'
import Tree from "./Tree";
export default {
  components: {
    Tree
  },
  watchQuery: true,
  computed: {
    categories () {
      this.UpdateCategories()
      return this.$store.state.categories
    },
    tree(){
      return {name: 'root', children:[
    {
      name: 'item1',
      children: [
        {
          name: 'item1.1'
        },
        {
          name: 'item1.2',
          children: [
            {
              name: 'item1.2.1'
            }
          ]
        }
      ]
    }, 
    {
      name: 'item2'  
    }
  ]}
    }
  },
  methods: {
    UpdateCategories(){
        return this.$store.dispatch("categories/getCategories")
    },
    ...mapMutations({
      getCategories: 'categories/getCategories'
    })
  }
}
</script>
