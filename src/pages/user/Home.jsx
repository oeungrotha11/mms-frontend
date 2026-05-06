import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className=''>
      <h1>hello world</h1><br />
      <div className='flex gap-5 '> 
      <Link to={'login'}><button className='bg-amber-600 p-2 rounded-2xl'>login</button></Link>
      <Link to={'register'}><button className='bg-amber-100 p-2 rounded-2xl'>register</button></Link>
      <Link to={'user'}><button className='bg-amber-100 p-2 rounded-2xl'>User</button></Link>
      <Link to={'watchmovies'}><button className='bg-amber-100 p-2 rounded-2xl'>watch movies</button></Link>
      </div>
    </div>
  )
}

export default Home
