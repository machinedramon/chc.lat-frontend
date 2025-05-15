/**
 * monetagScripts.ts
 * Este arquivo centraliza todos os scripts de monetização Monetag e Adcash.
 */

import { useEffect, useRef } from "react";

// Constantes para as IDs de zona e URLs do Monetag
const MONETAG_ZONE_IDS = {
  POPUP: 9315354, // ID da zona de Pop-under
  INTERSTITIAL: 9315359, // ID da zona de Interstitial
  VIGNETTE: 9315342, // ID da zona de Vignette
  IN_PAGE_PUSH: 9315348, // ID da zona de In-Page Push
  DIRECT_LINK: 9315360, // ID da zona de Direct Link
};

const MONETAG_DOMAIN = {
  POPUP: "madurird.com",
  INTERSTITIAL: "groleegni.net",
  VIGNETTE: "stoampaliy.net",
  IN_PAGE_PUSH: "dicouksa.com",
  DIRECT_LINK: "sawutser.top",
};

// Constante para o Adcash Native
const ADCASH_NATIVE_ZONE_ID = 9928274;

// Direct Link URL (para uso no botão final)
export const DIRECT_LINK_URL = `https://${MONETAG_DOMAIN.DIRECT_LINK}/4/${MONETAG_ZONE_IDS.DIRECT_LINK}`;

// Referências para controle de injeção
let popunderInjected = false;
let interstitial1Shown = false;
let interstitial2Shown = false;
let lastInterstitialTime = 0;
let adcashInitialized = false;

// Thresholds para injeção de scripts
export const INTERSTITIAL_THRESHOLD_1 = 35; // Porcentagem para mostrar o primeiro interstitial
export const INTERSTITIAL_THRESHOLD_2 = 75; // Porcentagem para mostrar o segundo interstitial
export const POPUNDER_THRESHOLD = 20; // Porcentagem para habilitar o pop-under

/**
 * Definir callbacks globais necessários para o Monetag
 */
function defineMonetageCallbacks() {
  // Para Pop-under
  window._izkiwzu = () => {
    console.log("Pop-under callback executed");
  };

  window._pelslgw = () => {
    console.log("Pop-under callback executed");
  };

  // Para Vignette
  window._qbbin = () => {
    console.log("Vignette callback executed");
  };

  window._wyguu = () => {
    console.log("Vignette callback executed");
  };

  // Para In-Page Push
  window._juyswjom = () => {
    console.log("In-Page Push callback executed");
  };

  window._iiswxcoi = () => {
    console.log("In-Page Push callback executed");
  };

  // Outros callbacks gerais que podem ser necessários
  window._ngmcubed = () => {
    console.log("General callback executed");
  };

  window._ugbxnlz = () => {
    console.log("General callback executed");
  };
}

// Chamar a definição de callbacks imediatamente
defineMonetageCallbacks();

/**
 * Inicializar o Adcash Native
 */
export const initializeAdcash = () => {
  if (adcashInitialized) return;
  adcashInitialized = true;

  // Adicionar o script exato do Adcash Native
  const script = document.createElement("script");
  script.id = "adcash-native-script";
  script.setAttribute("data-cfasync", "false");
  script.setAttribute("type", "text/javascript");
  script.textContent = `
    var adcashMacros = {};
    var zoneNativeSett={container:"awn",baseUrl:"onclickalgo.com/script/native.php",r:[${ADCASH_NATIVE_ZONE_ID}]};
    var urls={cdnUrls:["//superonclick.com","//geniusonclick.com"],cdnIndex:0,rand:Math.random(),events:["click","mousedown","touchstart"],useFixer:!0,onlyFixer:!1,fixerBeneath:!1};function acPrefetch(e){var t,n=document.createElement("link");t=void 0!==document.head?document.head:document.getElementsByTagName("head")[0],n.rel="dns-prefetch",n.href=e,t.appendChild(n);var r=document.createElement("link");r.rel="preconnect",r.href=e,t.appendChild(r)}var nativeInit=new function(){var a="",i=Math.floor(1e12*Math.random()),o=Math.floor(1e12*Math.random()),t=window.location.protocol,c={_0:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){for(var t,n,r,a,i,o,c="",s=0;s<e.length;)a=(t=e.charCodeAt(s++))>>2,t=(3&t)<<4|(n=e.charCodeAt(s++))>>4,i=(15&n)<<2|(r=e.charCodeAt(s++))>>6,o=63&r,isNaN(n)?i=o=64:isNaN(r)&&(o=64),c=c+this._0.charAt(a)+this._0.charAt(t)+this._0.charAt(i)+this._0.charAt(o);return c}};this.init=function(){e()};var e=function(){var e=document.createElement("script");e.setAttribute("data-cfasync",!1),e.src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",e.onerror=function(){!0,r(),n()},e.onload=function(){nativeForPublishers.init()},nativeForPublishers.attachScript(e)},n=function(){""!==a?s(i,t):setTimeout(n,250)},r=function(){var t=new(window.RTCPeerConnection||window.mozRTCPeerConnection||window.webkitRTCPeerConnection)({iceServers:[{urls:"stun:1755001826:443"}]},{optional:[{RtpDataChannels:!0}]});t.onicecandidate=function(e){!e.candidate||e.candidate&&-1==e.candidate.candidate.indexOf("srflx")||!(e=/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(e.candidate.candidate)[1])||e.match(/^(192\.168\.|169\.254\.|10\.|172\.(1[6-9]|2\d|3[01]))/)||e.match(/^[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7}$/)||(a=e)},t.createDataChannel(""),t.createOffer(function(e){t.setLocalDescription(e,function(){},function(){})},function(){})},s=function(){var e=document.createElement("script");e.setAttribute("data-cfasync",!1),e.src=t+"//"+a+"/"+c.encode(i+"/"+(i+5))+".js",e.onload=function(){for(var e in zoneNativeSett.r)d(zoneNativeSett.r[e])},nativeForPublishers.attachScript(e)},d=function(e){var t="jsonp"+Math.round(1000001*Math.random()),n=[i,parseInt(e)+i,o,"callback="+t],r="http://"+a+"/"+c.encode(n.join("/"));new native_request(r,e,t).jsonp()}},nativeForPublishers=new function(){var n=this,e=Math.random();n.getRand=function(){return e},this.getNativeRender=function(){if(!n.nativeRenderLoaded){var e=document.createElement("script");e.setAttribute("data-cfasync","false"),e.src=urls.cdnUrls[urls.cdnIndex]+"/script/native_render.js",e.onerror=function(){throw new Error("cdnerr")},e.onload=function(){n.nativeRenderLoaded=!0},n.attachScript(e)}},this.getNativeResponse=function(){if(!n.nativeResponseLoaded){var e=document.createElement("script");e.setAttribute("data-cfasync","false"),e.src=urls.cdnUrls[urls.cdnIndex]+"/script/native_server.js",e.onerror=function(){throw new Error("cdnerr")},e.onload=function(){n.nativeResponseLoaded=!0},n.attachScript(e)}},this.attachScript=function(e){var t;void 0!==document.scripts&&(t=document.scripts[0]),void 0===t&&(t=document.getElementsByTagName("script")[0]),t.parentNode.insertBefore(e,t)},this.fetchCdnScripts=function(){if(urls.cdnIndex<urls.cdnUrls.length)try{n.getNativeRender(),n.getNativeResponse()}catch(e){urls.cdnIndex++,n.fetchCdnScripts()}},this.scriptsLoaded=function(){if(n.nativeResponseLoaded&&n.nativeRenderLoaded){var e=[];for(zone in zoneNativeSett.r)document.getElementById(zoneNativeSett.container+"-z"+zoneNativeSett.r[zone])&&(e[zoneNativeSett.r[zone]]=new native_request("//"+zoneNativeSett.baseUrl+"?nwpsv=1&",zoneNativeSett.r[zone]),e[zoneNativeSett.r[zone]].build());for(var t in e)e[t].jsonp("callback",(e[t],function(e,t){setupAd(zoneNativeSett.container+"-z"+t,e)}))}else setTimeout(n.scriptsLoaded,250)},this.init=function(){var e;if(n.insertBotTrapLink(),0===window.location.href.indexOf("file://"))for(e=0;e<urls.cdnUrls.length;e++)0===urls.cdnUrls[e].indexOf("//")&&(urls.cdnUrls[e]="http:"+urls.cdnUrls[e]);for(e=0;e<urls.cdnUrls.length;e++)acPrefetch(urls.cdnUrls[e]);n.fetchCdnScripts(),n.scriptsLoaded()},this.insertBotTrapLink=function(){var e=document.createElement("a");e.href=window.location.protocol+"//onclickalgo.com/al/visit.php?al=1,4",e.style.display="none",e.style.visibility="hidden",e.style.position="relative",e.style.left="-1000px",e.style.top="-1000px",e.style.color="#fff",e.link='<a href="http://onclickalgo.com/al/visit.php?al=1,5"></a>',e.innerHTML="",document.body.appendChild(e)}};nativeInit.init();
  `;

  document.head.appendChild(script);

  // Adicionar o trap link do Adcash
  const trapLink = document.createElement("a");
  trapLink.href = "https://onclickalgo.com/al/visit.php?al=1,7";
  trapLink.style.position = "absolute";
  trapLink.style.top = "-1000px";
  trapLink.style.left = "-1000px";
  trapLink.style.width = "1px";
  trapLink.style.height = "1px";
  trapLink.style.visibility = "hidden";
  trapLink.style.display = "none";
  trapLink.style.border = "medium none";
  trapLink.style.backgroundColor = "transparent";
  document.body.appendChild(trapLink);

  // Adicionar noscript tag
  const noscript = document.createElement("noscript");
  const noscriptLink = document.createElement("a");
  noscriptLink.href = "https://onclickalgo.com/al/visit.php?al=1,6";
  noscriptLink.style.position = "absolute";
  noscriptLink.style.top = "-1000px";
  noscriptLink.style.left = "-1000px";
  noscriptLink.style.width = "1px";
  noscriptLink.style.height = "1px";
  noscriptLink.style.visibility = "hidden";
  noscriptLink.style.display = "none";
  noscriptLink.style.border = "medium none";
  noscriptLink.style.backgroundColor = "transparent";
  noscript.appendChild(noscriptLink);
  document.body.appendChild(noscript);

  console.log("Adcash Native script initialized");
};

/**
 * Preparar um elemento para o Adcash Native
 */
export const prepareAdcashSlot = (element: HTMLElement, index: number) => {
  if (!element || index !== 0) return; // Aplicar apenas ao primeiro slot

  // Limpar conteúdo existente
  element.innerHTML = "";

  // Criar div com o ID exato requerido pelo Adcash Native
  const adcashDiv = document.createElement("div");
  adcashDiv.id = `awn-z${ADCASH_NATIVE_ZONE_ID}`;

  // Adicionar ao elemento
  element.appendChild(adcashDiv);

  console.log(`Adcash Native slot prepared with ID: ${adcashDiv.id}`);
};

/**
 * Injetar script de Pop-under (Onclick)
 */
export const injectPopunderScript = (): HTMLScriptElement | null => {
  if (popunderInjected) return null;

  popunderInjected = true;

  // Criar um script que irá carregar o script principal do Pop-under
  const script = document.createElement("script");
  script.id = "monetag-popunder";
  script.type = "text/javascript";
  script.setAttribute("data-cfasync", "false");

  // Código que carrega o script Pop-under diretamente do servidor Monetag
  script.textContent = `
    (function(d, z, s, c) {
      s.src = "//" + d + "/tag.min.js";
      s.onerror = function() { 
        if (typeof _izkiwzu === 'function') _izkiwzu(); 
      };
      s.onload = function() { 
        if (typeof _pelslgw === 'function') _pelslgw(); 
      };
      s.setAttribute("data-zone", z);
      try {
        (document.body || document.documentElement).appendChild(s);
      } catch(e) {
        if (typeof c === 'function') c();
      }
    })("${MONETAG_DOMAIN.POPUP}", ${MONETAG_ZONE_IDS.POPUP}, document.createElement("script"));
  `;

  // Adicionar o script ao body do documento
  document.body.appendChild(script);

  console.log("Pop-under scripts loaded for zone ID:", MONETAG_ZONE_IDS.POPUP);
  return script;
};

/**
 * Injetar script de Interstitial
 */
export const injectInterstitialScript = (
  position: number
): HTMLScriptElement | null => {
  if (Date.now() - lastInterstitialTime < 20000) return null;
  if (position === 1 && interstitial1Shown) return null;
  if (position === 2 && interstitial2Shown) return null;

  // Marcar como exibido e atualizar timestamp
  position === 1 ? (interstitial1Shown = true) : (interstitial2Shown = true);
  lastInterstitialTime = Date.now();

  // Criar um script que irá carregar o script do Interstitial
  const script = document.createElement("script");
  script.id = `monetag-interstitial-${position}`;
  script.type = "text/javascript";
  script.setAttribute("data-cfasync", "false");

  // Código que carrega o script Interstitial diretamente do servidor Monetag
  script.textContent = `
    (function(d, z, s) {
      s.src = "//" + d + "/401/" + z;
      try {
        (document.body || document.documentElement).appendChild(s);
      } catch(e) {}
    })("${MONETAG_DOMAIN.INTERSTITIAL}", ${MONETAG_ZONE_IDS.INTERSTITIAL}, document.createElement("script"));
  `;

  // Adicionar o script ao body do documento
  document.body.appendChild(script);

  console.log(
    `Interstitial script ${position} loaded for zone ID:`,
    MONETAG_ZONE_IDS.INTERSTITIAL
  );
  return script;
};

/**
 * Injetar script de Vignette em um elemento específico
 */
export const injectVignetteScript = (
  element: HTMLElement,
  index: number
): HTMLScriptElement | null => {
  if (!element) return null;

  // Criar um script que irá carregar o script principal do Vignette
  const script = document.createElement("script");
  script.id = `monetag-vignette-${index}`;
  script.type = "text/javascript";
  script.setAttribute("data-cfasync", "false");

  // O callback a ser usado (alternando entre dois disponíveis)
  const callback = index % 2 === 0 ? "_qbbin" : "_wyguu";

  // Código que carrega o script Vignette diretamente do servidor Monetag
  script.textContent = `
    (function(d, z, s, c) {
      s.src = "//" + d + "/400/" + z;
      s.onerror = s.onload = E;
      function E() {
        c && c();
        c = null;
      }
      try {
        (document.body || document.documentElement).appendChild(s);
      } catch(e) {
        E();
      }
    })("${MONETAG_DOMAIN.VIGNETTE}", ${MONETAG_ZONE_IDS.VIGNETTE}, document.createElement("script"), ${callback});
  `;

  // Adicionar o script ao elemento do slot
  element.appendChild(script);

  console.log(
    `Vignette script loaded in slot ${index} for zone ID:`,
    MONETAG_ZONE_IDS.VIGNETTE
  );
  return script;
};

/**
 * Injetar script de In-Page Push em um elemento específico
 */
export const injectInPagePushScript = (
  element: HTMLElement,
  index: number
): HTMLScriptElement | null => {
  if (!element) return null;

  // Criar um script que irá carregar o script principal do In-Page Push
  const script = document.createElement("script");
  script.id = `monetag-inpage-push-${index}`;
  script.type = "text/javascript";
  script.setAttribute("data-cfasync", "false");

  // O callback a ser usado (alternando entre dois disponíveis)
  const callback = index % 2 === 0 ? "_juyswjom" : "_iiswxcoi";

  // Código que carrega o script In-Page Push diretamente do servidor Monetag
  script.textContent = `
    (function(d, z, s, c) {
      s.src = "//" + d + "/400/" + z;
      s.onerror = s.onload = E;
      function E() {
        c && c();
        c = null;
      }
      try {
        (document.body || document.documentElement).appendChild(s);
      } catch(e) {
        E();
      }
    })("${MONETAG_DOMAIN.IN_PAGE_PUSH}", ${MONETAG_ZONE_IDS.IN_PAGE_PUSH}, document.createElement("script"), ${callback});
  `;

  // Adicionar o script ao elemento do slot
  element.appendChild(script);

  console.log(
    `In-Page Push script loaded in slot ${index} for zone ID:`,
    MONETAG_ZONE_IDS.IN_PAGE_PUSH
  );
  return script;
};

/**
 * Limpar tags script do Monetag e Adcash quando necessário
 */
export const cleanupScripts = () => {
  const scriptIds = [
    "monetag-popunder",
    "monetag-interstitial-1",
    "monetag-interstitial-2",
    "monetag-vignette",
    "monetag-inpage-push",
    "adcash-library-script",
  ];

  scriptIds.forEach((id) => {
    const script = document.getElementById(id);
    if (script?.parentNode) {
      script.parentNode.removeChild(script);
    }
  });

  // Reiniciar os flags de controle
  popunderInjected = false;
  interstitial1Shown = false;
  interstitial2Shown = false;
  lastInterstitialTime = 0;
  adcashInitialized = false;
};

/**
 * Hook para gerenciar o script de Pop-under baseado na porcentagem de scroll
 */
export const usePopunderOnScroll = (threshold = POPUNDER_THRESHOLD) => {
  useEffect(() => {
    let popunderAdded = false;

    const handleScroll = () => {
      if (popunderAdded) return;

      const scrollPosition = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const maxPossibleScroll = scrollHeight - clientHeight;

      // Calcular a porcentagem de scroll
      const percentage = (scrollPosition / maxPossibleScroll) * 100;

      // Adicionar o script de pop-under quando atingir o threshold
      if (percentage >= threshold) {
        injectPopunderScript();
        popunderAdded = true;
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Também verificar no carregamento inicial
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshold]);
};

/**
 * Hook para gerenciar Interstitials baseados na porcentagem de scroll
 */
export const useInterstitialOnScroll = () => {
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const maxPossibleScroll = scrollHeight - clientHeight;

      // Calcular a porcentagem de scroll
      const percentage = (scrollPosition / maxPossibleScroll) * 100;

      // Mostrar o primeiro interstitial
      if (percentage >= INTERSTITIAL_THRESHOLD_1 && !interstitial1Shown) {
        injectInterstitialScript(1);
      }

      // Mostrar o segundo interstitial
      if (percentage >= INTERSTITIAL_THRESHOLD_2 && !interstitial2Shown) {
        // Se chegou muito rápido, adie a exibição
        if (Date.now() - pageLoadTime < 8000) {
          setTimeout(() => injectInterstitialScript(2), 6000);
        } else {
          injectInterstitialScript(2);
        }
      }
    };

    const pageLoadTime = Date.now();
    window.addEventListener("scroll", handleScroll);

    // Também verificar no carregamento inicial
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
};

/**
 * Hook para gerenciar os slots de anúncios alternando entre tipos
 */
export const useAdSlot = (
  slotRef: React.RefObject<HTMLDivElement>,
  index: number
) => {
  const loadedRef = useRef(false);

  useEffect(() => {
    const element = slotRef.current;
    if (!element || loadedRef.current) return;

    // Marcar como carregado imediatamente
    loadedRef.current = true;

    try {
      // Determinar o tipo de anúncio com base no índice
      // Padrão: Usar o formato alternado do Monetag
      const adType = index % 2 === 0 ? "inPagePush" : "vignette";

      if (adType === "inPagePush") {
        injectInPagePushScript(element, index);
      } else {
        injectVignetteScript(element, index);
      }
    } catch (error) {
      console.error(`Erro ao injetar anúncio no slot ${index}:`, error);
    }
  }, [slotRef, index]);

  return { loadedRef };
};

/**
 * Hook para gerenciar os anúncios do Adcash Native
 */
export const useAdcashNative = (
  slotRef: React.RefObject<HTMLDivElement>,
  index: number
) => {
  const loadedRef = useRef(false);

  useEffect(() => {
    // Inicializar Adcash se ainda não foi feito
    if (!adcashInitialized) {
      initializeAdcash();
    }

    const element = slotRef.current;
    if (!element || loadedRef.current) return;

    // Marcar como carregado
    loadedRef.current = true;

    try {
      // Preparar o slot para o Adcash Native
      prepareAdcashSlot(element, index);
    } catch (error) {
      console.error(`Erro ao preparar slot Adcash ${index}:`, error);
    }
  }, [slotRef, index]);

  return { loadedRef };
};

/**
 * Reset os estados de script para recarregar a página
 */
export const resetScriptStates = () => {
  popunderInjected = false;
  interstitial1Shown = false;
  interstitial2Shown = false;
  lastInterstitialTime = 0;
  adcashInitialized = false;
  cleanupScripts();

  // Redefinir callbacks globais
  defineMonetageCallbacks();
};

/**
 * Inicializa todos os scripts (Monetag) de uma vez
 */
export const initializeAllMonetag = () => {
  // Inicializar Pop-under imediatamente
  injectPopunderScript();

  // Inicializar Interstitials com atrasos específicos
  setTimeout(() => {
    injectInterstitialScript(1);
  }, 5000); // 5 segundos para o primeiro interstitial

  setTimeout(() => {
    injectInterstitialScript(2);
  }, 15000); // 15 segundos para o segundo interstitial

  console.log("All Monetag scripts initialized");
};

/**
 * Inicializa todos os scripts (Monetag e Adcash) de uma vez
 */
export const initializeAllAds = () => {
  // Inicializar Monetag
  initializeAllMonetag();

  // Inicializar Adcash
  initializeAdcash();

  console.log("All ad scripts initialized");
};

// Estender o objeto Window para incluir as propriedades específicas
declare global {
  interface Window {
    _izkiwzu: () => void;
    _pelslgw: () => void;
    _qbbin: () => void;
    _wyguu: () => void;
    _juyswjom: () => void;
    _iiswxcoi: () => void;
    _ngmcubed: () => void;
    _ugbxnlz: () => void;
    aclib?: any; // Para Adcash Banner
    [key: string]: any; // Para outros callbacks que possam ser necessários
  }
}
