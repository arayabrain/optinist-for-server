import { ImageFileNode } from 'components/Workspace/FlowChart/FlowChartNode/ImageFileNode'
import { AlgorithmNode } from 'components/Workspace/FlowChart/FlowChartNode/AlgorithmNode'
import { CsvFileNode } from 'components/Workspace/FlowChart/FlowChartNode/CsvFileNode'
import { HDF5FileNode } from 'components/Workspace/FlowChart/FlowChartNode/HDF5FileNode'
import { FluoFileNode } from 'components/Workspace/FlowChart/FlowChartNode/FluoFileNode'
import { BehaviorFileNode } from 'components/Workspace/FlowChart/FlowChartNode/BehaviorFileNode'
import { MatlabFileNode } from 'components/Workspace/FlowChart/FlowChartNode/MatlabFileNode'
import { TcFileNode } from 'components/Workspace/FlowChart/FlowChartNode/TcFileNode'
import { TsFileNode } from 'components/Workspace/FlowChart/FlowChartNode/TsFileNode'
import { CustomEdge } from 'components/Workspace/FlowChart/CustomEdge'

export const reactFlowNodeTypes = {
  ImageFileNode,
  CsvFileNode,
  HDF5FileNode,
  AlgorithmNode,
  FluoFileNode,
  BehaviorFileNode,
  MatlabFileNode,
  TcFileNode,
  TsFileNode,
} as const

export const reactFlowEdgeTypes = {
  buttonedge: CustomEdge,
} as const
