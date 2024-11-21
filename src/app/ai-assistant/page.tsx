'use client';
import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Breadcrumb,
  Dropdown,
  Spinner,
  Form,
  Button,
} from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import meeting1 from '@/assets/Img/Profile/hinza-1.jpg';
import meeting2 from '@/assets/Img/Profile/hinza-2.jpg';
import Logo from '@/assets/Img/Logo/Logo.png';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import client1 from '@/assets/Img/Logo/client-logo-1.jpg';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import NewsComponent from '@/components/googlenews/news_old';

export default function HinzaAsif() {
  const { t, changeLocale } = useLocalization(LANG);
  const [hideMyContent, setHideMyContent] = useState(true);
  const [activeSection, setActiveSection] = useState('im-hinza');
  const location = usePathname();
  const router = useRouter();

  return (
    <>
      <main id="main">
        <div className="main-inner detail-inner-Pages pri-term-pnl">
          <div className="inner-content">
            <div>
              <h1 className="mb-4">Welcome to Blockza AI Assistant</h1>
            </div>
            <div className="pri-term-inner mt-4">
              <iframe
                src={
                  LANG === 'en'
                    ? 'https://www.chatbase.co/chatbot-iframe/vXOyMigraOFfiJ7f5O1Il'
                    : 'https://www.chatbase.co/chatbot-iframe/384SXpy6Uf9FJnTpRTgef'
                }
                style={{ border: '0' }}
                className="bootIframe w-100 rounded"
                height="400"
                title="Blockza AI Assistant"
              ></iframe>
            </div>
              <p>
              Discover the power of AI with Blockza! Our advanced AI technology ensures fast, accurate results tailored to your needs. By listing your information on the Blockza platform, you guarantee maximum visibility and quick access to your content, complete with direct links to your information. Take control of your online presence with Blockza today!</p>
           

              {/* Information Boxes */}
              <div className="alert alert-secondary mt-5">
                
                <p>Say goodbye to information overload. Blockza delivers everything you need to know in one clip, making your life easier and more informed.</p>
              </div>

             

             
            
         
          </div>
        </div>
      </main>
    </>
  );
}
