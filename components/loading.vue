<template>
  <div v-if="loading" class="loading-page backdrop">
    <div :style="styles" class="spinner spinner--ping-pong">
      <div :style="innerStyles" class="spinner-inner">
        <div class="board">
          <div class="left"></div>
          <div class="right"></div>
          <div class="ball"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      default: '80px',
    },
  },
  data: () => ({
    loading: false,
  }),
  computed: {
    innerStyles() {
      const size = parseInt(this.size)
      return {
        transform: 'scale(' + size / 250 + ')',
      }
    },
    styles() {
      return {
        width: this.size,
        height: this.size,
      }
    },
  },
  methods: {
    start() {
      this.loading = true
    },
    finish() {
      this.loading = false
    },
  },
}
</script>

<style lang="scss" scoped>
.loading-page {
  align-items: center;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-content: center;
  position: fixed;
  opacity: 0.85;
  width: 250px;
  height: 250px;
  backdrop-filter: blur(15px);
  border-radius: 1000pc;
  background: rgba(255, 255, 255, 0.8);
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  box-shadow: 0 21px 78px rgba(97, 108, 121, 0.6), 0 85px 50px 50px rgba(97, 108, 121, 0.1);
  animation: fade 0.35s linear;
}
.spinner {
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  * {
    line-height: 0;
    box-sizing: border-box;
  }
}
.board {
  width: 250px;
  position: relative;
}
.left,
.right {
  height: 50px;
  width: 15px;
  background: #209cee;
  display: inline-block;
  position: absolute;
}
.left {
  left: 0;
  animation: pingpong-position1 2s linear infinite;
}
.right {
  right: 0;
  animation: pingpong-position2 2s linear infinite;
}
.ball {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #9acd32;
  position: absolute;
  animation: pingpong-bounce 2s linear infinite;
}
@keyframes fade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 100;
  }
}
@keyframes pingpong-position1 {
  0% {
    top: -60px;
  }
  25% {
    top: 0;
  }
  50% {
    top: 60px;
  }
  75% {
    top: -60px;
  }
  100% {
    top: -60px;
  }
}
@keyframes pingpong-position2 {
  0% {
    top: 60px;
  }
  25% {
    top: 0;
  }
  50% {
    top: -60px;
  }
  75% {
    top: -60px;
  }
  100% {
    top: 60px;
  }
}
@keyframes pingpong-bounce {
  0% {
    top: -35px;
    left: 10px;
  }
  25% {
    top: 25px;
    left: 225px;
  }
  50% {
    top: 75px;
    left: 10px;
  }
  75% {
    top: -35px;
    left: 225px;
  }
  100% {
    top: -35px;
    left: 10px;
  }
}
</style>
