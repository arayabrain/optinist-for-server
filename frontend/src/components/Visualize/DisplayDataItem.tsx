import React from 'react'

import { useSelector } from 'react-redux'
import { DATA_TYPE_SET } from 'store/slice/DisplayData/DisplayDataType'
import {
  selectVisualizeDataFilePath,
  selectVisualizeDataNodeId,
  selectVisualizeDataType,
} from 'store/slice/VisualizeItem/VisualizeItemSelectors'
import { DisplayDataContext } from './DataContext'
import { HeatMap } from './Plot/HeatMap'
import { ImagePlot } from './Plot/ImagePlot'
import { RoiPlot } from './Plot/RoiPlot'
import { TablePlot } from './Plot/TablePlot'
import { TimeSeries } from './Plot/TimeSeries'

export const DisplayDataItem = React.memo<{
  itemId: number
}>(({ itemId }) => {
  const filePath = useSelector(selectVisualizeDataFilePath(itemId))
  const nodeId = useSelector(selectVisualizeDataNodeId(itemId))
  const dataType = useSelector(selectVisualizeDataType(itemId))
  const Plot = () => {
    switch (dataType) {
      case DATA_TYPE_SET.TABLE:
        return <TablePlot />
      case DATA_TYPE_SET.TIME_SERIES:
        return <TimeSeries />
      case DATA_TYPE_SET.HEAT_MAP:
        return <HeatMap />
      case DATA_TYPE_SET.IMAGE:
        return <ImagePlot />
      case DATA_TYPE_SET.ROI:
        return <RoiPlot />
    }
  }
  if (filePath != null && dataType != null) {
    return (
      <DisplayDataContext.Provider
        value={{ nodeId, filePath, dataType, itemId }}
      >
        <Plot />
      </DisplayDataContext.Provider>
    )
  } else {
    return <div>Please select item correctly.</div>
  }
})