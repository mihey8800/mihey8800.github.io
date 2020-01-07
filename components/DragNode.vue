<!-- prettier-ignore -->
<template>
  <div :style='styleObj' :draggable='isDraggable' @drag.stop='drag' @dragstart.stop='dragStart' @dragover.stop='dragOver' @dragenter.stop='dragEnter' @dragleave.stop='dragLeave' @drop.stop='drop' @dragend.stop='dragEnd' class='dnd-container'>
    <div @click="toggle" @mouseover='mouseOver' @mouseout='mouseOut' @dblclick="changeType">
      <div :style="{ 'padding-left': (depth - 1) * 24 + 'px' }" :id='model.id' class='treeNodeText'>
        <slot :nodeName="model.name" :isClicked='isClicked'>
          <div :class='{"is-clicked": isClicked,"is-hover":isHover}' class="card" style="width: 18rem;">
            <div class="card-body">
              <h5 class="card-title">{{ model.name }}</h5>
                <h6 class="card-subtitle mb-2 text-muted">Игра: <span class="price">{{model.game_id}}</span></h6>
                <h6 class="card-subtitle mb-2 text-muted">Комиссия сервиса: <span class="price">{{model.commission}}</span></h6>
                <div class="row">
                    <div class="col">Создано: {{createdMoment}}</div>
                    <div class="col">Обновлено: {{updatedMoment}}</div>                     
                </div>
                <div class="row">
                    <div class="col">
                        <br>
                        <h6 class="card-subtitle mb-2 text-muted"> Настройки</h6>
                        <b-form-checkbox v-model="showPrice" v-bind:true-value="1" v-bind:false-value="0" switch>Показывать цену</b-form-checkbox>
                        <b-form-checkbox v-model="showCount" v-bind:true-value="1" v-bind:false-value="0" switch>Показывать количество</b-form-checkbox>
                        <b-form-checkbox v-model="showTime" v-bind:true-value="1" v-bind:false-value="0" switch>Показывать время</b-form-checkbox>
                        <b-form-checkbox v-model="multipleSale" v-bind:true-value="1" v-bind:false-value="0" switch>Можно продавать несколько раз</b-form-checkbox>
                        <b-form-checkbox v-model="status" v-bind:true-value="1" v-bind:false-value="0" switch><p v-if="model.status == 1">Видна всем</p><p v-if="model.status == 0">Не видна</p></b-form-checkbox>
                        <b-form-checkbox v-model="instantDelivery" v-bind:true-value="1" v-bind:false-value="0" switch>Моментальная доставка</b-form-checkbox>
                        <b-form-checkbox v-model="allowMultipleOffers" v-bind:true-value="1" v-bind:false-value="0" switch>Можно создать несколько предложений в этой категории</b-form-checkbox>
                    </div>                   
                </div>
                <div class="row ">
                    <div class="col d-flex justify-content-end">
                        <span v-if="isFolder" :class="[isClicked ? 'nodeClicked' : '','vue-drag-node-icon']"></span>
                    </div>
                </div>
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
import Vue from 'vue'
import VueMoment from 'vue-moment'
import moment from 'moment'
Vue.use(VueMoment, { moment })

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
            default: () => { }
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
        isShown() {
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
        },
        createdMoment(){
            return moment(this.model.created_at).format('DD.MM.YYYY');
        },
        updatedMoment(){
            return moment(this.model.updated_at).format('DD.MM.YYYY');
        },
        showPrice:{
            get() {
                return this.model.show_price === 1
            },
            set(newValue){
                this.model.show_price = newValue
            }
        },
        showCount:{
            get() {
                return this.model.show_count === 1
            },
            set(newValue){
                this.model.show_count = newValue
            }
        },
        showTime:{
            get() {
                return this.model.show_time === 1
            },
            set(newValue){
                this.model.show_time = newValue
            }
        },
        multipleSale:{
            get() {
                return this.model.multiple_sale === 1
            },
            set(newValue){
                this.model.multiple_sale = newValue
            }
        },
        status:{
            get() {
                return this.model.status === 1
            },
            set(newValue){
                this.model.status = newValue
            }
        },
        instantDelivery:{
            get() {
                return this.model.is_instant_delivery === 1
            },
            set(newValue){
                this.model.is_instant_delivery = newValue
            }
        },
        allowMultipleOffers:{
            get() {
                return this.model.is_allow_multiple_offers === 1
            },
            set(newValue){
                this.model.is_allow_multiple_offers = newValue
            }
        },
    },
    created() {
        rootTree = this.findRoot(this);
    },
    methods: {
        toggle() {
            if (this.isFolder) {
                this.open = !this.open;
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
                // this.$set(this.model, "children", []);
                // this.addChild();
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
                href: "#take-me-somewhere",
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
            this.exchangeData(rootTree, fromData, toData);
            rootTree.emitDrop(this.model, this, e);
        },
        dragEnd(e) {
            rootTree.emitDragEnd(this.model, this, e);
        },
        findRoot(which) {
            let ok = false;
            let that = which;
            while (!ok) {
                if (that.$options._componentTag === "Categories") {
                    ok = true;
                    break;
                }
                that = that.$parent;
            }
            return that;

        },
        hasInclude(from, to) {
            return from.$parent._uid === to._uid;
        },
        isLinealRelation(from, to) {
            let parent = from.$parent;
            let ok = false;
            let status = false;
            while (!ok) {
                if (parent._uid === to._uid) {
                    ok = true;
                    status = true;
                    continue;
                }
                if (
                    !parent.$options._componentTag ||
                    parent.$options._componentTag === "Categories"
                ) {
                    ok = true;
                    break;
                }
                parent = parent.$parent;
            }

            return status;
        },
        exchangeData(rootCom, from, to) {
            if (from._uid === to._uid) {
                return;
            }

            if (this.hasInclude(to, from)) {
                return;
            }

            const newFrom = Object.assign({}, from.model);

            if (this.hasInclude(from, to)) {
                const tempParent = to.$parent;
                const toModel = to.model;

                if (tempParent.$options._componentTag === "Categories") {
                    tempParent.newData.push(newFrom);
                    const newChildren = toModel.children.filter(
                        item => item.id !== newFrom.id
                    );
                    this.$store.dispatch({ type: "categories/setNewChildren", category: toModel, newChildren })
                    return;
                }

                const toParentModel = tempParent.model;
                const newChildren = toModel.children.filter(item => item.id !== newFrom.id);
                this.$store.dispatch({ type: "categories/concatChildren", category: toParentModel, newChildren })
                return;
            }

            if (this.isLinealRelation(from, to)) {
                const fromParentModel = from.$parent.model;
                // eslint-disable-next-line no-unused-vars
                const toModel = to.model;

                const newChildren = fromParentModel.children.filter(
                    item => item.id !== newFrom.id
                );

                this.$store.dispatch({ type: "categories/concatChildren", category: fromParentModel, newChildren })

                return;
            }

            const fromParentModel = from.$parent.model;
            const toModel = to.model;
            if (from.$parent.$options._componentTag === "Categories") {
              from.$parent.newData = from.$parent.newData.filter(
                item => item.id !== newFrom.id
              )
            } else {
              this.$store.dispatch({ type: "categories/setNewChildren", category: fromParentModel, newChildren: fromParentModel.children.filter(
                    item => item.id !== newFrom.id
                ) })
            }

            if (!toModel.children) {
                this.$store.dispatch({ type: "categories/setNewChildren", category: toModel, newChildren: [newFrom] })
            } else {
                this.$store.dispatch({ type: "categories/concatChildren", category: toModel, newChildren: [newFrom] })
            }

        }

    }
};
</script>