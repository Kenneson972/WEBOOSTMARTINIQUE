(function(){
  // Renseignez vos IDs pour activer GA4 et Hotjar
  const GA4_ID = '';// ex: 'G-XXXXXXX'
  const HOTJAR_ID = '';// ex: '1234567'

  if(GA4_ID){
    const s1 = document.createElement('script');
    s1.async = true; s1.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
    document.head.appendChild(s1);
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);} window.gtag = gtag;
    gtag('js', new Date()); gtag('config', GA4_ID);
  }

  if(HOTJAR_ID){
    (function(h,o,t,j,a,r){
      h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
      h._hjSettings={hjid:HOTJAR_ID,hjsv:6}; a=o.getElementsByTagName('head')[0];
      r=o.createElement('script');r.async=1;r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
      a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
  }
})();