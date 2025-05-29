import React from 'react'
import './Header.css'

const Header = () => {
  return (
    <div className='header'>
        <div className="header-contents">
            <h2>Order your favorite Food & Essentials here</h2>
            <p>Choose from a diverse collection featuring an array of products crafted and satisfy your experience.</p>
            <a href="#explore-menu"><button className='buttonwl'>View Collection</button></a>
        </div>
    </div>
  )
}

export default Header