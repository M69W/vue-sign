<template>
  <img :src="adObj.photoPath"
       alt=""
       class="ad-banner"
       @click="toAd"
       :class="{ 'cursor-img': adObj.link || adObj.link }"
       v-if="adObj" />
</template>
<script>
export default {
  props: {
    adObj: {
      type: Object,
      default: () => {
        return {
          photoPath: "/static/image/login_bg.jpg",
          link: "",
        };
      },
    },
    defaultImg: ''
  },
  watch: {
    adObj: {
      handler: function () {
        this.adObj.photoPath = this.adObj.fileCode ? 'api/background/file/preview?fileCode=' +
          this.adObj.fileCode : this.defaultImg

      },
      deep: true
    },
  },
  methods: {
    toAd() {
      //  let event = e || window.event;
      if (this.adObj.link) {
        window.location.href = this.adObj.link;
      }
      //  event.stopPropagation();
      //  event.stopImmediatePropagation();
    },
  },
};
</script>
<style lang="scss" scoped>
.ad-banner {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
}
.cursor-img {
  cursor: pointer;
}
</style>
