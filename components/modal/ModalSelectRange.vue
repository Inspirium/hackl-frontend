<template>
  <div>
    <div class="modal-title has-text-light">{{ title }}</div>
    <div class="modal-subtitle has-text-light m-b-20">
      {{ subtitle }}
    </div>
    <div class="filter-list p-b-75">
      <div :class="{ active: !selectedRange.length }" class="select-item" @click="selectAll">{{ $t('sve') }}</div>
      <div
        v-for="item in [0, 10, 20, 30, 40, 50, 60, 70, 80, 90]"
        :key="item"
        :class="selectedStyle(item)"
        class="select-item"
        @click="ageFiltered(item)"
      >
        <div>{{ item + ' ' + suffix }}</div>
      </div>
    </div>
    <div class="buttons is-fixed m-t-20">
      <b-button type="is-danger" rounded @click="$parent.close()"> {{ $t('zatvori') }} </b-button>
      <b-button type="is-primary" rounded @click="send"> {{ $t('filtriraj') }} </b-button>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'ModalSelectRange',
  props: {
    title: {
      type: String,
      required: true,
      default: 'Tip',
    },
    subtitle: {
      type: String,
      required: false,
      default: 'Filtriraj po tipu',
    },
    suffix: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      selectedRange: [],
      newSelect: '',
      newLabel: 'Sve',
    }
  },
  watch: {
    selectedRange(val) {
      if (val.length === 0) {
        this.newLabel = 'Sve'
      } else if (val.length === 1) {
        this.newLabel = val[0] + ' — ' + (val[0] + 10) + this.suffix
      } else if (val.length > 1) {
        this.newLabel = val[0] + ' — ' + val[1] + this.suffix
      }
    },
  },
  methods: {
    selectAll() {
      this.selectedRange = []
    },
    ageFiltered(age) {
      // here we add the selected age to our range
      // we want to add it in a way that if we already have a range
      // that it replaces the biggest or smallest value
      // first we check if we have a range, i.e. two values in array
      if (this.selectedRange.length < 2) {
        // we still don't have two values, so we just add the age to array and sort
        this.selectedRange.push(age)
        this.selectedRange.push(age + 9)
      } else {
        // we have a range, so we have to add our value and remove one that is
        // being replaced. If we clicked a smaller number then that number becomes
        // the smallest, and if bigger than the biggest then it is the biggest
        if (age < this.selectedRange[0]) {
          this.selectedRange[0] = age
        }
        if (age > this.selectedRange[1]) {
          this.selectedRange[1] = age + 9
        }
        // if it is in between, replace the older value
        if (_.inRange(age, this.selectedRange[0], this.selectedRange[1])) {
          if (age > this.newSelect) {
            this.selectedRange[1] = age + 9
          }
          if (age < this.newSelect) {
            this.selectedRange[0] = age
          }
        }
      }
      this.newSelect = age
      this.selectedRange.sort()
    },
    selectedStyle(selection) {
      if (_.inRange(selection, this.selectedRange[0], this.selectedRange[1] + 1)) {
        return 'active'
      }
    },
    send() {
      this.$emit('update', {
        range: this.selectedRange,
        label: this.newLabel,
      })
      this.$parent.close()
    },
  },
}
</script>
