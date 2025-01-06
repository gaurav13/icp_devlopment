'use client';
import React, { useEffect, useImperativeHandle, useState } from 'react';
import Head from 'next/head';
import { Row, Col, Table, Spinner } from 'react-bootstrap';
import Image from 'next/image';
import arrows from '@/assets/Img/Icons/icon-arrows.png';
import ReactPaginate from 'react-paginate';
import { usePathname, useRouter } from 'next/navigation';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { makeUserActor } from '@/dfx/service/actor-locator';
import { ConnectPlugWalletSlice } from '@/types/store';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { Rewardperpages_trans } from '@/constant/sizes';
import logger from '@/lib/logger';
import { utcToLocalAdmin } from '@/components/utils/utcToLocal';
import Link from 'next/link';
import { USERPROFILELINK } from '@/constant/routes';

function Items({ currentItems }: { currentItems: any}) {
  const { t, changeLocale } = useLocalization(LANG);
  return (
    <Col xl='12' lg='12'>
      <div className='full-div'>
        <div className='table-container lg'>
          <div className='table-inner-container'>
            <Table striped hover className='article-table transTable'>
              <thead>
                <tr>
                  <th>
                    <p>Sender</p>
                  </th>
                  <th>
                    <p>Receiver</p>
                  </th>
                  <th>
                    {' '}
                    <p>Amount </p>
                  </th>
                  <th className=''>
                    {' '}
                    <p>Date </p>
                  </th>
                  <th className=''>
                    {' '}
                    <p>Time </p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((entry: any, index: number) => {
                  let item = entry[1];
                  return (
                    <tr key={index}>
                      <td>
                        <Link
                          href={USERPROFILELINK + item?.from}
                          target='_blank'
                          className='myUserLink'
                        >
                          {item?.senderName.slice(0, 75)}
                          {item?.senderName.length > 75 && '...'}{' '}
                        </Link>
                      </td>

                      <td>
                        <Link
                          href={USERPROFILELINK + item?.to}
                          target='_blank'
                          className='myUserLink'
                        >
                          {item?.receiverName.slice(0, 75)}
                          {item?.receiverName.length > 75 && '...'}{' '}
                        </Link>
                      </td>
                      <td>{item?.amount}</td>
                      <td>{item?.date}</td>
                      <td>{item?.time}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </Col>
  );
}

export default function ArtificialAndMenualRewarsList({
  menual,
  btnRef
}: {
  menual: boolean;
  btnRef:any
}) {
  const [processedList, setProcessedList] = useState<any[]>([]);
  const [isGetting, setIsGetting] = useState(true);
  const [search, setSearch] = useState('');
  const [forcePaginate, setForcePaginate] = useState(0);
  const [showLoader, setShowLoader] = useState(false);
  const { t, changeLocale } = useLocalization(LANG);
  const [entriesSize, setEntriesSize] = useState<number>(0);
  const router = useRouter();
  const pathName = usePathname();
  const { auth, userAuth, identity } = useConnectPlugWalletStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    identity: (state as ConnectPlugWalletSlice).identity,
  }));

  const userActor = makeUserActor({
    agentOptions: {
      identity,
    },
  });

  const pageCount = Math.ceil(entriesSize / Rewardperpages_trans);
  let refinedTrans = (listTrans: any[]) => {
    if (!listTrans || listTrans?.length <= 0 || !Array.isArray(listTrans))
      return [];
    let mapData = listTrans.map((e: any) => {
      let item = e[1];

      item.time = utcToLocalAdmin(item.creation_time.toString(), 'hh:mm A');
      item.date = utcToLocalAdmin(item.creation_time.toString(), 'DD-MM-yyyy');
      item.amount = parseInt(item.amount);
      return e;
    });
    return mapData;
  };
  const handlePageClick = async (event: any) => {
    setForcePaginate(event.selected);
    const newOffset = event.selected * Rewardperpages_trans;
    getMenualAndArtificialRewardList(newOffset, search);
  };
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      getMenualAndArtificialRewardList(0, search);
    }
  };

  let getMenualAndArtificialRewardList = async (
    startIndex: number,
    tempSearch: string
  ) => {
    setIsGetting(true);
    let data = await userActor.getListOfArtificialAndMenualRewardList(
      menual,
      tempSearch,
      startIndex,
      Rewardperpages_trans
    );
    if (data) {
      let listTotal = Number(data?.amount) ?? 0;
      setEntriesSize(listTotal);
      let refinedData = refinedTrans(data?.reward);
      setProcessedList(refinedData);

      logger({ data, refinedData }, 'asjfkdsafdsagfsadf');
    }
    setIsGetting(false);
  };
  useImperativeHandle(btnRef, () => ({

    handleReFetch() {
      getMenualAndArtificialRewardList(0, '');
    }

  }));
  useEffect(() => {
    if (auth.state === 'initialized') {
      if (userAuth.userPerms?.articleManagement && !userAuth.isAdminBlocked) {
        getMenualAndArtificialRewardList(0, '');
      } else {
        router.replace('/super-admin');
      }
    } else if (auth.state === 'anonymous') {
      router.replace('/super-admin');
    }
  }, [identity, pathName, userAuth, auth]);

  return (
    userAuth.userPerms?.articleManagement &&
    !userAuth.isAdminBlocked && (
      <>
        <div className='main-inner admin-main'>
          <div className='section admin-inner-pnl' id='top'>
            <Row>
              <Col xl='12' lg='12'>
                <div className=''>
                  <Row>
                    <Col xl='8'>
                      <h1>
                        {menual ? 'Manuel' : 'Artificial'} Reward history{' '}
                      </h1>
                    </Col>
                    <Col xl='6' lg='6' className='mb-lg-5 mb-0'>
                      <ul className='all-filters-list v2'></ul>
                    </Col>
                    <Col xl='6' lg='6' className='mb-4'>
                      <div className='full-div text-right-md'>
                        <div></div>

                        <div>
                          <div className='search-post-pnl'>
                            <input
                              type='text'
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                              placeholder='Search Reward'
                              onKeyDown={handleSearch}
                            />
                            {search.length >= 1 && (
                              <button
                                onClick={(e: any) => {
                                  setSearch('');
                                  getMenualAndArtificialRewardList(0, '');
                                }}
                              >
                                <i className='fa fa-xmark mx-1' />
                              </button>
                            )}
                            <button
                              onClick={() =>
                                getMenualAndArtificialRewardList(0, search)
                              }
                              ref={btnRef}
                            >
                              <i className='fa fa-search' />
                            </button>
                          </div>
                        </div>
                      </div>
                    </Col>

                    <Col lg='12'>
                      <div className='pagination-container mystyle d-flex justify-content-center justify-content-md-end'>
                        {
                          <ReactPaginate
                            breakLabel='...'
                            nextLabel=''
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={5}
                            pageCount={pageCount}
                            previousLabel=''
                            renderOnZeroPageCount={null}
                            forcePage={forcePaginate}
                          />
                        }
                      </div>
                    </Col>
                    {isGetting || showLoader ? (
                      <div className='d-flex justify-content-center w-full'>
                        <Spinner />
                      </div>
                    ) : processedList.length > 0 ? (
                      <Items currentItems={processedList} />
                    ) : (
                      <div className='d-flex justify-content-center w-ful'>
                        <h3>No Record Found</h3>
                      </div>
                    )}
                  </Row>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </>
    )
  );
}
