import { useSelector } from "react-redux"

import DatabaseExperiments from "components/Database/DatabaseExperiments"
import DatabaseWrapper from "components/Database/DatabaseWrapper"
import { selectCurrentUser } from "store/slice/User/UserSelector"

const METADATA = process.env.REACT_APP_EXPDB_METADATA_EDITABLE === "true"

const Experiments = () => {
  const user = useSelector(selectCurrentUser)
  return (
    <DatabaseWrapper>
      <DatabaseExperiments
        user={user}
        readonly={!METADATA}
        cellPath="/console/cells"
      />
    </DatabaseWrapper>
  )
}

export default Experiments
