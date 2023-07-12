import { Data, OrderByType } from "../components/DatabaseExperiments"

export const onSort: any = (initData: Data[], datas: Data[], orderBy: OrderByType, keySort: string) => {
  if(!datas || !keySort) return
  if(!orderBy) return [...initData]
  const getValue = (data: Data) => {
    const arrKey = keySort.split(".")
    let newData: any = ""
    arrKey.forEach(key => newData = data[key as keyof Data] || newData[key as keyof Data])
    return newData
  }
  if(orderBy === "ASC") {
    return datas.sort((a, b) => {
      if(getValue(a) < getValue(b)) {
        return 1
      }
      if(getValue(a) > getValue(b)) {
        return -1
      }
      return 0
    })
  }
  if(orderBy === "DESC") {
    return datas.sort((a, b) => {
      if(getValue(a) > getValue(b)) {
        return 1
      }
      if(getValue(a) < getValue(b)) {
        return -1
      }
      return 0
    })
  }
  return
}