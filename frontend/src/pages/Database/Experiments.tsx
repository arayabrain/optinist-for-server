import DatabaseExperiments from 'components/Database/DatabaseExperiments'
import DatabaseWrapper from 'components/Database/DatabaseWrapper'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from 'store/slice/User/UserSelector'

const Experiments = () => {
  const user = useSelector(selectCurrentUser)

  return (
    <DatabaseWrapper>
      <DatabaseExperiments user={user} cellPath="/console/cells" />
    </DatabaseWrapper>
  )
}

export default Experiments
