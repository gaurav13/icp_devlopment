import React, { useEffect } from 'react';
import 'slick-carousel/slick/slick.css';
import Slider from 'react-slick';
import Link from 'next/link';
import Image from 'next/image';
import tempimg from '@/assets/Img/banner-1.png';
import logger from '@/lib/logger';
import { useRouter } from 'next/navigation';
import { formatLikesCount } from '@/components/utils/utcToLocal';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import {
  DIRECTORY_DINAMIC_PATH,
  DIRECTORY_STATIC_PATH,
} from '@/constant/routes';
import { Bold } from 'lucide-react';
export default React.memo(function DirectorySlider({
  relatedDirectory,
  trendingDirectriesIds,
}: {
  relatedDirectory: any;
  trendingDirectriesIds?: any;
}) {
  const router = useRouter();
  var Directory = {
    dots: null,
    infinite: true,
    speed: 500,
    slidesToShow: relatedDirectory.length > 6 ? 8 : 2,
    slidesToScroll: 8,
    responsive: [
      {
        breakpoint: 4000,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 6,
          infinite: false,
        },
      },
      {
        breakpoint: 3000,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
          infinite: false,
        },
      },
      {
        breakpoint: 2300,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: false,
        },
      },
      {
        breakpoint: 1900,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: false,
        },
      },
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: false,
        },
      },
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: false,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: false,
        },
      },
      {
        breakpoint: 790,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
        },
      },
    ],
  };

  let openArticleLink = (entryLink: any) => {
    router.push(entryLink);
  };
  const { t, changeLocale } = useLocalization(LANG);

  return (
    <>
    <style jsx>{`

.trending-button {
  display: inline-flex; 
  align-items: center; 
  background-color: #1e5fb3; 
  color:#fff;
  font-weight: bold; 
  font-size: 14px;
  padding: 2px 16px; 
  border-radius: 30px; 
  text-decoration: none; 
  transition: all 0.3s ease-in-out; 
}

.trending-button .icon {
  margin-right: 8px; 
  font-size: 20px; 
}

.trending-button:hover {
  background-color: #488adf; 
  color: #c9302c; 
  transform: scale(1.05);
}

      `}</style>
      {relatedDirectory.length != 0 ? (
        <Slider {...Directory}>
          {relatedDirectory.map((entry: any) => {
            let istrending = false;
            if (
              trendingDirectriesIds &&
              trendingDirectriesIds.includes(entry[0])
            ) {
              istrending = true;
            }
            return (
              <div
                className='Post-padding  d-flex justify-content-center mx-2'
                key={entry[0]}
              >
                
                <Link
                  href='#'
                  onClick={(e) => {
                    e.preventDefault();

                    openArticleLink(
                      entry[1].isStatic
                        ? `${DIRECTORY_STATIC_PATH + entry[0]}`
                        : `${
                            entry.length != 0
                              ? DIRECTORY_DINAMIC_PATH + entry[0]
                              : DIRECTORY_DINAMIC_PATH + '#'
                          }`
                    );
                  }}
                  className='Product-post direc'
                >
                  <div className='Product-post-inner'>
                  <div className='img-pnl position-relative'>
                    <Image
                      src={entry[1]?.companyBanner ?? tempimg}
                      alt='founder image'
                      height={100}
                      width={100}
                      className='h-100-w-auto customeImg'
                    />
                    {istrending && (
                      <p className='trending-button  mt-1'>
                        <i className="fa fa-line-chart" style={{ marginRight: '4px' }}  /> {t('Trending')}
                      </p>
                    )}
                  </div>
                    <div className='text-pnl'>
                      <div className='d-flex'>
                        <div className='logo-img'>
                          <Image
                            src={entry[1]?.companyLogo ?? '/images/l-b.png'}
                            width={15}
                            height={16}
                            alt='Blockza'
                          />
                        </div>
                        <div className='heading-txt-pnl'>
                          <p className='companyNameBox'>
                            {entry[1]?.company.length > 15
                              ? `${entry[1]?.company.slice(0, 15)}...`
                              : entry[1]?.company ?? ''}
                          </p>
                          <p className='shortDisc'>
                            {entry[1]?.shortDescription ?? ''}
                          </p>
                        </div>
                      </div>
                      {/*<ul>
                        <li>
                          {formatLikesCount(Number(entry[1]?.totalCount)) ?? 0}
                          <span>{t('Posts')}</span>
                        </li>
                        <li>
                          {formatLikesCount(Number(entry[1]?.views)) ?? 0}
                          <span>{t('Views')}</span>
                        </li>
                        <li>
                          {formatLikesCount(Number(entry[1]?.likes)) ?? 0}
                          <span>{t('Likes')}</span>
                        </li>
                      </ul>*/}
                    </div>
                  </div>
                  <div
                    className='txt-pnl  mx-width-405'
                    style={{ height: '135px' }}
                  >
                    <p style={{ overflow: 'hidden', height: '40px' }}>
                      <i>
                        {/* {entry[1]?.founderDetail.length > 50
                        ? `${entry[1]?.founderDetail.slice(0, 50)}...`
                        : entry[1]?.founderDetail ?? ''} */}
                        {entry[1]?.founderDetail}
                      </i>
                    </p>
                    <div className='img-pl'>
                      <Image
                        src={entry[1]?.founderImage ?? '/images/l-n.png'}
                        width={20}
                        height={20}
                        alt='Girl'
                      />

                      <div>
                        <p style={{ fontWeight: 600, fontSize: '18px' }}>
                          {entry[1]?.founderName?.slice(0, 19) ?? ''}
                        </p>
                        <p>{t('Founder')}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </Slider>
      ) : (
        <h6 className='text-center'>{t('No Related Company found')}</h6>
      )}
    </>
  );
});
