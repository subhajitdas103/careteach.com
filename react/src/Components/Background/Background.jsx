import './Background.css';

import image4 from '../../Assets/image4.jpg';
import image1 from '../../Assets/image1.png';
import image2 from '../../Assets/image2.jfif';
import image3 from '../../Assets/image3.png';

const Background = ({ playStatus, heroCount }) => {
  if (playStatus) {
    return <img src={image4} className="background" alt="background" />;
  } else if (heroCount === 0) {
    return <img src={image1} className="background" alt="background" />;
  } else if (heroCount === 1) {
    return <img src={image2} className="background" alt="background" />;
  } else if (heroCount === 2) {
    return <img src={image3} className="background" alt="background" />;
  }

  // Return null or a default fallback if none of the conditions are met
  return null;
};

// Default export
export default Background;
