import React from 'react'
import LoadingGif from '../Images/loading.gif'

const Loader = () => {
  return (
    <div className='loader'>
      <img className='loader-img' src={LoadingGif} alt="" />
    </div>
  )
}

export default Loader
