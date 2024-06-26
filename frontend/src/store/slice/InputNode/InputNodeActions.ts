import { createAction } from "@reduxjs/toolkit"

import { INPUT_NODE_SLICE_NAME } from "store/slice/InputNode/InputNodeType"

export const setInputNodeFilePath = createAction<{
  nodeId: string
  filePath: string | string[]
}>(`${INPUT_NODE_SLICE_NAME}/setInputNodeFilePath`)
