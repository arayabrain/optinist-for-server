import { useSelector } from "react-redux"

import DatabaseExperiments from "components/Database/DatabaseExperiments"
import DatabaseWrapper from "components/Database/DatabaseWrapper"
import { selectCurrentUser } from "store/slice/User/UserSelector"

const METADATA_EDITABLE = process.env.REACT_APP_EXPDB_METADATA_EDITABLE === "true"

const Experiments = () => {
  const user = useSelector(selectCurrentUser)
  return (
    <DatabaseWrapper>
      <DatabaseExperiments
        user={user}
        cellPath="/console/cells"
        readonly={false}
        metadataEditable={METADATA_EDITABLE}
      />
    </DatabaseWrapper>
  )
}

export default Experiments
