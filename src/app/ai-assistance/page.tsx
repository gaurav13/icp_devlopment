'use client';
import React, { useEffect, useRef, useState } from 'react';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
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
import Image from 'next/image';
import Link from 'next/link';
import map from '@/assets/Img/Icons/icon-map.png';
import icondelivery from '@/assets/Img/Icons/icon-delivery.png';
import iconmail from '@/assets/Img/Icons/icon-attach.png';
import iconcall from '@/assets/Img/Icons/icon-call.png';
import MarketSentimentChart  from '@/components/MediaGraph/LineChart';
import NewsComponent  from '@/components/googlenews/news';
import LinkndindataComponent  from '@/components/linkendindata/linkndindata';
import logger from '@/lib/logger';
import {
  Formik,
  FormikProps,
  Form as FormikForm,
  Field,
  FormikValues,
  ErrorMessage,
  FormikHelpers,
} from 'formik';
import { number, object, string } from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { EMAIL_VALIDATE } from '@/constant/regulerExpression';
import { siteConfig } from '@/constant/config';
import { usePathname, useRouter } from 'next/navigation';
export default function ContactUs() {
  const [isSending, setIsSending] = useState(false);
  const { t, changeLocale } = useLocalization(LANG);
  const location = usePathname();
  const router = useRouter();
  const contectUsInValues = {
    email: '',
    name: '',
    messge: '',
  };
  const contectUsSchema = object().shape({
    email: string()
      .required(t('Email is required'))
      .trim()
      .matches(EMAIL_VALIDATE, t('Invalid Email')),
    name: string()
      .min(3, "Name can't be less then 3 characters.")
      .max(50, "Name can't be more then 50 characters.")
      .required(t('Name is required')),
    message: string()
      .min(10, "Message can't be less then 10 characters.")
      .max(500, "Message can't be more then 500 characters.")
      .required(t('Message is required')),
  });
  const contactFormikRef = useRef<FormikProps<FormikValues>>(null);

  let handleSubmitfn = async (e: any) => {
    setIsSending(true);
    try {
      const response = await axios.post(
        `${process.env.BASE_URL}email/contactUs`,
        {
          email: e.email,
          name: e.name,
          message: e.message,
        }
      );
      if (response) {
        toast.success(
          t(
            "Your message has been successfully submitted. We'll get back to you shortly. Thank you!"
          )
        );
        setIsSending(false);
        contactFormikRef.current?.resetForm();
        // toast.success(response);
      }
    } catch (error) {
      // logger(error,"sadfdsffdsf")
      toast.error(t('There was an issue while sending message'));
      setIsSending(false);
    }
  };
  useEffect(() => {
    if (location.startsWith("/contact-us") && !location.endsWith('/')) {
     router.push(`/contact-us/`);
   }
     }, [])
  return (
    <>
      <main id='main'>
        <div className='main-inner detail-inner-Pages pri-term-pnl'>
          <div className='inner-content'>
            <div className='pri-term-inner'>
            <iframe
                src={LANG=="en"?'https://www.chatbase.co/chatbot-iframe/vXOyMigraOFfiJ7f5O1Il':"https://www.chatbase.co/chatbot-iframe/384SXpy6Uf9FJnTpRTgef"}
                frameBorder='0'
                className='bootIframe'
              ></iframe>            </div>
          </div>
        </div>
      </main>
    </>
  );
}
