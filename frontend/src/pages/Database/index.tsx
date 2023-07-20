import { Box, styled } from '@mui/material'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from 'store/slice/User/UserSelector'
import { useSearchParams } from 'react-router-dom'

const Database = () => {
  // const user = useSelector(selectCurrentUser)
  // const [typeTable, setTypeTable] = useState('experiments')
  // //eslint-disable-next-line
  // const [_, setParams] = useSearchParams()
  //
  // const handleTypeTable = (type: string, expId?: number) => {
  //   if (typeTable === type) return
  //   setTypeTable(type)
  //   setParams(type === 'cells' ? `exp_id=${expId}&sort=&sort=&limit=0&offset=0` : 'sort=&sort=&limit=0&offset=0')
  // }

  return (
    <DataBaseWrapper>
      {/*<Box>*/}
      {/*  <ButtonExperiments*/}
      {/*    onClick={() => handleTypeTable('experiments')}*/}
      {/*    sx={{ fontWeight: typeTable === 'experiments' ? 600 : 400 }}*/}
      {/*  >*/}
      {/*    Experiments*/}
      {/*  </ButtonExperiments>*/}
      {/*  /*/}
      {/*  <ButtonCells*/}
      {/*    onClick={() => handleTypeTable('cells')}*/}
      {/*    sx={{ fontWeight: typeTable === 'cells' ? 600 : 400 }}*/}
      {/*  >*/}
      {/*    Cells*/}
      {/*  </ButtonCells>*/}
      {/*</Box>*/}
      {/*<DataBasePublicContent>*/}
      {/*  <DatabaseComponent*/}
      {/*    isCell={typeTable !== 'experiments'}*/}
      {/*    setTypeTable={handleTypeTable}*/}
      {/*    user={user}*/}
      {/*  />*/}
      {/*</DataBasePublicContent>*/}
    </DataBaseWrapper>
  )
}

const DataBaseWrapper = styled(Box)(({ theme }) => ({
  marginTop: 48,
  paddingBottom: 30,
}))

const ButtonExperiments = styled('span')(({ theme }) => ({
  display: 'inline-block',
  cursor: 'pointer',
  minWidth: 100,
}))

const ButtonCells = styled('span')(({ theme }) => ({
  cursor: 'pointer',
  marginLeft: 5,
}))

const DataBasePublicContent = styled(Box)(({ theme }) => ({
  width: '94vw',
  margin: 'auto',
  marginTop: 15,
}))

export default Database
