import {Box, styled} from "@mui/material";
import {useState} from "react";
import DatabaseExperiments from "./DatabaseExperiments";

const DatabasePublic = () => {
  const [typeTable, setTypeTable] = useState("experiments")

  const handleTypeTable = (type: string) => {
    if(typeTable === type ) return
    setTypeTable(type)
  }

  return (
      <DataBasePublicWrapper>
        <Switch>
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
        </Switch>
        <DataBasePublicContent>
          <DatabaseExperiments setTypeTable={setTypeTable} />
        </DataBasePublicContent>
      </DataBasePublicWrapper>
  )
}

const DataBasePublicWrapper = styled(Box)(({theme}) => ({
  marginTop: theme.spacing(6),
}))

const Switch = styled(Box)(({theme}) => ({

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

export default DatabasePublic;