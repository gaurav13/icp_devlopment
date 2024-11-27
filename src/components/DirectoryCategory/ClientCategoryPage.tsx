'use client';
import React, { useEffect, useRef, useState } from 'react';
import Web3ListbyCategoryId from '@/components/web3Listcategory/Web3Listcategory';
import { makeEntryActor } from '@/dfx/service/actor-locator';
import { Row, Col, Breadcrumb, Dropdown, Spinner } from 'react-bootstrap';
import Link from 'next/link';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import arb from '@/assets/Img/Icons/arb.png';
import blockchain1 from '@/assets/Img/sidebar-icons/icon-blockchain-1.png';
import Defi1 from '@/assets/Img/sidebar-icons/icon-defi-1.png';
import Doa1 from '@/assets/Img/sidebar-icons/icon-dao-1.png';
import NFt1 from '@/assets/Img/sidebar-icons/icon-nft-1.png';
import Metaverse1 from '@/assets/Img/sidebar-icons/icon-metavers-1.png';
import Game1 from '@/assets/Img/sidebar-icons/icon-games-1.png';
import Coins1 from '@/assets/Img/Icons/icon-coins-2.png';
import directory2 from '@/assets/Img/Icons/icon-coins-1.png';
import { useConnectPlugWalletStore } from '@/store/useStore';
import logger from '@/lib/logger';
import { User } from '@/types/profile';
import { getImage } from '@/components/utils/getImage';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
import { canisterId as commentCanisterId } from '@/dfx/declarations/comment';
import DirectorySlider from '@/components/DirectorySlider/DirectorySlider';
import CompanySlider from '@/components/CompanySlider/CompanySlider';
import { fromNullable } from '@dfinity/utils';
import { profileAspect, TOP_CATEGORIES_PER_PAGE } from '@/constant/sizes';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import CategoriesList from '@/components/CategoriesList';
import useSearchParamsHook from '@/components/utils/searchParamsHook';
import ConnectModal from '@/components/Modal';
import { isUserConnected } from '@/components/utils/utcToLocal';
import { ADD_WEB3, CONTACT_US } from '@/constant/routes';
interface ClientCategoryPageProps {
  categoryId: string; // The category ID mapped from the category name
  category: string; // The user-friendly category name
}

const ClientCategoryPage: React.FC<ClientCategoryPageProps> = ({ categoryId, category }) => {
  const [content, setContent] = useState<string | null>(null);
  const [companyList, setCompanyList] = useState<any[]>([]);
  const [companyListSize, setCompanyListSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const { t, changeLocale } = useLocalization(LANG);
  const [user, setUser] = useState<User | null>();
  const [featuredImage, setFeaturedImage] = useState<string | null>();
  const urlparama = useSearchParamsHook();
  const searchParams = new URLSearchParams(urlparama);
  const [trendingDirectries, setTrendingDirectries] = useState<any>([]);
  const [trendingDirectriesIds, setTrendingDirectriesIds] = useState<any>([]);
  const [inputText, setInputText] = useState(t('Search for Companies'));
  const [trendingDirectriesLoading, setTrendingDirectriesLoading] =
    useState(true);
  const [showWeb3Model, setShowWeb3Model] = useState(false);

  const [Web3BlockchainDir, setWeb3BlockchainDir] = useState<any>([]);
  const [CryptoDir, setCryptoDir] = useState<any>([]);
  const [DefiDir, setDefiDir] = useState<any>([]);
  const [DaoDir, setDaoDir] = useState<any>([]);
  const [NFTDir, setNFTDir] = useState<any>([]);
  const [MetaverseDir, setMetaverseDir] = useState<any>([]);
  const [BlockchainGameDir, setBlockchainGameDir] = useState<any>([]);
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [Web3BlockchainDirLoading, setWeb3BlockchainDirLoading] =
    useState(true);
  const [CryptoDirLoading, setCryptoDirLoading] = useState(true);
  const [DefiDirLoading, setDefiDirLoading] = useState(true);
  const [DaoDirLoading, setDaoDirLoading] = useState(true);
  const [NFTDirLoading, setNFTDirLoading] = useState(true);
  const [MetaverseDirLoading, setMetaverseDirLoading] = useState(true);

  const [BlockchainGameDirLoading, setBlockchainGameDirLoading] =
    useState(true);
  const [forcePaginate, setForcePaginate] = useState(0);
  const [isGetting, setIsGetting] = useState(true);
  const [hideMyContent, setHideMyContent] = useState(true);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [categoriesSize, setCategoriesSize] = useState(0);
  const promote = searchParams.get('promoted');
  
  const [categories, setCategories] = useState<any>([]);
  const [companyListOfIdSize, setCompanyListOfIdSize] = useState<any>(0);

  const [results, setResults] = useState<any>([]);
  const [companyListOfId, setCompanyListOfId] = useState<any>([]);
  const [OldCategory, setOldCategory] = useState<any>({
    name: '',
    logo: blockchain1,
    description: '', // Add description here
  });

  const { auth, setAuth, identity } = useConnectPlugWalletStore((state) => ({
    auth: state.auth,
    setAuth: state.setAuth,
    identity: state.identity,
  }));
  const itemsPerPage = 6;
  let pageCount = Math.ceil(companyListOfIdSize / itemsPerPage);
  // Fetch initial content or metadata
  const fetchCategoryData = async (categoryId: string) => {
    // Simulated API or data call
    return `This is the content for category ID: ${categoryId}`;
  };

  // Fetch companies by category
  const fetchCompaniesByCategory = async (page: number = 0) => {
    setLoading(true);
    try {
      const entryActor = makeEntryActor({
        agentOptions: {}, // Adjust options if needed
      });

      const tempWeb3 = await entryActor.getWeb3ListOfAllUsers(
        categoryId,
        '', // Add any search terms here if needed
        page,
        itemsPerPage
      );

      const companies = tempWeb3?.web3List || [];
      const totalCompanies = parseInt(tempWeb3?.amount || '0', 10);
      setCompanyListSize(totalCompanies);

      const processedCompanies = await Promise.all(
        companies.map(async (company: any) => {
          company[1].companyBanner = await getImage(company[1].companyBanner);
          company[1].founderImage = await getImage(company[1].founderImage);
          company[1].companyLogo = await getImage(company[1].companyLogo);
          return company;
        })
      );

      setCompanyList(processedCompanies);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast.error('Error fetching companies.');
    } finally {
      setLoading(false);
    }
  };

  // Handle page changes

  // Initialize data on component mount
  useEffect(() => {
    fetchCategoryData(categoryId).then((data) => {
      setContent(data); // Replace `data` with the actual fetched response
    });

    fetchCompaniesByCategory(0); // Fetch initial companies
  }, [categoryId]);
{/*------Start of code--------------*/}
let addcompanyfn = (e: any) => {
    e.preventDefault();
    // if (!identity) return toast.error('Please connect to internet identity.');
    if (!isUserConnected(auth, handleConnectModal)) return;
    setShowWeb3Model(true);
  };

  function searchbtnclicked() {
    getAllWeb3List(search);
    if (categoryId) {
      getCategory();

      getCompniesByCategory(search, 0, itemsPerPage);
    } else {
      getDirectoriesTopCategories();
    }
  }
  function resetbtnclicked() {
    setSearch('');
    getAllWeb3List();
    if (categoryId) {
      getCategory();

      getCompniesByCategory('', 0, itemsPerPage);
    } else {
      getDirectoriesTopCategories(true);
    }
  }
  let getCompniesByCategory = async (
    searchString = '',
    pageCount: any,
    itemsPerPage: any
  ) => {
    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });

    let TempDirectory = null;
    let tempWeb3 = await entryActor.getWeb3ListOfAllUsers(
      categoryId,
      searchString,
      pageCount,
      itemsPerPage
    );
    let amountOfcompany = parseInt(tempWeb3?.amount);
    setCompanyListOfIdSize(amountOfcompany);
    if (tempWeb3?.web3List?.length != 0) {
      let web3array = tempWeb3.web3List;

      for (let dirc = 0; dirc < web3array.length; dirc++) {
        let resp = await entryActor.get_category(web3array[dirc][1].catagory);
        let category: any = fromNullable(resp);
        let categoryName = 'No Category';
        if (category) {
          categoryName = category.name;
        }
        web3array[dirc][1].catagory = categoryName;
        web3array[dirc][1].companyBanner = await getImage(
          web3array[dirc][1].companyBanner
        );
        web3array[dirc][1].founderImage = await getImage(
          web3array[dirc][1].founderImage
        );
        web3array[dirc][1].companyLogo = await getImage(
          web3array[dirc][1].companyLogo
        );
      }
      TempDirectory = web3array.sort(
        (f: any, l: any) => Number(l[1].likes) - Number(f[1].likes)
      );
    }
    if (TempDirectory) {
      setCompanyListOfId(TempDirectory);
    } else {
      setCompanyListOfId([]);
    }
    setIsGetting(false);
  };
  const getCategory = async () => {
    if (!categoryId) {
      return;
    }
    const defaultEntryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    try {
      const resp = await defaultEntryActor.get_category(categoryId); // Fetch category details
      const category: any = fromNullable(resp); // Ensure safe access to nullable data
  
      if (category) {
        console.log("Fetched Category Data:", category); // Debugging log
        setOldCategory({
          name: category.categoryName, // Use backend field for category name
          logo: await getImage(category.logo), // Fetch logo image
          description: category.categoryDescription, // Use backend field for description
        });
      } else {
        console.warn("Category not found for ID:", categoryId); // Log missing category
      }
    } catch (error) {
      console.error("Error fetching category data:", error); // Handle errors
      toast.error("Failed to fetch category details.");
    }
  };
  
  
  let getDirectoriesTopCategories = async (reset: boolean = false) => {
    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    let listCatagory = await entryActor.get_categories('', 0, TOP_CATEGORIES_PER_PAGE, false);
    if (listCatagory?.entries) {
      if (listCatagory?.entries.length != 0) {
        // logger(listCatagory, 'listCatagory');

        const resultsweb3 = [];

        for (const category of listCatagory?.entries) {
          const result = await getWeb3ByCategory(category[0], reset);
          category[1].logo = await getImage(category[1].logo);
          // Create a new object with the category and result
          const categoryResult = {
            category: category,
            companyList: result,
          };

          resultsweb3.push(categoryResult);
        }
        setResults(resultsweb3);
        setIsGetting(false);
      }
    }
  };
  let getAllWeb3List = async (searchString = '') => {
    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });

    let TempDirectory = null;
    let tempWeb3 = await entryActor.getWeb3ListOfAllUsers(
      'All',
      searchString,
      0,
      10
    );

    if (tempWeb3?.web3List?.length != 0) {
      let web3array = tempWeb3.web3List;
      let categoriesIds = [];
      for (let dirc = 0; dirc < web3array.length; dirc++) {
        let resp = await entryActor.get_category(web3array[dirc][1].catagory);
        categoriesIds.push(web3array[dirc][0]);
        let category: any = fromNullable(resp);
        let categoryName = 'No Category';
        if (category) {
          categoryName = category.name;
        }
        web3array[dirc][1].catagory = categoryName;
        web3array[dirc][1].companyBanner = await getImage(
          web3array[dirc][1].companyBanner
        );
        web3array[dirc][1].founderImage = await getImage(
          web3array[dirc][1].founderImage
        );
        web3array[dirc][1].companyLogo = await getImage(
          web3array[dirc][1].companyLogo
        );
      }
      setTrendingDirectriesIds(categoriesIds);
      TempDirectory = web3array.sort(
        (f: any, l: any) => Number(l[1].likes) - Number(f[1].likes)
      );
    }
    if (TempDirectory) {
      setTrendingDirectries(TempDirectory);
    } else {
      setTrendingDirectries([]);
    }
    setTrendingDirectriesLoading(false);
    // const promted = await entryActor.getPromotedEntries();
    // logger(promted, 'PROMTED ENTRIES');
  };
  let getWeb3ByCategory = async (catagoryId: string, reset?: boolean) => {
    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });

    let TempDirectory = [];
    let tempWeb3 = await entryActor.getWeb3ListOfAllUsers(
      catagoryId,
      reset ? '' : search,
      0,
      10
    );
    if (tempWeb3?.web3List?.length != 0) {
      // let web3array = tempWeb3.web3List.filter((e:string)=>e[0]!=directoryId);
      let web3array = tempWeb3.web3List;

      for (let dirc = 0; dirc < web3array.length; dirc++) {
        web3array[dirc][1].companyBanner = await getImage(
          web3array[dirc][1].companyBanner
        );
        web3array[dirc][1].founderImage = await getImage(
          web3array[dirc][1].founderImage
        );
        web3array[dirc][1].companyLogo = await getImage(
          web3array[dirc][1].companyLogo
        );
      }
      TempDirectory = web3array;
    }
    return TempDirectory;
  };
  const handlePageClick = async (event: any) => {
    // setIsGetting(true);

    setForcePaginate(event.selected);
    const newOffset = (event.selected * itemsPerPage) % companyListOfIdSize;
    getCompniesByCategory('', newOffset, itemsPerPage);
  };
  const handlefouce = (e: any) => {
    e.preventDefault();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      getAllWeb3List(search);

      if (categoryId) {
        getCategory();

        getCompniesByCategory(search, 0, itemsPerPage);
      } else {
        getDirectoriesTopCategories();
      }
    }
  };

  const handleConnectModal = () => {
    // e.preventDefault();
    setShowConnectModal(true);
    // setConnectLink(e);
  };
  const handleConnectModalClose = () => {
    setShowConnectModal(false);
  };

  let reFetchfn = () => {
    getAllWeb3List();
    if (categoryId) {
      getCategory();

      getCompniesByCategory('', 0, itemsPerPage);
    } else {
      getDirectoriesTopCategories();
    }
  };
  useEffect(() => {
    if (auth.state == 'anonymous' || auth.state === 'initialized') {
      getAllWeb3List();
      if (categoryId) {
        getCategory();

        getCompniesByCategory('', 0, itemsPerPage);
      } else {
        getDirectoriesTopCategories();
      }
    }
  }, [auth, promote, categoryId]);

  useEffect(() => {
    pageCount = Math.ceil(companyListOfIdSize / itemsPerPage);
  }, [companyListOfIdSize]);
{/*------List of End --------------*/}
  return (
     <>
  <style jsx>{`
    .flex-details-pnl {
      padding: 15px 0;
      border-bottom: 1px solid #ddd;
    }

    .tab-blue-list li {
      list-style: none;
      display: inline-block;
    }

    .tab-blue-list li a {
      color: #007bff;
      font-weight: 500;
    }

    .tab-blue-list li a:hover {
      text-decoration: underline;
    }

    .btn-outline-primary {
      border-color: #007bff;
      color: #007bff;
    }

    .btn-warning {
      background-color: #ffc107;
      border-color: #ffc107;
      color: #fff;
    }
      .search-input {
  width: 400px;
  height: 50px;
}
 .category-header {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 10px;
  text-transform: uppercase; /* Capitalizes the category */
}

.category-icon {
  margin-right: 8px;
  font-size: 18px;
  color: #007bff;
}

.category-results {
  margin-left: 8px;
  font-size: 18px;
  color: #555;
}

  `}</style>

    <main id='main'>
    <div className='main-inner web-page'>
      <div className='inner-content'>
      <Row>
      <Col xl='12' lg='12' md='12'>
                <Breadcrumb className='new-breadcrumb web'>
                  <Breadcrumb.Item>
                    <Link href='/'>
                      <i className='fa fa-home' />
                    </Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item active={categoryId ? false : true}>
                    <Link href={`/web3-directory`}>
                      {t('Web3 ')}
                      {t('webDirectory')}
                    </Link>
                  </Breadcrumb.Item>
                  {categoryId && (
                    <Breadcrumb.Item active={categoryId ? true : false}>
                      <Link href={`/web3-directory?category=${categoryId}`}>
                      {category}
                      </Link>
                    </Breadcrumb.Item>
                  )}
                </Breadcrumb>
              </Col>
              <Col xl='8' lg='8'>
               
               <h1 style={{ fontWeight: 700 }}>
                 {t('List of Web3 Companies')}
               </h1>
               <p> {companyListSize}
    {OldCategory.description ? (
      OldCategory.description
    ) : (
      t(
        "Welcome to our Web3 Directory! Your go-to resource for discovering companies working in the fields of blockchain technology, decentralized finance (DeFi), GameFi, NFTs, DAOs, and dApps."
      )
    )}
  </p>
             </Col>
             <Col xl='4' lg='4' className='text-right'>
               
                <div
                  className='search-post-pnl search-pnl small'
                  id='companySecrch'
                >
               <input
                    type='text'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='form-control'
                    placeholder={inputText}
                    onKeyDown={handleSearch}
                    ref={inputRef}
                  />
                  {search.length >= 1 && (
                    <button onClick={resetbtnclicked}>
                      <i className='fa fa-xmark mx-1' />
                    </button>
                  )}
              
                  <button onClick={searchbtnclicked}>
                    <i className='fa fa-search' />
                  </button>
                </div>
                <div className='spacer-30' />
              </Col>
              <Col xl='12' lg='12'>
                <h3>
                  
                  {t('Trending Companies')}
                </h3>
                <div className='spacer-30' />
              </Col>
              <Col xl='12' lg='12'>
                {trendingDirectriesLoading ? (
                  <Spinner className='d-flex m-auto' animation='border' />
                ) : (
                  <CompanySlider trendingDirectries={trendingDirectries} />
                )}
              </Col>
              <Col xl="12" lg="12">
              <div className="flex-details-pnl d-flex justify-content-between align-items-center py-3 flex-wrap">
  {/* Left Panel */}
  <div className="left-side-pnl d-flex align-items-center mb-3 mb-lg-0">
  <div
                  className='search-post-pnl search-pnl small'
                  id='companySecrch'
                >
               <input
                    type='text'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='form-control search-input'
                    placeholder={inputText}
                    onKeyDown={handleSearch}
                    ref={inputRef}
                  />
                  {search.length >= 1 && (
                    <button onClick={resetbtnclicked}>
                      <i className='fa fa-xmark mx-1' />
                    </button>
                  )}
              
                  <button onClick={searchbtnclicked}>
                    <i className='fa fa-search' />
                  </button>
                </div>

    
  </div>

  {/* Right Panel */}
  <div className="right-side-pnl d-flex align-items-center flex-wrap justify-content-end">
    <Link
      href={ADD_WEB3}
      className="btn btn-outline-primary btn-sm me-3 mb-2 mb-lg-0"
    >
      {t("Submit your Listing")}
    </Link>
    <Link href={CONTACT_US} className="btn btn-warning btn-sm">
      {t("FAQ")}
    </Link>
  </div>
</div>

</Col>


        </Row>
    <div>
    <Col>
  <h3 className="category-header mt-4">
    <span className="category-icon">
      <i className="fa fa-sitemap" aria-hidden="true"></i> {/* Icon */}
    </span>
    {category.toUpperCase()} <span className="category-results">{companyListSize} results</span>
  </h3>
</Col>

     
</div>
<div className='right-detail-pnl'>
                    {!categoryId &&
                      results.lenght != 0 &&
                      results.map((company: any, index: string) => {
                        return (
                          company.companyList.length != 0 && (
                            <div className='slide-cntnr mt-0' key={index}>
                              <h3 className='d-flex manu'>
                                <div
                                  style={{
                                    aspectRatio: profileAspect,
                                    height: '30px',
                                    width: '30px',
                                    position: 'relative',
                                  }}
                                  className='me-2'
                                >
                           {/*      <Image
                        src={ company.category[1]?.logo || blockchain1
                        }
                        fill
                        alt="Infinity"
                        className="rounded-circle"
                      />*/}

                                </div>
                                {company.category[1].name}
                              </h3>
                              <div className='slid-bg'>
                                <DirectorySlider
                                  relatedDirectory={company.companyList}
                                  trendingDirectriesIds={trendingDirectriesIds}
                                />
                              </div>
                            </div>
                          )
                        );
                      })}
                    {categoryId && (
                      <Row>
                        <Col xxl='12'>
                          {isGetting ? (
                            <div className='d-flex justify-content-center w-full'>
                              <Spinner />
                            </div>
                          ) : companyListOfId.length > 0 ? (
                            <div className='slide-cntnr'>
                              <h3 className='d-flex'>
                                <div
                                  style={{
                                    aspectRatio: profileAspect,
                                    height: '30px',
                                    width: '30px',
                                    position: 'relative',
                                  }}
                                  className='me-2'
                                >
                                 
                               {/*   <Image
                                    src={OldCategory.logo}
                                    fill
                                    alt='Infinity'
                                    className='rounded-circle'
                                  />*/}
                                </div>
                                {OldCategory.name}
                              </h3>
                              <div className='d-flex  flex-wrap '>
                                <Web3ListbyCategoryId
                                  relatedDirectory={companyListOfId}
                                  trendingDirectriesIds={trendingDirectriesIds}
                                />
                              </div>
                            </div>
                          ) : (
                            <p className='text-center'>
                              {t('No Company Found')}
                            </p>
                          )}
                        </Col>
                        <div className='pagination-container mystyle d-flex justify-content-center mt-3'>
                          {!isGetting && companyListOfId.length > 0 && (
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
                          )}
                        </div>
                      </Row>
                    )}
                  </div>
</div></div></main>
</>
  );
};

export default ClientCategoryPage;
