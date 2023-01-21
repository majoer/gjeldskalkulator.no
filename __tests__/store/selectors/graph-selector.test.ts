import { selectDebtSeries } from "../../../store/selectors/graph-selector";
import { AppState, store } from "../../../store/store";

describe("graph-selector", () => {
  it("Initial state - plot with a single identity data point", () => {
    const appState: Partial<AppState> = {
      ...store.getState(),
      debts: {
        ids: [],
        entities: {},
      },
      result: {
        useTowardsDebt: "0",
        useTowardsDebtType: "number",
      },
    };
    expect(selectDebtSeries(appState)).toEqual({
      paymentPlan: [{ sumInterestPaidSoFar: 0, sumPaidSoFar: 0, x: 0, y: 0 }],
      resolution: "Month",
      events: [],
      serie: [{ sumInterestPaidSoFar: 0, sumPaidSoFar: 0, x: 0, y: 0 }],
    });
  });

  describe("Performance", () => {
    it("Debt that quickly explodes to infinity - 500ms", () => {
      const appState: Partial<AppState> = {
        ...store.getState(),
        debts: {
          ids: ["1"],
          entities: {
            "1": {
              id: "1",
              amount: 100000,
              fee: 1000,
              interest: "50",
              name: "",
              type: "credit",
            },
          },
        },
        result: {
          useTowardsDebt: "0",
          useTowardsDebtType: "number",
        },
      };

      const start = performance.now();
      selectDebtSeries(appState);
      const end = performance.now();

      expect(end - start).toBeLessThan(300);
    });
  });

  /*   it("Two loans - expected plot", () => {
    const appState: Partial<AppState> = {
      ...store.getState(),
      debts: {
        ids: ["1", "2"],
        entities: {
          "1": {
            id: "1",
            amount: 100000,
            fee: 1000,
            interest: "10",
            name: "",
            type: "credit",
          },
          "2": {
            id: "1",
            amount: 200000,
            fee: 1000,
            interest: "10",
            name: "",
            type: "credit",
          },
        },
      },
      result: {
        useTowardsDebt: "10000",
        useTowardsDebtType: "number",
      },
    };
    expect(selectDebtSeries(appState)).toEqual({
      resolution: "Month",
      serie: [
        {
          sumInterestPaidSoFar: 0,
          sumPaidSoFar: 0,
          x: 0,
          y: 300000,
        },
        {
          sumInterestPaidSoFar: 1666.6666666666667,
          sumPaidSoFar: 10000,
          x: 1,
          y: 294500,
        },
        {
          sumInterestPaidSoFar: 3355.5555555555557,
          sumPaidSoFar: 20000,
          x: 2,
          y: 288954.1666666667,
        },
        {
          sumInterestPaidSoFar: 5066.851851851852,
          sumPaidSoFar: 30000,
          x: 3,
          y: 283362.11805555556,
        },
        {
          sumInterestPaidSoFar: 6800.742283950617,
          sumPaidSoFar: 40000,
          x: 4,
          y: 277723.46903935185,
        },
        {
          sumInterestPaidSoFar: 8557.415136316873,
          sumPaidSoFar: 50000,
          x: 5,
          y: 272037.83128134644,
        },
        {
          sumInterestPaidSoFar: 10337.060262452846,
          sumPaidSoFar: 60000,
          x: 6,
          y: 266304.813208691,
        },
        {
          sumInterestPaidSoFar: 12139.869097973287,
          sumPaidSoFar: 70000,
          x: 7,
          y: 260524.0199854301,
        },
        {
          sumInterestPaidSoFar: 13966.03467378973,
          sumPaidSoFar: 80000,
          x: 8,
          y: 254695.05348530866,
        },
        {
          sumInterestPaidSoFar: 15815.751629404645,
          sumPaidSoFar: 90000,
          x: 9,
          y: 248817.5122643529,
        },
        {
          sumInterestPaidSoFar: 17689.216226316352,
          sumPaidSoFar: 100000,
          x: 10,
          y: 242890.99153322252,
        },
        {
          sumInterestPaidSoFar: 19586.626361535655,
          sumPaidSoFar: 110000,
          x: 11,
          y: 236915.08312933272,
        },
        {
          sumInterestPaidSoFar: 21508.181581215118,
          sumPaidSoFar: 120000,
          x: 12,
          y: 230889.37548874383,
        },
        {
          sumInterestPaidSoFar: 23432.25971028798,
          sumPaidSoFar: 130000,
          x: 13,
          y: 223813.4536178167,
        },
        {
          sumInterestPaidSoFar: 25297.371823769787,
          sumPaidSoFar: 140000,
          x: 14,
          y: 216678.5657312985,
        },
        {
          sumInterestPaidSoFar: 27103.026538197275,
          sumPaidSoFar: 150000,
          x: 15,
          y: 209484.22044572598,
        },
        {
          sumInterestPaidSoFar: 28848.72837524499,
          sumPaidSoFar: 160000,
          x: 16,
          y: 202229.9222827737,
        },
        {
          sumInterestPaidSoFar: 30533.97772760144,
          sumPaidSoFar: 170000,
          x: 17,
          y: 194915.17163513016,
        },
        {
          sumInterestPaidSoFar: 32158.27082456086,
          sumPaidSoFar: 180000,
          x: 18,
          y: 187539.46473208957,
        },
        {
          sumInterestPaidSoFar: 33721.09969732827,
          sumPaidSoFar: 190000,
          x: 19,
          y: 180102.293604857,
        },
        {
          sumInterestPaidSoFar: 35221.952144035415,
          sumPaidSoFar: 200000,
          x: 20,
          y: 172603.14605156414,
        },
        {
          sumInterestPaidSoFar: 36660.31169446511,
          sumPaidSoFar: 210000,
          x: 21,
          y: 165041.50560199385,
        },
        {
          sumInterestPaidSoFar: 38035.65757448173,
          sumPaidSoFar: 220000,
          x: 22,
          y: 157416.85148201048,
        },
        {
          sumInterestPaidSoFar: 39347.46467016515,
          sumPaidSoFar: 230000,
          x: 23,
          y: 149728.6585776939,
        },
        {
          sumInterestPaidSoFar: 40595.20349164593,
          sumPaidSoFar: 240000,
          x: 24,
          y: 141976.3973991747,
        },
        {
          sumInterestPaidSoFar: 41778.34013663905,
          sumPaidSoFar: 250000,
          x: 25,
          y: 134159.5340441678,
        },
        {
          sumInterestPaidSoFar: 42896.336253673784,
          sumPaidSoFar: 260000,
          x: 26,
          y: 126277.53016120254,
        },
        {
          sumInterestPaidSoFar: 43948.64900501714,
          sumPaidSoFar: 270000,
          x: 27,
          y: 118329.8429125459,
        },
        {
          sumInterestPaidSoFar: 44934.731029288356,
          sumPaidSoFar: 280000,
          x: 28,
          y: 110315.92493681711,
        },
        {
          sumInterestPaidSoFar: 45854.03040376183,
          sumPaidSoFar: 290000,
          x: 29,
          y: 102235.22431129059,
        },
        {
          sumInterestPaidSoFar: 46705.99060635592,
          sumPaidSoFar: 300000,
          x: 30,
          y: 94087.18451388468,
        },
        {
          sumInterestPaidSoFar: 47490.05047730496,
          sumPaidSoFar: 310000,
          x: 31,
          y: 85871.24438483371,
        },
        {
          sumInterestPaidSoFar: 48205.64418051191,
          sumPaidSoFar: 320000,
          x: 32,
          y: 77586.83808804066,
        },
        {
          sumInterestPaidSoFar: 48852.20116457891,
          sumPaidSoFar: 330000,
          x: 33,
          y: 69233.39507210767,
        },
        {
          sumInterestPaidSoFar: 49429.14612351314,
          sumPaidSoFar: 340000,
          x: 34,
          y: 60810.3400310419,
        },
        {
          sumInterestPaidSoFar: 49935.89895710516,
          sumPaidSoFar: 350000,
          x: 35,
          y: 52317.092864633916,
        },
        {
          sumInterestPaidSoFar: 50371.874730977106,
          sumPaidSoFar: 360000,
          x: 36,
          y: 43753.068638505865,
        },
        {
          sumInterestPaidSoFar: 50736.48363629799,
          sumPaidSoFar: 370000,
          x: 37,
          y: 35117.67754382675,
        },
        {
          sumInterestPaidSoFar: 51029.13094916321,
          sumPaidSoFar: 380000,
          x: 38,
          y: 26410.32485669197,
        },
        {
          sumInterestPaidSoFar: 51249.21698963565,
          sumPaidSoFar: 390000,
          x: 39,
          y: 17630.410897164402,
        },
        {
          sumInterestPaidSoFar: 51396.13708044535,
          sumPaidSoFar: 400000,
          x: 40,
          y: 8777.330987974106,
        },
        {
          sumInterestPaidSoFar: 51469.281505345134,
          sumPaidSoFar: 409850.4754128739,
          x: 41,
          y: 0,
        },
      ],
      paymentPlan: [
        {
          sumInterestPaidSoFar: 0,
          sumPaidSoFar: 0,
          x: 0,
          y: 300000,
        },
        {
          sumInterestPaidSoFar: 1666.6666666666667,
          sumPaidSoFar: 10000,
          x: 1,
          y: 294500,
        },
        {
          sumInterestPaidSoFar: 3355.5555555555557,
          sumPaidSoFar: 20000,
          x: 2,
          y: 288954.1666666667,
        },
        {
          sumInterestPaidSoFar: 5066.851851851852,
          sumPaidSoFar: 30000,
          x: 3,
          y: 283362.11805555556,
        },
        {
          sumInterestPaidSoFar: 6800.742283950617,
          sumPaidSoFar: 40000,
          x: 4,
          y: 277723.46903935185,
        },
        {
          sumInterestPaidSoFar: 8557.415136316873,
          sumPaidSoFar: 50000,
          x: 5,
          y: 272037.83128134644,
        },
        {
          sumInterestPaidSoFar: 10337.060262452846,
          sumPaidSoFar: 60000,
          x: 6,
          y: 266304.813208691,
        },
        {
          sumInterestPaidSoFar: 12139.869097973287,
          sumPaidSoFar: 70000,
          x: 7,
          y: 260524.0199854301,
        },
        {
          sumInterestPaidSoFar: 13966.03467378973,
          sumPaidSoFar: 80000,
          x: 8,
          y: 254695.05348530866,
        },
        {
          sumInterestPaidSoFar: 15815.751629404645,
          sumPaidSoFar: 90000,
          x: 9,
          y: 248817.5122643529,
        },
        {
          sumInterestPaidSoFar: 17689.216226316352,
          sumPaidSoFar: 100000,
          x: 10,
          y: 242890.99153322252,
        },
        {
          sumInterestPaidSoFar: 19586.626361535655,
          sumPaidSoFar: 110000,
          x: 11,
          y: 236915.08312933272,
        },
        {
          sumInterestPaidSoFar: 21508.181581215118,
          sumPaidSoFar: 120000,
          x: 12,
          y: 230889.37548874383,
        },
        {
          sumInterestPaidSoFar: 23432.25971028798,
          sumPaidSoFar: 130000,
          x: 13,
          y: 223813.4536178167,
        },
        {
          sumInterestPaidSoFar: 25297.371823769787,
          sumPaidSoFar: 140000,
          x: 14,
          y: 216678.5657312985,
        },
        {
          sumInterestPaidSoFar: 27103.026538197275,
          sumPaidSoFar: 150000,
          x: 15,
          y: 209484.22044572598,
        },
        {
          sumInterestPaidSoFar: 28848.72837524499,
          sumPaidSoFar: 160000,
          x: 16,
          y: 202229.9222827737,
        },
        {
          sumInterestPaidSoFar: 30533.97772760144,
          sumPaidSoFar: 170000,
          x: 17,
          y: 194915.17163513016,
        },
        {
          sumInterestPaidSoFar: 32158.27082456086,
          sumPaidSoFar: 180000,
          x: 18,
          y: 187539.46473208957,
        },
        {
          sumInterestPaidSoFar: 33721.09969732827,
          sumPaidSoFar: 190000,
          x: 19,
          y: 180102.293604857,
        },
        {
          sumInterestPaidSoFar: 35221.952144035415,
          sumPaidSoFar: 200000,
          x: 20,
          y: 172603.14605156414,
        },
        {
          sumInterestPaidSoFar: 36660.31169446511,
          sumPaidSoFar: 210000,
          x: 21,
          y: 165041.50560199385,
        },
        {
          sumInterestPaidSoFar: 38035.65757448173,
          sumPaidSoFar: 220000,
          x: 22,
          y: 157416.85148201048,
        },
        {
          sumInterestPaidSoFar: 39347.46467016515,
          sumPaidSoFar: 230000,
          x: 23,
          y: 149728.6585776939,
        },
        {
          sumInterestPaidSoFar: 40595.20349164593,
          sumPaidSoFar: 240000,
          x: 24,
          y: 141976.3973991747,
        },
        {
          sumInterestPaidSoFar: 41778.34013663905,
          sumPaidSoFar: 250000,
          x: 25,
          y: 134159.5340441678,
        },
        {
          sumInterestPaidSoFar: 42896.336253673784,
          sumPaidSoFar: 260000,
          x: 26,
          y: 126277.53016120254,
        },
        {
          sumInterestPaidSoFar: 43948.64900501714,
          sumPaidSoFar: 270000,
          x: 27,
          y: 118329.8429125459,
        },
        {
          sumInterestPaidSoFar: 44934.731029288356,
          sumPaidSoFar: 280000,
          x: 28,
          y: 110315.92493681711,
        },
        {
          sumInterestPaidSoFar: 45854.03040376183,
          sumPaidSoFar: 290000,
          x: 29,
          y: 102235.22431129059,
        },
        {
          sumInterestPaidSoFar: 46705.99060635592,
          sumPaidSoFar: 300000,
          x: 30,
          y: 94087.18451388468,
        },
        {
          sumInterestPaidSoFar: 47490.05047730496,
          sumPaidSoFar: 310000,
          x: 31,
          y: 85871.24438483371,
        },
        {
          sumInterestPaidSoFar: 48205.64418051191,
          sumPaidSoFar: 320000,
          x: 32,
          y: 77586.83808804066,
        },
        {
          sumInterestPaidSoFar: 48852.20116457891,
          sumPaidSoFar: 330000,
          x: 33,
          y: 69233.39507210767,
        },
        {
          sumInterestPaidSoFar: 49429.14612351314,
          sumPaidSoFar: 340000,
          x: 34,
          y: 60810.3400310419,
        },
        {
          sumInterestPaidSoFar: 49935.89895710516,
          sumPaidSoFar: 350000,
          x: 35,
          y: 52317.092864633916,
        },
        {
          sumInterestPaidSoFar: 50371.874730977106,
          sumPaidSoFar: 360000,
          x: 36,
          y: 43753.068638505865,
        },
        {
          sumInterestPaidSoFar: 50736.48363629799,
          sumPaidSoFar: 370000,
          x: 37,
          y: 35117.67754382675,
        },
        {
          sumInterestPaidSoFar: 51029.13094916321,
          sumPaidSoFar: 380000,
          x: 38,
          y: 26410.32485669197,
        },
        {
          sumInterestPaidSoFar: 51249.21698963565,
          sumPaidSoFar: 390000,
          x: 39,
          y: 17630.410897164402,
        },
        {
          sumInterestPaidSoFar: 51396.13708044535,
          sumPaidSoFar: 400000,
          x: 40,
          y: 8777.330987974106,
        },
        {
          sumInterestPaidSoFar: 51469.281505345134,
          sumPaidSoFar: 409850.4754128739,
          x: 41,
          y: 0,
        },
      ],
    });
  });

  it("Annuity load 1 yr gives expected plot", () => {
    const appState: Partial<AppState> = {
      ...store.getState(),
      debts: {
        ids: ["1"],
        entities: {
          "1": {
            id: "1",
            amount: 100000,
            fee: 0,
            interest: "10",
            name: "",
            type: "annuity",
            termins: 12,
          },
        },
      },
      result: {
        useTowardsDebt: "10000",
        useTowardsDebtType: "number",
      },
    };
    expect(selectDebtSeries(appState)).toEqual({
      paymentPlan: [
        { sumInterestPaidSoFar: 0, sumPaidSoFar: 0, x: 0, y: 100000 },
        { sumInterestPaidSoFar: 0, sumPaidSoFar: 0, x: 1, y: 92059 },
        { sumInterestPaidSoFar: 0, sumPaidSoFar: 0, x: 2, y: 83975 },
        { sumInterestPaidSoFar: 0, sumPaidSoFar: 0, x: 3, y: 75898 },
        { sumInterestPaidSoFar: 0, sumPaidSoFar: 0, x: 4, y: 67732 },
        { sumInterestPaidSoFar: 0, sumPaidSoFar: 0, x: 5, y: 59517 },
        { sumInterestPaidSoFar: 0, sumPaidSoFar: 0, x: 6, y: 51216 },
        { sumInterestPaidSoFar: 0, sumPaidSoFar: 0, x: 7, y: 42861 },
        { sumInterestPaidSoFar: 0, sumPaidSoFar: 0, x: 8, y: 34436 },
        { sumInterestPaidSoFar: 0, sumPaidSoFar: 0, x: 9, y: 25929 },
        { sumInterestPaidSoFar: 0, sumPaidSoFar: 0, x: 10, y: 17359 },
        { sumInterestPaidSoFar: 0, sumPaidSoFar: 0, x: 11, y: 8711 },
        { sumInterestPaidSoFar: 0, sumPaidSoFar: 0, x: 12, y: 0 },
      ],
      resolution: "Month",
      serie: [
        { sumInterestPaidSoFar: 0, sumPaidSoFar: 0, x: 0, y: 100000 },
        { sumInterestPaidSoFar: 0, sumPaidSoFar: 0, x: 1, y: 92059 },
        { sumInterestPaidSoFar: 0, sumPaidSoFar: 0, x: 2, y: 83975 },
        { sumInterestPaidSoFar: 0, sumPaidSoFar: 0, x: 3, y: 75898 },
        { sumInterestPaidSoFar: 0, sumPaidSoFar: 0, x: 4, y: 67732 },
        { sumInterestPaidSoFar: 0, sumPaidSoFar: 0, x: 5, y: 59517 },
        { sumInterestPaidSoFar: 0, sumPaidSoFar: 0, x: 6, y: 51216 },
        { sumInterestPaidSoFar: 0, sumPaidSoFar: 0, x: 7, y: 42861 },
        { sumInterestPaidSoFar: 0, sumPaidSoFar: 0, x: 8, y: 34436 },
        { sumInterestPaidSoFar: 0, sumPaidSoFar: 0, x: 9, y: 25929 },
        { sumInterestPaidSoFar: 0, sumPaidSoFar: 0, x: 10, y: 17359 },
        { sumInterestPaidSoFar: 0, sumPaidSoFar: 0, x: 11, y: 8711 },
        { sumInterestPaidSoFar: 0, sumPaidSoFar: 0, x: 12, y: 0 },
      ],
    });
  }); */
});
