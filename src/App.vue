<template>
  <v-app>
    <v-main class="main">
      <v-row no-gutters class="d-md-flex flex-md-row-reverse">
        <v-col xs="12" md="9" cols="12">
          <div class="chart-area">
            <h1>Benford's Law Caluculator</h1>
            <div class="chart-wrap ">
              <v-row class="results-row text-center" cols="12">
                <v-col xs="12" lg="3">
                  <h4>Number of Entries:</h4>
                  <p>{{ firstDigit.length }}</p>
                </v-col>
                <v-col xs="12" lg="3">
                  <h4>Max value:</h4>
                  <p>{{ fullResultsMax }}</p>
                </v-col>
                <v-col xs="12" lg="3">
                  <h4>Min value:</h4>
                  <p>{{ fullResultsMin }}</p>
                </v-col>
                <v-col xs="12" lg="3">
                  <h4>Order of Mangnitude:</h4>
                  <p>{{ orderOfMagnitude }}</p>
                </v-col>
              </v-row>
              <Chart
                class="chart"
                :width="954"
                :height="400"
                v-if="datacollection !== null"
                :chart-data="datacollection"
              ></Chart>
            </div>
          </div>
        </v-col>
        <v-col xs="12" md="3" cols="12" class="pt-0">
          <div class="side-area d-flex align-center">
            <FileUpload @uploaded="initGraphData" />
          </div>
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>

<script>
import Chart from './components/Chart';
import FileUpload from './components/FileUpload';

export default {
  name: 'App',

  components: {
    Chart,
    FileUpload,
  },

  data: () => ({
    datacollection: null,
    firstDigit: [],
    firstDigitFreq: {},
    pecentOfOccurance: {},
    benfordsLawNumbers: [30.1, 17.6, 12.5, 9.7, 7.9, 6.7, 5.8, 5.1, 4.6],
    fullResultsMax: 0,
    fullResultsMin: 0,
    orderOfMagnitude: 0,
    rawResults: [],
  }),
  methods: {
    initGraphData({ data, columnTitle }) {
      this.rawResults = this.cleanRawResults(data, columnTitle);
      this.firstDigit = this.firstDigitArr(this.rawResults);
      this.firstDigitFreq = this.frequencyOfFirstDigit(this.firstDigit);
      this.pecentOfOccurance = this.percentOfOccurance(
        this.firstDigitFreq,
        this.firstDigit.length
      );
      this.fillResultsRow(this.rawResults);
      this.fillChartData();
    },
    cleanRawResults(arryToParse, columnTitle) {
      const arrOfDigits = new Array();
      arryToParse.map((item) =>
        typeof item[columnTitle] === 'number'
          ? arrOfDigits.push(item[columnTitle])
          : ''
      );
      return arrOfDigits;
    },
    firstDigitArr(arryToParse) {
      //create array with the first digit in each entry
      const arrOfFirstDigits = new Array();
      arryToParse.map((item) => arrOfFirstDigits.push(item.toString()[0]));
      return arrOfFirstDigits;
    },
    frequencyOfFirstDigit(firstDigitArr) {
      // create object with frequency of first number ({num: freq})
      const frequencyObj = new Object();
      firstDigitArr.map(
        (digit) =>
          (frequencyObj[digit] = frequencyObj[digit]
            ? frequencyObj[digit] + 1
            : 1)
      );
      // remove 0 from the list ***move out of this function to keep it clean
      if (Object.prototype.hasOwnProperty.call(frequencyObj, '0'))
        delete frequencyObj['0'];
      return frequencyObj;
    },
    percentOfOccurance(digitsToCheck, lenthOfTotalDigits) {
      // create object with percent of occurance {key: val}
      const percentObj = new Object();
      for (const digit in digitsToCheck) {
        let percentFull =
          (digitsToCheck[digit] / lenthOfTotalDigits) * 100 || 0;
        console.log(percentFull + ' --- ' + digit);
        percentObj[digit] = percentFull.toFixed(1) || 0;
      }
      return percentObj;
    },
    fillResultsRow(arrayOfNums) {
      this.fullResultsMax = Math.max(...arrayOfNums);
      this.fullResultsMin = Math.min(...arrayOfNums);
      this.orderOfMagnitude = Math.floor(
        Math.LOG10E * Math.log(this.fullResultsMax - this.fullResultsMin) || 0
      );
    },
    fillChartData() {
      this.datacollection = {
        datasets: [
          {
            label: 'Entered Data Distribution',
            backgroundColor: 'rgba(72, 223, 186, 0.5)',
            data: Object.values(this.pecentOfOccurance),
            order: 0,
          },
          {
            label: "Benford's Law Distribution",
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            pointBackgroundColor: '#fff',
            borderWidth: 2,
            borderColor: '#fff',
            pointBorderColor: '#fff',
            data: this.benfordsLawNumbers,
            type: 'line',
            order: 2,
          },
        ],
        labels: Array.from({ length: 9 }, (v, i) => i + 1),
      };
    },
  },
  mounted() {
    this.fillChartData();
  },
};
</script>
<style lang="scss" scoped>
* {
  font-family: 'Lato', sans-serif;
  box-sizing: border-box;
}
.main {
  min-width: 480px;
}
.side-area {
  padding: 3rem 2rem;
  color: white;
  background-color: #181745;
  height: 100vh;
  @media (max-width: 959px) {
    height: 150px;
    padding: 2rem;
  }
}
.chart-area {
  height: 100vh;
  min-height: 683px;
  padding: 3rem;

  background: linear-gradient(
    to bottom left,
    #216e93,
    #21648a,
    #1f5881,
    #172d5b,
    #191c51
  );
  color: #fff;

  .chart-wrap {
    padding: 1rem 2rem;
    margin: 3rem 0;
    background-color: rgba(29, 27, 65, 0.6);
    .results-row {
      padding-bottom: 2rem;
      h4 {
        font-size: 12px;
        text-transform: uppercase;
        color: #fdfdfd;
        opacity: 0.8;
      }
      p {
        font-size: 32px;
      }
    }
    .chart {
      width: 100%;
      canvas {
        width: 100%;
      }
    }
  }
  @media (max-width: 959px) {
    height: calc(100vh - 150px);
    padding: 2rem 1.5rem;
    .chart-wrap {
      margin: 1.5rem 0;
      .results-row {
        col {
          padding: 0.5rem;
          display: block;
        }
        padding-bottom: 1rem;
        p {
          font-size: 18px;
        }
      }
    }
  }
}
</style>
