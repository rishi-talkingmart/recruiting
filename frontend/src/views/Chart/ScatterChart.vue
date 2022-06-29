<template>

    <b-card class="card">
        <b-card-header>
            <h4 class="mb-0">Scatter Plot</h4>
        </b-card-header>

        <div v-if="data">

            <b-dropdown class='my-2' :text="company" v-if="companyList">
                <b-dropdown-item @click="Filter ('all')">
                    All
                </b-dropdown-item>
                <b-dropdown-item v-for="item, i in companyList" :key="i" @click="Filter (item)">
                    {{ item }}
                </b-dropdown-item>
            </b-dropdown>

            <vue-apex-charts type="line" :height="chartHeight" class="my-2" :options="chartOptions"
                :series="actual_series" />

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
import { BCard, BCardHeader, BRow, BCol, BCardText, BSpinner, BDropdown, BDropdownItem } from 'bootstrap-vue';
import VueApexCharts from 'vue-apexcharts';


export default {
    name: "scatter-chart",
    props: {
        data: {
            type: Array,
            default: null
        }
    },
    components: {
        VueApexCharts,
        BCard,
        BCardHeader,
        BRow,
        BCardText,
        BCol,
        BSpinner,
        BDropdown,
        BDropdownItem
    },
    data() {
        return {
            actual_series: null,
            companyList: null,
            company: 'All',
            chartOptions: {
                chart: {
                    height: 350,
                    type: 'line',
                    zoom: {
                        enabled: true,
                        type: 'xy'
                    }
                },
                stroke: {
                    curve: 'smooth',
                },
                dataLabels: {
                    enabled: true
                },
                xaxis: {
                    tickAmount: 10,
                    categories: ['Vigor', 'Dedication', 'Absorption']
                },
                yaxis: {
                    tickAmount: 7
                },
                chartHeight: '500'
            },
        }
    },
    watch: {
        data: function (val, _) {
            this.actual_series = val;
            this.companyList = [...new Set(val.map(item => item.company))]
        }
    },
    methods: {
        Filter(company) {
            company = company.toLowerCase();
            this.company = company;
            if (company === 'all')
                this.actual_series = this.data;

            else {
                this.actual_series = this.data.filter(item => item.company.toLowerCase () === company)
            }

        }
    },
    mounted() {
        this.chartHeight = window.innerHeight * 0.575;
    }
}
</script>

<style lang="scss" scoped>
.card {
    margin-bottom: 1rem;
    height: 75vh !important;
}
</style>