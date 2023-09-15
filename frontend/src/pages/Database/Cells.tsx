import DatabaseCells from 'components/Database/DatabaseCells'
import DatabaseWrapper from 'components/Database/DatabaseWrapper'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from 'store/slice/User/UserSelector'

const Cells = () => {
  const user = useSelector(selectCurrentUser)

  return (
    <DatabaseWrapper>
      <DatabaseCells user={user}/>
    </DatabaseWrapper>
  )
}

export default Cells
