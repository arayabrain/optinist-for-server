import { Box, styled } from "@mui/material";
import DatabaseCells from "components/DatabaseCells";
import DatabaseExperiments from "components/DatabaseExperiments";
import { useState } from "react";
import { useSelector } from 'react-redux'
import { selectCurrentUser } from 'store/slice/User/UserSelector'

const Database = () => {
  const user = useSelector(selectCurrentUser)
  const [typeTable, setTypeTable] = useState("experiments")

  const handleTypeTable = (type: string) => {
    if(typeTable === type) return
    setTypeTable(type)
  }

  return (
    <DataBaseWrapper>
      <Box>
        <ButtonExperiments
          onClick={() => handleTypeTable("experiments")}
          sx={{ fontWeight: typeTable === "experiments" ? 600 : 400}}
        >
          Experiments
        </ButtonExperiments>
        /
        <ButtonCells
          onClick={() => handleTypeTable("cells")}
          sx={{ fontWeight: typeTable === "cells" ? 600 : 400}}
        >
          Cells
        </ButtonCells>
      </Box>
      <DataBasePublicContent>
        {
          typeTable === "experiments" ?
            <DatabaseExperiments
              user={window.location.pathname === "/database-public" ? undefined : user}
              setTypeTable={setTypeTable}
            /> :
            <DatabaseCells />
        }
      </DataBasePublicContent>
    </DataBaseWrapper>
  )
}

const DataBaseWrapper = styled(Box)(({theme}) => ({
  marginTop: 48,
  paddingBottom: 30
}))

const ButtonExperiments = styled('span')(({theme}) => ({
  display: "inline-block",
  cursor: "pointer",
  minWidth: 100
}))

const ButtonCells = styled('span')(({theme}) => ({
  cursor: "pointer",
  marginLeft: 5
}))

const DataBasePublicContent = styled(Box)(({theme}) => ({
  width: "94vw",
  margin: "auto",
  marginTop: 15
}))

export default Database;