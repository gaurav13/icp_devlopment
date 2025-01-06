'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { useConnectPlugWalletStore } from '@/store/useStore';
import {
  makeCommentActor,
  makeEntryActor,

} from '@/dfx/service/actor-locator';
import logger from '@/lib/logger';
import { getImage, iframeimgThumbnail } from '@/components/utils/getImage';
import ReactPaginate from 'react-paginate';
import useSearchParamsHook from '@/components/utils/searchParamsHook';
import { debounce } from '@/lib/utils';
import GlobalSearchEntryItem from '@/components/GlobalContent/GlobalSearchEntryItem';
import { GLOBAL_SEARCH_ITEMS, PAGINATION_PAGE_RANGE } from '@/constant/sizes';
import { CAMPAIGNS } from '@/constant/routes';
import { usePathname, useRouter } from 'next/navigation';



export default function AllEntriesSearch({}) {
  const [entries, setEntries] = useState<undefined | any[]>();
  const [entriesSize, setEntriesSize] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [forcePaginate, setForcePaginate] = useState(0);
  const [search, setSearch] = useState('');
  const pageCount = Math.ceil(entriesSize / GLOBAL_SEARCH_ITEMS);
  const location = usePathname();
  const router = useRouter();

  const { auth, identity } = useConnectPlugWalletStore((state) => ({
    auth: state.auth,
    identity: state.identity,
  }));
  const entryActor = makeEntryActor({
    agentOptions: {
      identity,
    },
  });
  const commentsActor = makeCommentActor({
    agentOptions: {
      identity,
    },
  });
    /**
   * getRefinedList USE to refine data 
   * @parms list of entires
   * @return refined entries
   */
  const getRefinedList = async (tempEntriesList: any[]) => {
    if (!tempEntriesList || tempEntriesList?.length === 0) {
      return [];
    }
    const refinedPromise = await Promise.all(
      tempEntriesList?.map(async (entry: any) => {
        let image = null;

        if (entry[1].image) {
          image = getImage(entry[1].image[0]);
        }
        if (entry[1].podcastImg.length != 0) {
          image = getImage(entry[1].podcastImg[0]);
        }
        if (entry[1].podcastVideoLink != '') {
          image = iframeimgThumbnail(entry[1].podcastVideoLink);
        }
        const userId = entry[1].user.toString();

        const _comments = await commentsActor.getComments(entry[0]);
        let comments = 0;
        if (_comments.ok) {
          comments = _comments.ok[0].length;
        }

        let newItem = {
          id: entry[0],
          creation_time: entry[1].creation_time,
          image: image,
          title: entry[1].title,
          description: entry[1].description,
          isDraft: entry[1].isDraft,
          isPromoted: entry[1].isPromoted,
          userName: entry[1].userName,
          userId,
          status: entry[1].status,
          pressRelease: entry[1].pressRelease,
          comments,
          likes: parseInt(entry[1].likes),
          likedUsers: entry[1].likedUsers,
          isStatic: entry[1].isStatic,
          views: entry[1].views,
          seoExcerpt: entry[1].seoExcerpt,
          isPodcast: entry[1].isPodcast,
        };
        return newItem;
      })
    );

    return refinedPromise;
  };
   /**
   * getEntries USE to get entries
   * @parms {startIndex:number,str:string}
   * @return    _entries;
   */
  async function getEntries(startIndex:number,str:string) {

      const resp = await entryActor.getFeaturedEntriesList(
        str,
        startIndex,
        GLOBAL_SEARCH_ITEMS
      );
      const { entries: _entries, amount } = resp;
      logger(_entries,"_entries")
      let tempAmount = parseInt(amount);
      setEntriesSize(tempAmount);


        return _entries;
   

  }

    /**
   * handlePageClick use to navigate page
   * @parms event
   * @return   null;
   */
  const handlePageClick = async (event: any) => {

    setIsLoading(true);
    setForcePaginate(event.selected);
    const newOffset = (event.selected * GLOBAL_SEARCH_ITEMS) % entriesSize;
    const tempEntries = await getEntries(newOffset,search ??"");
    const refinedEntries = await getRefinedList(tempEntries);
    setEntries(refinedEntries);
    setIsLoading(false);
  };
  const { t, changeLocale } = useLocalization(LANG);
     /**
   * getNSetEntries use to navigate page
   * @parms search:string
   * @return   null;
   */
  const getNSetEntries = async (str:string) => {
    setIsLoading(true);
    const tempEntries = await getEntries(0,str);
    const refinedEntries = await getRefinedList(tempEntries);

    setEntries(refinedEntries);
    setIsLoading(false);
  };
  const debouncedFetchResults = useCallback(debounce(getNSetEntries, 600), []);

useEffect(()=>{

  debouncedFetchResults(search ?? "")
  
},[search])
useEffect(() => {
  if (location.startsWith(CAMPAIGNS) && !location.endsWith('/')) {
   router.push(`${CAMPAIGNS}/`);
 }
   }, [])
  return (
    <>
         <main id='main'>
         <div className='main-inner home'> 
          <Row><Col>
          <div className='d-flex align-items-center justify-content-end'>

          <div className='search-pnl small'>
                  <input
                    type='text'
                    className='form-control'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t('Search Feature Campaign')}
                  />
                  <button >
                    <i className='fa fa-search' />
                  </button>
                  </div>
                </div></Col></Row>
     {(entriesSize > 0 && !isLoading) &&  <div className='ps-4 pe-4'>
           
            <div className='event-innr'>
              <Col xl='12' lg='12' md='12'>
                <div className='spacer-50' />
                <h2>
         
                </h2>
                <div className='spacer-20' />
              </Col>
              <Col xl='12' lg='12' md='12'>
                <Row>
                  <Col>
                    <Row className='d-flex justify-content-between'>
                      {isLoading ? (
                        <div className='d-flex justify-content-center w-full'>
                          <Spinner />
                        </div>
                      ) : entries && entries.length != 0 ? (
                        entries.map((entry: any) => (
                          <GlobalSearchEntryItem entry={entry} entryActor={entryActor} />
                        ))
                      ) : (
                        <p className='d-flex justify-content-center w-full'>
                          {t(`No Campaign Found`)}{' '}
                          
                        </p>
                      )}
           
                    </Row>
                   {entriesSize > GLOBAL_SEARCH_ITEMS && <Row>
                      <Col>
                        <div className='pagination-container mystyle d-flex justify-content-center justify-content-md-end'>
                          {
                            <ReactPaginate
                              breakLabel='...'
                              nextLabel=''
                              onPageChange={handlePageClick}
                              pageRangeDisplayed={PAGINATION_PAGE_RANGE}
                              pageCount={pageCount}
                              previousLabel=''
                              renderOnZeroPageCount={null}
                              forcePage={forcePaginate}
                            />
                          }
                        </div>
                      </Col>
                    </Row>}
                  </Col>
                </Row>
              </Col>
            </div>
          </div>}
          </div>
          </main>
    </>
  );
}