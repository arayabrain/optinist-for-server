import { createExpDbNode } from "components/Workspace/FlowChart/FlowChartNode/ExpDbNodeBase"
import { ExpDbSelectMulti } from "components/Workspace/FlowChart/FlowChartNode/ExpDbSelectComponents"

/**
 * ExpdbBatchMicroscopeExpdbFileNode - Multi-selection Microscope ExpDb batch node
 * Uses shared base component with specific configuration
 */
export const ExpdbBatchMicroscopeExpdbFileNode = createExpDbNode(
  "ExpdbBatchMicroscopeExpdbFileNode",
  {
    returnType: "MicroscopeExpdbData",
    handleName: "microscope",
    multiSelect: true,
    hideImageColumns: true,
  },
  ExpDbSelectMulti,
)
