import { Metadata } from 'next';
import * as React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { siteConfig } from '@/constant/config';
import '@/styles/App.scss';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'tippy.js/dist/tippy.css';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s `,
  },
  description: siteConfig.description,
  robots: 'index, follow',
  icons: {
    icon: `${siteConfig.url}/favicon/favicon.ico`,
    shortcut: `${siteConfig.url}/favicon/favicon-16x16.png`,
    apple: `${siteConfig.url}/favicon/apple-touch-icon.png`,
  },
  applicationName: 'BlockZa',
  manifest: `${siteConfig.url}/favicon/site.webmanifest`,
  openGraph: {
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: 'BlockZa',
    images: [`${siteConfig.url}/images/og.jpg`],
    type: 'website',
    locale: LanguageForSchema,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [`${siteConfig.url}/images/og.jpg`],
    creator: '@BlockZa',
  },

  // authors: [
  //   {
  //     name: 'Actual Author Name',
  //     url: 'https://actualauthorurl.com/',
  //   },
  // ],
};


import { ToastContainer } from 'react-toastify';
import Footer from '@/components/Footer/Footer';
import NavBarNew from '@/components/NavBar/NavabrNew';
import NewSidebarHome from '@/components/SideBarHome/NewSideBarHome';
import { LANG, LanguageForSchema } from '@/constant/language';
import MainLayoutScript from '@/components/Scripts/MainLayoutScript';
export default function RootLayout({
  children,
  hide,
}: {
  children: React.ReactNode;
  hide?: boolean;
}) {
  return (
    <html lang={LANG === 'en' ? 'en' : 'ja-JP'}>
      {/* <Head> */}
      <head>
        
        <link
          href='https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'
          rel='stylesheet'
        />


        {/* <link
          href='https://fonts.googleapis.com/css2?family=Inter:wght@100;300;400;500;600;700&family=Literata:opsz,wght@7..72,300;7..72,400;7..72,500;7..72,600;7..72,700;7..72,800&display=swap'
          rel='stylesheet'
        /> */}
        {/* <script src='http://localhost:8097'/> */}
        {/* Google tag (gtag.js) */}
        {/* <!-- Google tag (gtag.js) --> */}
         

     

     

    
      </head>
      {/* </Head> */}
      <body className={`${LANG == 'jp' ? 'ENStyle' : ''}`}>
       
      

        <NewSidebarHome />
        <NavBarNew />
        {children}
        <Footer />
        <ToastContainer theme='light' autoClose={3000} />



      {LANG=="en"?<script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-5FJ6DN4R');`,
          }}
        />:  <script
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-K6TFQL22');`,
        }}
      />}

  <noscript><iframe src={LANG=="en"?"https://www.googletagmanager.com/ns.html?id=GTM-5FJ6DN4R":"https://www.googletagmanager.com/ns.html?id=GTM-K6TFQL22"}
height="0" width="0" style={{display:'none',visibility:"hidden"}}></iframe></noscript>

        <script
          src='https://kit.fontawesome.com/b4b056bd78.js'
          crossOrigin='anonymous'
        />
           {LANG=="en"?<script
          dangerouslySetInnerHTML={{
            __html: `
              window.embeddedChatbotConfig = {
                chatbotId: "vXOyMigraOFfiJ7f5O1Il",
                domain: "www.chatbase.co"
              };
            `,
          }}
        />:<script
        dangerouslySetInnerHTML={{
          __html: `
               window.embeddedChatbotConfig = {
        chatbotId: "384SXpy6Uf9FJnTpRTgef",
        domain: "www.chatbase.co"
        }
          `,
        }}
      />}
        {/* Embedded Chatbot Script */}
        {LANG=="en"?<script
          src="https://www.chatbase.co/embed.min.js"
          defer
          chatbotId="vXOyMigraOFfiJ7f5O1Il"
          domain="www.chatbase.co"
        ></script>:
        <script
        src="https://www.chatbase.co/embed.min.js"
        chatbotId="384SXpy6Uf9FJnTpRTgef"
        domain="www.chatbase.co"
        defer>
        </script>}
      </body>
    </html>
  );
}
