{/*home page*/}

import React from 'react'

// in this home page , i made a saprerate cpmponent /core/Hpmepage - Button.jsx . for Button , so you can use that componant for  reuse of button  whenever you want button for home page . (by CTAButton or anything else )
const Home = () => {
  return (
    <div>
        {/*hero section ---*/} 

         {/* section 1 */}
         {/*  poster have in assets/Images -Poster1*/}
          {/* on this poster1 add a small section where is- some details of website an a ExploreMore button */}
           {/* i made a saprate component/core/HomePage - ExploreMore.jsx*/}

          {/*section 2 */}
          {/* in section 2  i want some courses in card form , and i can slide them by '<' and '>' , icons . at this time just make make them later i add courses in them  */}

         

         {/*footer section*/}
          {/*i made a saparete footer section in componenet/common/Footer.jsx  , so take from there */}


      
    </div>
  )
}

export default Home
