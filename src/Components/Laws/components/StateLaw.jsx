import { ArrowLeftIcon } from '@heroicons/react/outline'
import { Button, Card, CardBody, CardHeader } from '@material-tailwind/react'
import React from 'react'

const StateLaw = ({ onBack, data}) => {
  return (
    <div className='flex flex-col mt-32'>
        <button className='bg-pink-500 ' onClick={onBack}>back</button>
        <div>
            {data.map((law ,index)=>(
                <div key={index}>
                    <p>{law.title}</p>
                </div>
            ))}
        </div>
    </div>
  )
}

export default StateLaw