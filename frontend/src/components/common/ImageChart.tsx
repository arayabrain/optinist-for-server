const ImageChart = ({data}: {data: string[] | string}) => {
  if(!data) return null
  if(typeof data === 'string') {
    return (
        <img
            src={data}
            alt={""}
            width={100}
            height={100}
        />
    )
  }
  return <>
    {
      data.filter(Boolean).map((item, index) => (
          <img
              key={index}
              src={item}
              alt={""}
              width={100}
              height={100}
          />
      ))
    }
  </>
}

export default ImageChart;
