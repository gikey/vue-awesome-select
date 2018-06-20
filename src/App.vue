<template>
    <div class="container">
      <v-select class="vselect" :options="options" v-model="selected" max="3"></v-select>
    </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      options: [{
        label: 'option1',
        value: '1'
      }, {
        label: 'option2',
        value: '2'
      }, {
        label: 'option3',
        value: '3'
      }, {
        label: 'option4',
        value: '4'
      }],
      selected: '1'
    }
  }
}
</script>

<style lang="scss" scoped>

</style>


