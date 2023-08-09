import React from 'react'
import { ExperimentTable } from './ExperimentTable'

const Experiment = React.memo(() => {
  return (
    <div style={{ display: 'flex' }}>
      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          padding: 16,
        }}
      >
        <ExperimentTable />
      </main>
    </div>
  )
})

export default Experiment
