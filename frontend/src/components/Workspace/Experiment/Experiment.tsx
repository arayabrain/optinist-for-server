import { memo } from "react"

import { ExperimentTable } from "components/Workspace/Experiment/ExperimentTable"
import { CONTENT_HEIGHT } from "const/Layout"

const Experiment = memo(function Experiment() {
  return (
    <div style={{ display: "flex" }}>
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          minHeight: CONTENT_HEIGHT,
        }}
      >
        <ExperimentTable />
      </main>
    </div>
  )
})

export default Experiment
