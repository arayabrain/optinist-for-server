import { Fragment } from 'react'

const ImageChart = ({ data }: { data: string[] | string }) => {
  if (!data) return null
  return (
    <Fragment>
      <img
        src={typeof data === 'string' ? data : data[0]}
        alt={''}
        width={100}
      />
    </Fragment>
  )
}

export default ImageChart
