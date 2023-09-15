import DatabaseExperiments from 'components/Database/DatabaseExperiments'
import PublicDatabaseWrapper from 'components/PublicDatabase/PublicDatabaseWrapper'

const PublicExperiments = () => {
  return (
    <PublicDatabaseWrapper>
      <DatabaseExperiments cellPath="/cells" />
    </PublicDatabaseWrapper>
  )
}

export default PublicExperiments
