import { createExpDbNode } from "components/Workspace/FlowChart/FlowChartNode/ExpDbNodeBase"
import { ExpDbSelectSingle } from "components/Workspace/FlowChart/FlowChartNode/ExpDbSelectComponents"

/**
 * ExpDbNode - Single selection ExpDb node
 * Uses shared base component with specific configuration
 */
export const ExpDbNode = createExpDbNode(
  "ExpDbNode",
  {
    returnType: "ExpDbData",
    handleName: "expdb",
  },
  ExpDbSelectSingle,
)
