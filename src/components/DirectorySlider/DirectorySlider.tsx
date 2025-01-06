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

  const Directory = {
    dots: null,
    infinite: true,
    speed: 500,
    slidesToShow: relatedDirectory?.length > 6 ? 8 : 2,
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
        breakpoint: 1200,
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

  return (
    <>
      <style jsx>{`
        .spinner-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 150px;
        }
        .spinner-border {
          width: 3rem;
          height: 3rem;
          border-width: 0.3rem;
        }
      `}</style>

      <div className="slide-bg position-relative">
        {relatedDirectory && relatedDirectory.length > 0 ? (
          <Slider {...Directory}>
            {relatedDirectory.map((entry: any) => {
              let isTrending = trendingDirectriesIds?.includes(entry[0]);

              return (
                <div
                  className="Post-padding d-flex justify-content-center mx-2"
                  key={entry[0]}
                >
                  <Link
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      openArticleLink(
                        entry[1]?.isStatic
                          ? `${DIRECTORY_STATIC_PATH + entry[0]}`
                          : `${DIRECTORY_DINAMIC_PATH + entry[0]}`
                      );
                    }}
                    className="Product-post direc"
                  >
                    <div className="Product-post-inner">
                      {/* Content goes here */}
                      {isTrending && (
                        <p className="trending-button mt-1">
                          <i
                            className="fa fa-line-chart"
                            style={{ marginRight: '4px' }}
                          />
                          Trending
                        </p>
                      )}
                    </div>
                  </Link>
                </div>
              );
            })}
          </Slider>
        ) : (
          <div className="spinner-container">
            <div className="spinner-border text-primary" role="status">Loading........</div>
          </div>
        )}
      </div>
    </>
  );
});
