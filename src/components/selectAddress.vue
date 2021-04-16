<template>
  <div>
    <el-select v-model="value.proId"
               placeholder="请选择省份"
               style="width:49%">
      <el-option v-for="item in provinceList"
                 :key="item.proId"
                 :label="item.proName"
                 :value="item.proId"></el-option>
    </el-select>
    <el-select v-model="value.cityId"
               placeholder="请选择城市"
               style="width:49%;float:right;">
      <el-option v-for="item in cityList"
                 :key="item.cityId"
                 :label="item.cityName"
                 :value="item.cityId"></el-option>
    </el-select>
  </div>
</template>
<script>
import base from "../modules/contract/mixin/base";
export default {
  mixins: [base],
  props: {
    value: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },

  computed: {
    province() {
      return this.value.proId;
    }
  },
  watch: {
    province(val, oldVal) {
      if (oldVal && val && val != oldVal) {
        this.value.cityId = "";
        this.getCities();
      } else if (oldVal && !val) {
        return;
      } else {
        this.getCities();
      }
    }
  },
  data() {
    return {
      provinceList: [],
      cityList: []
    }
  },
  created() {
    this.getProvinces();
    this.getCities();
  },
  methods: {
    getProvinces() {
      this.getProvince({
        currPage: 1,
        pageSize: 100
      }).then(res => {
        if (this.successCheckCode(res)) {
          this.provinceList = res.data.records;
          this.$emit('getProvinceList', this.provinceList);
        }
      });
    },
    getCities() {
      if (this.value.proId) {
        this.getCity({
          upOneLevelId: this.value.proId,
          currPage: 1,
          pageSize: 100
        }).then(res => {
          if (this.successCheckCode(res)) {
            this.cityList = res.data.records;
            this.$emit('getCityList', this.cityList);
          }
        });
      }
    },
  },
}
</script>
<style lang="scss" scoped>
</style>