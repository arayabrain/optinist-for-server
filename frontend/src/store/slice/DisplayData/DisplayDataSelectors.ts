import { RootState } from 'store/store'

const selectDisplayData = (state: RootState) => state.displayData

export const selectTimeSeriesData = (filePath: string) => (state: RootState) =>
  selectDisplayData(state).timeSeries[filePath].data

export const selectTimeSeriesXrange =
  (filePath: string) => (state: RootState) =>
    selectDisplayData(state).timeSeries[filePath].xrange

export const selectTimeSeriesStd = (filePath: string) => (state: RootState) =>
  selectDisplayData(state).timeSeries[filePath].std

export const selectTimeSeriesDataIsInitialized =
  (filePath: string) => (state: RootState) =>
    Object.keys(selectDisplayData(state).timeSeries).includes(filePath)

export const selectTimeSeriesDataIsPending =
  (filePath: string) => (state: RootState) =>
    selectTimeSeriesDataIsInitialized(filePath)(state) &&
    selectDisplayData(state).timeSeries[filePath].pending

export const selectTimeSeriesDataIsFulfilled =
  (filePath: string) => (state: RootState) =>
    selectTimeSeriesDataIsInitialized(filePath)(state) &&
    selectDisplayData(state).timeSeries[filePath].fulfilled

export const selectTimeSeriesDataError =
  (filePath: string) => (state: RootState) =>
    selectTimeSeriesDataIsInitialized(filePath)(state)
      ? selectDisplayData(state).timeSeries[filePath].error
      : null

export const selectLineData = (filePath: string) => (state: RootState) =>
  selectDisplayData(state).line[filePath].data

export const selectLineColumns = (filePath: string) => (state: RootState) =>
  selectDisplayData(state).line[filePath].columns

export const selectLineIndex = (filePath: string) => (state: RootState) =>
  selectDisplayData(state).line[filePath].index

export const selectLineDataIsInitialized =
  (filePath: string) => (state: RootState) =>
    Object.keys(selectDisplayData(state).line).includes(filePath)

export const selectLineDataIsPending =
  (filePath: string) => (state: RootState) =>
    selectLineDataIsInitialized(filePath)(state) &&
    selectDisplayData(state).line[filePath].pending

export const selectLineDataIsFulfilled =
  (filePath: string) => (state: RootState) =>
    selectLineDataIsInitialized(filePath)(state) &&
    selectDisplayData(state).line[filePath].fulfilled

export const selectLineDataError = (filePath: string) => (state: RootState) =>
  selectLineDataIsInitialized(filePath)(state)
    ? selectDisplayData(state).line[filePath].error
    : null

export const selectHeatMapData = (filePath: string) => (state: RootState) =>
  selectDisplayData(state).heatMap[filePath].data

export const selectHeatMapColumns = (filePath: string) => (state: RootState) =>
  selectDisplayData(state).heatMap[filePath].columns

export const selectHeatMapIndex = (filePath: string) => (state: RootState) =>
  selectDisplayData(state).heatMap[filePath].index

export const selectHeatMapDataIsInitialized =
  (filePath: string) => (state: RootState) =>
    Object.keys(selectDisplayData(state).heatMap).includes(filePath)

export const selectHeatMapDataIsPending =
  (filePath: string) => (state: RootState) =>
    selectHeatMapDataIsInitialized(filePath)(state) &&
    selectDisplayData(state).heatMap[filePath].pending

export const selectHeatMapDataIsFulfilled =
  (filePath: string) => (state: RootState) =>
    selectHeatMapDataIsInitialized(filePath)(state) &&
    selectDisplayData(state).heatMap[filePath].fulfilled

export const selectHeatMapDataError =
  (filePath: string) => (state: RootState) =>
    selectHeatMapDataIsInitialized(filePath)(state)
      ? selectDisplayData(state).heatMap[filePath].error
      : null

export const selectImageData = (filePath: string) => (state: RootState) =>
  selectDisplayData(state).image[filePath]

export const selectImageDataIsInitialized =
  (filePath: string) => (state: RootState) =>
    Object.keys(selectDisplayData(state).image).includes(filePath)

export const selectImageDataError = (filePath: string) => (state: RootState) =>
  selectImageDataIsInitialized(filePath)(state)
    ? selectDisplayData(state).image[filePath].error
    : null

export const selectImageDataIsPending =
  (filePath: string) => (state: RootState) =>
    selectImageDataIsInitialized(filePath)(state) &&
    selectDisplayData(state).image[filePath].pending

export const selectImageDataIsFulfilled =
  (filePath: string) => (state: RootState) =>
    selectImageDataIsInitialized(filePath)(state) &&
    selectDisplayData(state).image[filePath].fulfilled

export const selectImageDataMaxSize =
  (filePath: string) => (state: RootState) => {
    if (!selectImageDataIsPending(filePath)(state)) {
      return selectImageData(filePath)(state).data.length - 1
    } else {
      return 0
    }
  }

export const selectActiveImageData =
  (filePath: string, activeIndex: number) => (state: RootState) => {
    return selectImageData(filePath)(state).data[activeIndex]
  }

export const selectCsvData = (filePath: string) => (state: RootState) =>
  selectDisplayData(state).csv[filePath].data

export const selectCsvDataIsInitialized =
  (filePath: string) => (state: RootState) =>
    Object.keys(selectDisplayData(state).csv).includes(filePath)

export const selectCsvDataError = (filePath: string) => (state: RootState) =>
  selectCsvDataIsInitialized(filePath)(state)
    ? selectDisplayData(state).csv[filePath].error
    : null

export const selectCsvDataIsPending =
  (filePath: string) => (state: RootState) =>
    selectCsvDataIsInitialized(filePath)(state) &&
    selectDisplayData(state).csv[filePath].pending

export const selectCsvDataIsFulfilled =
  (filePath: string) => (state: RootState) =>
    selectCsvDataIsInitialized(filePath)(state) &&
    selectDisplayData(state).csv[filePath].fulfilled

export const selectRoiData = (filePath: string) => (state: RootState) =>
  selectDisplayData(state).roi[filePath]?.data[0] ?? []

export const selectRoiDataIsInitialized =
  (filePath: string) => (state: RootState) =>
    Object.keys(selectDisplayData(state).roi).includes(filePath)

export const selectRoiDataError = (filePath: string) => (state: RootState) =>
  selectRoiDataIsInitialized(filePath)(state)
    ? selectDisplayData(state).roi[filePath].error
    : null

export const selectRoiDataIsPending =
  (filePath: string) => (state: RootState) =>
    selectRoiDataIsInitialized(filePath)(state) &&
    selectDisplayData(state).roi[filePath].pending

export const selectRoiDataIsFulfilled =
  (filePath: string) => (state: RootState) =>
    selectRoiDataIsInitialized(filePath)(state) &&
    selectDisplayData(state).roi[filePath].fulfilled

export const selectRoiUniqueList = (filePath: string) => (state: RootState) => {
  if (selectRoiDataIsFulfilled(filePath)(state)) {
    return selectDisplayData(state).roi[filePath].roiUniqueList
  }
  return null
}

export const selectScatterData = (filePath: string) => (state: RootState) =>
  selectDisplayData(state).scatter[filePath]?.data ?? []

export const selectScatterDataIsInitialized =
  (filePath: string) => (state: RootState) =>
    Object.keys(selectDisplayData(state).scatter).includes(filePath)

export const selectScatterDataError =
  (filePath: string) => (state: RootState) =>
    selectScatterDataIsInitialized(filePath)(state)
      ? selectDisplayData(state).scatter[filePath].error
      : null

export const selectScatterDataIsPending =
  (filePath: string) => (state: RootState) =>
    selectScatterDataIsInitialized(filePath)(state) &&
    selectDisplayData(state).scatter[filePath].pending

export const selectScatterDataIsFulfilled =
  (filePath: string) => (state: RootState) =>
    selectScatterDataIsInitialized(filePath)(state) &&
    selectDisplayData(state).scatter[filePath].fulfilled

export const selectBarData = (filePath: string) => (state: RootState) =>
  selectDisplayData(state).bar[filePath]?.data ?? []

export const selectBarIndex = (filePath: string) => (state: RootState) =>
  selectDisplayData(state).bar[filePath]?.index ?? []

export const selectBarDataIsInitialized =
  (filePath: string) => (state: RootState) =>
    Object.keys(selectDisplayData(state).bar).includes(filePath)

export const selectBarDataError = (filePath: string) => (state: RootState) =>
  selectBarDataIsInitialized(filePath)(state)
    ? selectDisplayData(state).bar[filePath].error
    : null

export const selectBarDataIsPending =
  (filePath: string) => (state: RootState) =>
    selectBarDataIsInitialized(filePath)(state) &&
    selectDisplayData(state).bar[filePath].pending

export const selectBarDataIsFulfilled =
  (filePath: string) => (state: RootState) =>
    selectBarDataIsInitialized(filePath)(state) &&
    selectDisplayData(state).bar[filePath].fulfilled

export const selectHTMLData = (filePath: string) => (state: RootState) =>
  selectDisplayData(state).html[filePath]?.data ?? ''

export const selectHTMLDataIsInitialized =
  (filePath: string) => (state: RootState) =>
    Object.keys(selectDisplayData(state).html).includes(filePath)

export const selectHTMLDataError = (filePath: string) => (state: RootState) =>
  selectHTMLDataIsInitialized(filePath)(state)
    ? selectDisplayData(state).html[filePath].error
    : null

export const selectHTMLDataIsPending =
  (filePath: string) => (state: RootState) =>
    selectHTMLDataIsInitialized(filePath)(state) &&
    selectDisplayData(state).html[filePath].pending

export const selectHTMLDataIsFulfilled =
  (filePath: string) => (state: RootState) =>
    selectHTMLDataIsInitialized(filePath)(state) &&
    selectDisplayData(state).html[filePath].fulfilled
