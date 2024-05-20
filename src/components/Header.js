import React from 'react'
import { useNavigate } from 'react-router-dom'

function Header() {

  const navigate = useNavigate();


  return (
    <div className="header align-items-center justify-content-between">
    <div className="m-3">
      <img
        alt="logo image"
        className="logo"
        src="https://tse2.mm.bing.net/th?id=OIP.IqTRAs5mCxZsy-4d34QazgHaFr&pid=Api&P=0&h=180"
        onClick={()=>navigate('/')}
        style={{cursor:'pointer'}}
      />
    </div>
    <div className="mx-4">
      {/* <h3 className="m-0 logo-text">Artificial intelligence</h3> */}
    </div>
  </div>
  )
}

export default Header