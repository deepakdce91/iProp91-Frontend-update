
// Importing Dependencies
import React from 'react'
import LeftMessage from './LeftMessage'
import RightMessage from './RightMessage'

export default function MessageArea() {
    return (
        <>
            <div className="border rounded-lg  overflow-y-scroll no-scrollbar" style={{height:'calc(100vh - 140px)', backgroundImage:'url(/images/image.jpg)'}}>
                <LeftMessage img="./images/image2.jpg" text="Hello, Please have a look at this image" name="Jatin"  />
                <RightMessage img="./images/2.jpg" text="Hello, Please have a look at this image" name="Jatin"  />
                <LeftMessage  text="Hello, Please have a look at this document" name="Jatin"  />  
                <LeftMessage  text="Hello, Please have a look at this document" name="Jatin"  />  
                <LeftMessage video="./video/video.mp4" text="Hello, Please have a look at this document" name="Jatin"  />  
                <RightMessage  text="Hello, Please have a look at this document" name="Jatin"  />  
                <RightMessage video="./video/video.mp4" text="Hello, Please have a look at this document" name="Jatin"  />  
                <RightMessage audio="./audio/audio.mp3" text="Hello, Please have a look at this document" name="Jatin"  />  
                <LeftMessage audio="./audio/audio.mp3" text="Hello, Please have a look at this document" name="Jatin"  />  
                <LeftMessage doc="./doc/doc.pdf" text="Hello, Please have a look at this document" name="Jatin"  />  
                <RightMessage doc="./doc/doc.pdf" text="Hello, Please have a look at this document" name="Jatin"  />  
                <RightMessage img="./images/2.jpg" text="Hello, Please have a look at this document" name="Jatin"  />  
                <LeftMessage img="./images/2.jpg" text="Hello, Please have a look at this document" name="Jatin"  />  
            </div>
        </>
    )
}