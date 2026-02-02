import { createExpDbNode } from "components/Workspace/FlowChart/FlowChartNode/ExpDbNodeBase"
import { ExpDbSelectSingle } from "components/Workspace/FlowChart/FlowChartNode/ExpDbSelectComponents"

/**
 * MicroscopeExpdbFileNode - Single selection Microscope ExpDb node
 * Uses shared base component with specific configuration
 */
export const MicroscopeExpdbFileNode = createExpDbNode(
  "MicroscopeExpdbFileNode",
  {
    returnType: "MicroscopeExpdbData",
    handleName: "microscope",
  },
  ExpDbSelectSingle,
)
