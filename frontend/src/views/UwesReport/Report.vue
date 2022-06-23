<template>
  <section id="dashboard-ecommerce">
    <average-score :data="averageGraphData" />
    <b-row class="match-height">
      <b-col lg="4" v-for="graph in attributeGraphData" :key="graph.name"> <attribute-score :data="graph.value" :name="graph.name" /> </b-col>
    </b-row>
  </section>
</template>

<script>
import { BRow, BCol } from 'bootstrap-vue';
import AverageScore from './AverageScore.vue';
import Vuex from 'vuex';
import { getSteps } from '@/@core/api/Form';
import AttributeScore from './AttributeScore.vue';

export default {
  components: {
    BRow,
    BCol,
    AverageScore,
    AttributeScore,
  },
  mounted() {
    this.$store.dispatch('uwesReport/getUwesSurveyData');
  },
  data() {
    return {
      averageGraphData: null,
      attributeGraphData: [],
    };
  },
  computed: {
    ...Vuex.mapState('uwesReport', ['uwesSuurveyApiStatus', 'uwesSuurveyData']),
  },
  methods: {
    getGraphData(data) {
      return data.reduce(
        (previousValue, currentValue) => {
          return {
            total: previousValue.total + parseInt(currentValue.workflows_executed_steps_response),
            count: previousValue.count + 1,
            max: parseInt(currentValue.workflow_step_answer_json.options.at(-1)),
          };
        },
        { total: 0, count: 0, max: 0 }
      );
    },
  },
  watch: {
    uwesSuurveyApiStatus(newStatus, oldStatus) {
      if (newStatus === 'fulfilled') {
        this.averageGraphData = this.getGraphData(this.uwesSuurveyData);
        getSteps(this.uwesSuurveyData[0].workflow_id).then(({ data }) => {
          data = data.sort((previous, next) => previous.step_number - next.step_number);
          data
            .filter(({ type }) => type === 'divider')
            .forEach((item) => {
              console.log(this.uwesSuurveyData.filter((response) => response.workflow_step_divider_num === item.step_number));
              if (this.uwesSuurveyData.filter((response) => response.workflow_step_divider_num === item.step_number).length)
                this.attributeGraphData.push({
                  name: item.query,
                  value: this.getGraphData(this.uwesSuurveyData.filter((response) => response.workflow_step_divider_num === item.step_number)),
                });
            });
        });
      }
    },
  },
};
</script>

<style lang="scss">
@import '@core/scss/vue/pages/dashboard-ecommerce.scss';
@import '@core/scss/vue/libs/chart-apex.scss';
</style>
