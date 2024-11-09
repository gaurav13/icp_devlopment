import React, { useState } from 'react';
import Link from 'next/link';
import TwitterSVGIcon from '@/components/twitterIconSVG/TwitterSVGIcon';
import { LANG } from '@/constant/language';

export default function SocialList() {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseOver = () => {
    setIsHovered(true);
  };

  const handleMouseOut = () => {
    setIsHovered(false);
  };
  return (
    <>
      <ul className='social-list '>
        <li>
          <Link href='mailto:support@blockza.io' target='_blank'>
            <i className='fa fa-envelope' />
          </Link>
        </li>
        <li
          className='d-lg-flex justify-content-lg-center'
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          <a
            href='https://twitter.com/nftstudio24'
            target='_blank'
            className='mb-0'
          >
            {/* <i className='fa-brands fa-x-twitter'/> */}
            <TwitterSVGIcon color='blue' />
            {/* {isHovered ? (
              <TwitterSVGIcon color='whiteHover' />
            ) : (
              <TwitterSVGIcon color='blue' />
            )} */}
          </a>
        </li>
        <li>
          <Link href='https://t.me/NFTStudio24_official' target='_blank'>
            <i className='fa fa-telegram' />
          </Link>
        </li>
        <li>
          <Link
            href='https://www.linkedin.com/company/nftstudio24-com?trk=public_profile_experience-item_profile-section-card_image-click&originalSubdomain=ng'
            target='_blank'
          >
            <i className='fa fa-linkedin-square' />
          </Link>
        </li>
        <li>
          <Link
            href={
              LANG == 'jp'
                ? ' https://www.youtube.com/channel/UCJiv6h14KpS5iWdGo_Cdf_Q'
                : 'https://www.youtube.com/@nftstudio24'
            }
            target='_blank'
          >
            <i className='fa fa-youtube-play' />
          </Link>
        </li>
        <li>
          <Link href='https://www.instagram.com/nftstudio24/' target='_blank'>
            <i className='fa fa-instagram' />
          </Link>
        </li>
      </ul>
    </>
  );
}
