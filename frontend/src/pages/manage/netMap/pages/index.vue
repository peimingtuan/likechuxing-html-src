<template>
    <div class="index">
        <div class="area">
            <ControlBox v-if="step>0"/>
            <BranchBox v-if="current_branch" />
            <RemarkBox v-if="remark_rect_id > 0" />
        </div>

        <DataTableBox v-if="dataTableShow" />

        <CountBox v-if="checkedModules.indexOf('统计')>-1 && step === 2"/>
    </div>
</template>

<script>
  import {mapState} from 'vuex'

  import ControlBox from '../components/controlBox'
  import CountBox from '../components/countBox'
  import RemarkBox from '../components/remarkBox'
  import BranchBox from '../components/branchBox'
  import DataTableBox from '../components/dataTableBox'

  export default {
    name: "mainPage",
    components: {
      ControlBox,
      CountBox,
      RemarkBox,
      BranchBox,
      DataTableBox
    },
    computed: {
      ...mapState(['step', 'checkedModules','remark_rect_id','current_branch','dataTableShow'])
    }
  }
</script>

<style lang=less scoped>
.index{
    .area{
        position: absolute;
        top: 10px;
        right: 10px;
    }
}
</style>