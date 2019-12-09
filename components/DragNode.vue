<!-- prettier-ignore -->
<template>
  <div v-if='isShown' :style='styleObj' :draggable='isDraggable' @drag.stop='drag' @dragstart.stop='dragStart' @dragover.stop='dragOver' @dragenter.stop='dragEnter' @dragleave.stop='dragLeave' @drop.stop='drop' @dragend.stop='dragEnd' class='dnd-container'>
    <div @click="toggle" @mouseover='mouseOver' @mouseout='mouseOut' @dblclick="changeType">
      <div :style="{ 'padding-left': (depth - 1) * 24 + 'px' }" :id='model.id' class='treeNodeText'>
        <slot :nodeName="model.name" :isClicked='isClicked'>
          <div :class='{"is-clicked": isClicked,"is-hover":isHover}' class="card" style="width: 18rem;">
            <div class="card-body">
              <h5 class="card-title">{{ model.name }}</h5>
                <h6 class="card-subtitle mb-2 text-muted">Игра: <span class="price">{{model.game_id}}</span></h6>
                  <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                  <p v-if="model.is_instant_delivery === 1" class="delivery" >Моментальная доставка!</p>
                  <span v-if="isFolder" :class="[isClicked ? 'nodeClicked' : '','vue-drag-node-icon']"></span>  
            </div>
          </div>
          
        </slot>
      </div>
    </div>
    <div v-show="open" v-if="isFolder" class='treeMargin'>
      <drag-node v-for="item2 in model.children" :allowDrag='allowDrag' :allowDrop='allowDrop' :depth='increaseDepth' :model="item2" :key='item2.id' :defaultText='defaultText' :disableDBClick='disableDBClick'>
      </drag-node>
    </div>
  </div>
</template>

<script>
/* eslint-disable prettier/prettier */
import { findRoot, exchangeData } from "@/assets/js/utils";
let id = 1000;
let fromData = null;
let toData = null;
let nodeClicked = null;
let rootTree = null;


export default {
  name: "DragNode",
  props: {
    model: {
      type: Object,
      default: () => {}
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
  data() {
    return {
      open: false,
      isClicked: false,
      isHover: false,
      styleObj: {
        opacity: 1
      }
    };
  },
  computed: {
    isShown(){
      return this.model.status === 1
    },
    isFolder() {
      return !this.model.isFinal;
    },
    increaseDepth() {
      return this.depth + 1;
    },
    isDraggable() {
      return this.allowDrag(this.model, this);
    }
  },
  created() {
    rootTree = findRoot(this);
  },
  methods: {
    toggle() {
      if (this.isFolder) {
        this.open = !this.open;
        this.model.isFinal = !this.model.isFolder
      }
      rootTree.emitCurNodeClicked(this.model, this);
      this.isClicked = !this.isClicked;
      if (nodeClicked !== this.model.id) {
        const treeParent = rootTree.$parent;
        let nodeStack = [treeParent.$children[0]];
        while (nodeStack.length !== 0) {
          const item = nodeStack.shift();
          item.isClicked = false;
          if (item.$children && item.$children.length > 0) {
            nodeStack = nodeStack.concat(item.$children);
          }
        }
        this.isClicked = true;
        nodeClicked = this.model.id;
      }
    },

    changeType() {
      if (this.disableDBClick) {
        return;
      }
      if (this.currentHighlight) {
        nodeClicked = this.model.id;
      }
      if (!this.isFolder) {
        this.$set(this.model, "children", []);
        this.addChild();
        this.open = true;
        this.isClicked = true;
      }
    },
    mouseOver(e) {
      this.isHover = true;
    },
    mouseOut(e) {
      this.isHover = false;
    },
    addChild() {
      this.model.children.push({
        name: this.defaultText,
        href:"#take-me-somewhere",
        id: id++
      });
    },
    removeChild(id) {
      let parentModelChildren = this.$parent.model.children;
      for (const index in parentModelChildren) {
        if (parentModelChildren[index].id === id) {
          parentModelChildren = parentModelChildren.splice(index, 1);
          break;
        }
      }
    },
    drag(e) {
      fromData = this;
      rootTree.emitDrag(this.model, this, e);
    },
    dragStart(e) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", "asdad");
      return true;
    },
    dragOver(e) {
      e.preventDefault();
      rootTree.emitDragOver(this.model, this, e);
      return true;
    },
    dragEnter(e) {
      if (this._uid !== fromData._uid) {
        this.styleObj.opacity = 0.5;
      }
      rootTree.emitDragEnter(this.model, this, e);
    },
    dragLeave(e) {
      this.styleObj.opacity = 1;
      rootTree.emitDragLeave(this.model, this, e);
    },
    drop(e) {
      e.preventDefault();
      this.styleObj.opacity = 1;
      if (!this.allowDrop(this.model, this)) {
        return;
      }
      toData = this;
      exchangeData(rootTree, fromData, toData);
      rootTree.emitDrop(this.model, this, e);
    },
    dragEnd(e) {
      rootTree.emitDragEnd(this.model, this, e);
    }
  }
};
</script>