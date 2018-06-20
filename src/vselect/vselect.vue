<style lang="scss" scoped>
* {
    box-sizing: border-box;
}
.select {
    position: relative;
    vertical-align: middle;
    display: inline-block;
    font-size: 12px;
    height: 42px;
    &.top .dropmenu {
        top: 0;
        transform: translate(0, -100%);
    }
    &.bottom .dropmenu {
        bottom: 0;
        transform: translate(0, 100%);
    }
}

.multiple {
    width: 100%;
    .selected::before {
        content: "";
        position: absolute;
        width: 4px;
        height: 9px;
        border: 1px solid #505060;
        border-top: 0;
        border-left: 0;
        right: 15px;
        transform: rotate(45deg);
        top: 50%;
        margin-top: -6px;
    }
    .select-item {
        padding: 0 10px;
    }
    .input-control {
        border: 1px solid #d0d0d0;
        height: 100%;
        width: 100%;
        padding-left: 4px;
        border-radius: 2px;
        transition: border-color 0.3s;
        &::after {
            right: 10px;
        }
        &.focus {
            border-color: #505060;
        }
    }
    .dropmenu {
        padding: 0;
        width: 100%;
        border: 1px solid #505060;
        border-radius: 2px 0 0 2px;
    }
    &.top {
        .input-control {
            &.focus {
                border-radius: 0 0 2px 2px;
            }
        }
        .dropmenu {
            border-bottom: 0;
            border-radius: 2px 2px 0 0;
        }
    }
    &.bottom {
        .input-control {
            &.focus {
                border-radius: 2px 2px 0 0;
            }
        }
        .dropmenu {
            border-top: 0;
            border-radius: 0 0 2px 2px;
        }
    }
    .selected-tag {
        background-color: #c9daf7;
        margin-left: 6px;
        padding: 4px 5px 4px 5px;
        border-radius: 2px;
        color: #505060;
        position: relative;
        overflow: hidden;
    }
}

.input-control {
    font-size: 0;
    display: inline-block;
    position: relative;
    width: 100%;
    padding-right: 18px;
    white-space: nowrap;
    overflow: hidden;
    font-size: inherit;
    vertical-align: middle;
    &::after {
        content: "";
        position: absolute;
        width: 0;
        height: 0;
        right: 5px;
        top: 50%;
        margin-top: -2px;
        color: #505060;
    }
    .select-input {
        border: none;
        outline: none;
        width: auto;
        height: 100%;
        font-size: inherit;
        width: 3px;
        vertical-align: middle;
    }
    &.down::after {
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 5px solid;
    }
    &.up::after {
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-bottom: 5px solid;
    }
}

.dropmenu {
    position: absolute;
    background-color: white;
    border-radius: 2px;
    overflow: hidden;
    left: 0;
    font-size: inherit;
    padding: 10px 0;
    z-index: 2;
    ul {
        margin: 0;
        padding: 0;
        max-height: 120px;
        overflow: auto;
    }
    li {
        cursor: pointer;
        position: relative;
        list-style-type: none;
        height: 38px;
        line-height: 38px;
        padding: 0 24px;
        &:hover {
            background-color: #f3f3f3;
        }
    }
}

.selected-tag {
    font-size: inherit;
    display: inline-block;
    vertical-align: middle;
    outline: 0;
    font-size: inherit;
    &.selected-more {
        margin: 0;
        background-color: transparent;
        font-size: 0.857em;
        padding: 0.3em 0 0 0;
    }
    .selected-label {
        display: inline-block;
        max-width: 90px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: middle;
        margin-right: 20px;
    }
}

.selected-del {
    position: absolute;
    height: 100%;
    width: 24px;
    right: 0;
    top: 0;
    cursor: pointer;
    &::before {
        content: "";
        position: absolute;
        width: 1px;
        height: 14px;
        transform: rotate(45deg);
        left: 50%;
        top: 50%;
        background-color: #333;
        margin-top: -6px;
    }
    &::after {
        content: "";
        position: absolute;
        width: 1px;
        height: 14px;
        transform: rotate(-45deg);
        left: 50%;
        top: 50%;
        background-color: #333;
        margin-top: -6px;
    }
}
.placeholder {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 10px;
    color: #84848b;
}
</style>

<template>
  <div class="select multiple" :class="placement" v-outside-click="onSelectBlur">
    <span class="placeholder" v-show="mutableValue.length < 1">{{placeholder}}</span>
    <div class="input-control" :class="[isUp ? 'up' : 'down', { 'focus': dropMenuOpen } ]" @click="toggle">
      <span class="selected-tag" v-for="(option, index) in mutableValue" @click.stop v-if="index < max">
        <span class="selected-label">{{getOptionLabel(option)}}</span>
        <i class="selected-del" @click="deselect(option)"></i>
      </span>
      <span class="selected-tag selected-more" v-if="mutableValue.length > max">共有{{mutableValue.length}}个分组</span>

      <input ref="search" type="text" maxlength="0" class="select-input" @keydown.delete="deleteValue">

    </div>
    <div class="dropmenu" v-if="dropMenuOpen">
      <ul class="select-list">
        <li v-for="(option, idx) in options" @click="select(option)" class="select-item" :class="{'selected': isSelected(option)}">
          {{getOptionLabel(option)}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import './common.js'

export default {
  name: "vSelect",
  props: {
    value: {
      default: ""
    },

    placement: {
      type: String,
      default: "bottom"
    },

    options: {
      type: Array,
      default() {
        return []
      }
    },

    label: {
      type: String,
      default: "label"
    },

    val: {
      type: String,
      default: "value"
    },

    placeholder: {
      type: String,
      default: ''
    },

    max: {
      type: Number,
      default: 2
    }
  },

  data() {
    return {
      dropMenuOpen: false,
      isUp: false,
      mutableValue: []
    }
  },

  watch: {
    options() {
      this.mutableValue = this.getOption(this.value)
      this.$emit("input", this.mutableValue)
    }
  },

  computed: {
    isObjectArray() {
      return /\[object Object\]/.test(this.options.toString())
    }
  },

  created() {
    this.isUp = this.placement == "top"
    this.mutableValue = this.getOption(this.value)
    this.$emit("input", this.mutableValue)
  },

  directives: {
    outsideClick: {
      inserted(el, binding) {
        function documentHandler(e) {
          if (el.contains(e.target)) {
            return false
          }
          if (binding.expression) {
            binding.value(e)
          }
        }
        el.__vueOutsideClick__ = documentHandler
        document.addEventListener("click", documentHandler)
      },
      unbind: function (el, binding) {
        document.removeEventListener("click", el.__vueOutsideClick__)
        delete el.__vueClickOutside__
      }
    }
  },

  methods: {
    deleteValue() {
      this.mutableValue.pop()
    },

    deselect(option) {
      if (this.isObjectArray) {
        _.remove(this.mutableValue, option)
      } else {
        this.mutableValue.splice(this.mutableValue.indexOf(option), 1)
      }
      this.mutableValue = this.mutableValue.concat([])
      this.$emit("input", this.mutableValue)
    },

    isSelected(item) {
      if (this.isObjectArray) {
        return !!_.find(this.mutableValue, item)
      }
      return ~this.mutableValue.indexOf(item)
    },

    toggle() {
      this.isUp = !this.isUp
      this.dropMenuOpen = !this.dropMenuOpen
      this.dropMenuOpen
        ? this.$refs.search.focus()
        : this.$refs.search.blur()
    },

    select(item) {
      if (
        _.find(this.mutableValue, item) ||
        ~this.mutableValue.indexOf(item)
      ) {
        this.deselect(item)
      } else {
        this.mutableValue.push(item)
      }

      this.$emit("input", this.mutableValue)
    },

    onSelectBlur() {
      if (this.dropMenuOpen) {
        this.isUp = !this.isUp
        this.dropMenuOpen = false
        this.inputFocus = false
        this.$refs.search.blur()
      }
    },

    getOptionLabel(option) {
      if (typeof option === "object") {
        if (!option.hasOwnProperty(this.label)) {
          return console.warn(
            `Label key "option.${this.label}" does not exist`
          )
        }
        if (this.label) {
          return option[this.label]
        }
      } else if (typeof option === "string") {
        if (this.isObjectArray) {
          let obj = this.options.filter(
            item => option == item[this.val]
          )
          if (obj.length) {
            return obj[0][this.label]
          }
          return this.options[0][this.label]
        }
        return option
      }
      return option
    },

    getOption(option) {
      if (typeof option === "object") {
        if (option.constructor != Array) {
          return [option]
        }
        return option
      }
      let obj = this.options.filter(item => option == item[this.val])
      if (obj.length) {
        return obj
      }
      return []
    },

    getOptionValue(option) {
      if (typeof option === "object") {
        if (!option.hasOwnProperty(this.val)) {
          return console.warn(
            `Value key "option.${this.value}" does not exist`
          )
        }
        if (this.val) {
          return option[this.val]
        }
      } else if (typeof option === "string") {
        if (option) {
          return option
        }
        return this.options[0][this.val]
      }
    }
  }
}
</script>
