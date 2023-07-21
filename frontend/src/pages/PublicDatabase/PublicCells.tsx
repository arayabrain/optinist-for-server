import DatabaseCells from 'components/Database/DatabaseCells'
import PublicDatabaseWrapper from 'components/PublicDatabase/PublicDatabaseWrapper'

const PublicCells = () => {
  return (
    <PublicDatabaseWrapper>
      <DatabaseCells />
    </PublicDatabaseWrapper>
  )
}

export default PublicCells
