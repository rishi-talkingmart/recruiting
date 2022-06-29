<template>
  <div>

    <scatter-chart :data="actual_series" />
  </div>
</template>

<script>
import ScatterChart from './Chart/ScatterChart.vue';


export default {
  name: 'HomePage',
  components: {
    ScatterChart,
  },
  data() {
    return {
      series: null,
      actual_series: null
    }
  },
  methods: {
    async getData() {
      const response = await this.$http.get('/dashboard')
      if (response.status === 200) {
        const Data = await this.getFormatted(response.data);
        let data = [];
        for (let key in Data)
          data.push(Data[key])

        console.log(JSON.stringify(data))

        this.series = await data.map(item => {
          let data = item.data.map(item => item[0])
          return {
            name: item.name,
            data: data.slice (0, 3),
            company: item.company
          }
        })

        this.actual_series = await this.series;
      }


    },
    async getFormatted(Data) {
      const res = Data.reduce(
        (prev, curr) => {
        
            if (prev[curr.customer_name] === undefined) {
              prev[curr.customer_name] = {
                name: curr.customer_name,
                data: [[parseInt(curr.workflows_executed_steps_response), curr.workflow_step_divider_description]],
                company: this.getCompany(curr.customer_email)
              }
            } else {
              if (prev[curr.customer_name].data[prev[curr.customer_name].data.length - 1][1] === curr.workflow_step_divider_description)
                prev[curr.customer_name].data[prev[curr.customer_name].data.length - 1][0] = (prev[curr.customer_name].data[prev[curr.customer_name].data.length - 1][0] + parseInt(curr.workflows_executed_steps_response)) / 2;
              else {
                prev[curr.customer_name].data.push([parseInt(curr.workflows_executed_steps_response), curr.workflow_step_divider_description]);
              }
            

          }
          return prev;
        },
        {});

      return res;

    },
    getCompany(email) {
      return (email.split('@'))[1]
    }
  },
  mounted() {
    this.getData();
  }

};
</script>

<style>
</style>
