import React, { CSSProperties } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Handle, NodeProps, Position } from 'react-flow-renderer'
import {
  selectInputNodeDefined,
  selectMatlabInputNodeSelectedFilePath,
} from 'store/slice/InputNode/InputNodeSelectors'
import { setInputNodeFilePath } from 'store/slice/InputNode/InputNodeActions'
import { alpha, useTheme } from '@mui/material/styles'
import { deleteFlowNodeById } from 'store/slice/FlowElement/FlowElementSlice'
import { FileSelect } from './FileSelect'
import { toHandleId } from './FlowChartUtils'
import { FILE_TYPE_SET } from 'store/slice/InputNode/InputNodeType'

const sourceHandleStyle: CSSProperties = {
  width: 8,
  height: 15,
  top: 15,
  border: '1px solid',
  borderColor: '#555',
  borderRadius: 0,
}

export const TcFileNode = React.memo<NodeProps>((element) => {
  const defined = useSelector(selectInputNodeDefined(element.id))
  if (defined) {
    return <TcFileNodeImpl {...element} />
  } else {
    return null
  }
})

const TcFileNodeImpl = React.memo<NodeProps>(
  ({ id: nodeId, selected }) => {
    const dispatch = useDispatch()
    const filePath = useSelector(selectMatlabInputNodeSelectedFilePath(nodeId))
    const onChangeFilePath = (path: string) => {
      dispatch(setInputNodeFilePath({ nodeId, filePath: path }))
    }
    const theme = useTheme()

    const onClickDeleteIcon = () => {
      dispatch(deleteFlowNodeById(nodeId))
    }

    return (
      <div
        style={{
          height: '100%',
          width: '250px',
          background: selected
            ? alpha(theme.palette.primary.light, 0.1)
            : undefined,
        }}
      >
        <button
          className="flowbutton"
          onClick={onClickDeleteIcon}
          style={{ color: 'black', position: 'absolute', top: -10, right: 10 }}
        >
          ×
        </button>
        <FileSelect
          nodeId={nodeId}
          onChangeFilePath={(path) => {
            if (!Array.isArray(path)) {
              onChangeFilePath(path)
            }
          }}
          fileType={FILE_TYPE_SET.TC}
          filePath={filePath ?? ''}
        />
        <Handle
          type="source"
          position={Position.Right}
          id={toHandleId(nodeId, 'tc', 'TcData')}
          style={sourceHandleStyle}
        />
      </div>
    )
  },
)