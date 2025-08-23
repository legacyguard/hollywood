import ApexCharts from "apexcharts";

// ===== chartSix
const chart11 = () => {
  const chartOptions = {
    series: [
      {
        name: "New Sales",
        data: [300, 350, 310, 370, 248, 187, 295, 191, 269, 201, 185, 252, 151],
      },
    ],
    grid: {
      show: false,
    },
    colors: ["#FB5454"],
    fill: {
      gradient: {
        stops: [0, 100],
      },
    },
    legend: {
      show: false,
    },
    chart: {
      fontFamily: "Satoshi, sans-serif",
      height: 70,
      type: "area",
      parentHeightOffset: 0,

      toolbar: {
        show: false,
      },
    },
    tooltip: {
      enabled: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 1,
    },
    xaxis: {
      type: "datetime",
      categories: [
        "2018-09-19T00:00:00.000Z",
        "2018-09-19T01:30:00.000Z",
        "2018-09-19T02:30:00.000Z",
        "2018-09-19T03:30:00.000Z",
        "2018-09-19T04:30:00.000Z",
        "2018-09-19T05:30:00.000Z",
        "2018-09-19T06:30:00.000Z",
        "2018-09-19T07:30:00.000Z",
        "2018-09-19T08:30:00.000Z",
        "2018-09-19T09:30:00.000Z",
        "2018-09-19T10:30:00.000Z",
        "2018-09-19T11:30:00.000Z",
        "2018-09-19T12:30:00.000Z",
      ],
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
  };

  const chartSelector = document.querySelectorAll(".chartEleven");

  if (chartSelector.length) {
    const chartEleven01 = new ApexCharts(
      document.querySelector(".chartEleven-01"),
      chartOptions
    );
    chartEleven01.render();

    const chartEleven02 = new ApexCharts(
      document.querySelector(".chartEleven-02"),
      chartOptions
    );
    chartEleven02.render();

    const chartEleven03 = new ApexCharts(
      document.querySelector(".chartEleven-03"),
      chartOptions
    );
    chartEleven03.render();

    const chartEleven04 = new ApexCharts(
      document.querySelector(".chartEleven-04"),
      chartOptions
    );
    chartEleven04.render();
  }
};

export default chart11;
