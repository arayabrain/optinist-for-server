import DatabaseCells from 'components/Database/DatabaseCells'
import DatabaseWrapper from 'components/Database/DatabaseWrapper'

const Cells = () => {
  return (
    <DatabaseWrapper>
      <DatabaseCells />
    </DatabaseWrapper>
  )
}

export default Cells
