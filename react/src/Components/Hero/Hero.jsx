// import React from 'react'
import '/.Hero.css';
import arrow_btn from '../../Assets/arrow_btn.png'
import play_icon from '../../Assets/play_icon.png'
import pause_icon from '../../Assets/pause_btn.png'
 const Hero = (heroData,setHeroCount,heroCount,setPlayStatus,playStatus) => {
  return (
    <div className='hero'>
        <div className="hero-text">
         <p>{heroData.text1}</p>
         <p>{heroData.text2}</p>
        </div>
        <div className="hero-explore">
            <p>Explore the feature</p>
            {/* <img src='{arrow_btn} alt="/> */}
        </div>
    </div>
  )
}
