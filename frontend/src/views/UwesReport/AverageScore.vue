<template>
  <b-card no-body>
    <b-card-header>
      <h4 class="mb-0">Average Score</h4>
      <!-- <b-card-text class="font-medium-5 mb-0">
        <feather-icon icon="HelpCircleIcon" size="21" class="text-muted cursor-pointer" />
      </b-card-text> -->
    </b-card-header>

    <!-- apex chart -->
    <div v-if="data">
      <vue-apex-charts
        type="radialBar"
        height="245"
        class="my-2"
        :options="goalOverviewRadialBar"
        :series="[data.total / data.count].map((n) => (n / data.max) * 100.0)"
      />
      <b-row class="text-center mx-0">
        <b-col cols="6" class="border-top border-right d-flex align-items-between flex-column py-1">
          <b-card-text class="text-muted mb-0"> Total Score </b-card-text>
          <h3 class="font-weight-bolder mb-0">
            {{ data.total }}
          </h3>
        </b-col>

        <b-col cols="6" class="border-top d-flex align-items-between flex-column py-1">
          <b-card-text class="text-muted mb-0"> Max Score </b-card-text>
          <h3 class="font-weight-bolder mb-0">
            {{ data.max * data.count }}
          </h3>
        </b-col>
      </b-row>
    </div>
    <div v-else>
      <div class="d-flex justify-content-center mb-1">
        <b-spinner label="Loading..." />
      </div>
      <div class="d-flex align-items-center">
        <strong>Loading...</strong>
      </div>
    </div>
  </b-card>
</template>

<script>
import { BCard, BCardHeader, BRow, BCol, BCardText, BSpinner } from 'bootstrap-vue';
import VueApexCharts from 'vue-apexcharts';
import { $themeColors } from '@themeConfig';

const $strokeColor = '#ebe9f1';
const $textHeadingColor = '#5e5873';
const $goalStrokeColor2 = '#51e5a8';
export default {
  components: {
    VueApexCharts,
    BCard,
    BCardHeader,
    BRow,
    BCardText,
    BCol,
    BSpinner,
  },
  props: { data: { type: Object, default: null } },
  data() {
    return {
      goalOverviewRadialBar: {
        chart: {
          height: 245,
          type: 'radialBar',
          sparkline: {
            enabled: true,
          },
          dropShadow: {
            enabled: true,
            blur: 3,
            left: 1,
            top: 1,
            opacity: 0.1,
          },
        },
        colors: [$goalStrokeColor2],
        plotOptions: {
          radialBar: {
            offsetY: -10,
            startAngle: -150,
            endAngle: 150,
            hollow: {
              size: '77%',
            },
            track: {
              background: $strokeColor,
              strokeWidth: '50%',
            },
            dataLabels: {
              name: {
                show: false,
              },
              value: {
                color: $textHeadingColor,
                fontSize: '2.86rem',
                fontWeight: '600',
                formatter: function (val) {
                  let origValue = (val / 100) * 6;
                  return origValue.toFixed(0);
                },
              },
              total: { formatter: () => 6 },
            },
          },
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            type: 'horizontal',
            shadeIntensity: 0.5,
            gradientToColors: [$themeColors.success],
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100],
          },
        },
        stroke: {
          lineCap: 'round',
        },
        grid: {
          padding: {
            bottom: 30,
          },
        },
      },
    };
  },
  watch: {
    data(newVal, oldVal) {
      if (newVal) {
        this.goalOverviewRadialBar.plotOptions.radialBar.dataLabels.total.formatter = () => newVal.max;
        this.goalOverviewRadialBar.plotOptions.radialBar.dataLabels.value.formatter = (val) => ((val / 100) * newVal.max).toFixed(0);
      }
    },
  },
};
</script>
