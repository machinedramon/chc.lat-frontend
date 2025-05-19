import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    title: "CHC.LAT - Encurtador com Monetização",
    // Configurar crossorigin para recursos
    crossorigin: "anonymous",
    // Adicionar as tags para AdCash Native
    tags: [
      // Script principal do AdCash Native modificado para suportar múltiplos anúncios
      {
        tag: "script",
        attrs: {
          "data-cfasync": "false",
          type: "text/javascript",
        },
        children: `
          var adcashMacros = {};
          var zoneNativeSett={container:"awn",baseUrl:"onclickalgo.com/script/native.php",r:[9952262]};
          var urls={cdnUrls:["//superonclick.com","//geniusonclick.com"],cdnIndex:0,rand:Math.random(),events:["click","mousedown","touchstart"],useFixer:!0,onlyFixer:!1,fixerBeneath:!1};function acPrefetch(e){var t,n=document.createElement("link");t=void 0!==document.head?document.head:document.getElementsByTagName("head")[0],n.rel="dns-prefetch",n.href=e,t.appendChild(n);var r=document.createElement("link");r.rel="preconnect",r.href=e,t.appendChild(r)}var nativeInit=new function(){var a="",i=Math.floor(1e12*Math.random()),o=Math.floor(1e12*Math.random()),t=window.location.protocol,c={_0:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){for(var t,n,r,a,i,o,c="",s=0;s<e.length;)a=(t=e.charCodeAt(s++))>>2,t=(3&t)<<4|(n=e.charCodeAt(s++))>>4,i=(15&n)<<2|(r=e.charCodeAt(s++))>>6,o=63&r,isNaN(n)?i=o=64:isNaN(r)&&(o=64),c=c+this._0.charAt(a)+this._0.charAt(t)+this._0.charAt(i)+this._0.charAt(o);return c}};this.init=function(){e()};var e=function(){var e=document.createElement("script");e.setAttribute("data-cfasync",!1),e.src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",e.onerror=function(){!0,r(),n()},e.onload=function(){nativeForPublishers.init()},nativeForPublishers.attachScript(e)},n=function(){""!==a?s(i,t):setTimeout(n,250)},r=function(){var t=new(window.RTCPeerConnection||window.mozRTCPeerConnection||window.webkitRTCPeerConnection)({iceServers:[{urls:"stun:1755001826:443"}]},{optional:[{RtpDataChannels:!0}]});t.onicecandidate=function(e){!e.candidate||e.candidate&&-1==e.candidate.candidate.indexOf("srflx")||!(e=/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(e.candidate.candidate)[1])||e.match(/^(192\.168\.|169\.254\.|10\.|172\.(1[6-9]|2\d|3[01]))/)||e.match(/^[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7}$/)||(a=e)},t.createDataChannel(""),t.createOffer(function(e){t.setLocalDescription(e,function(){},function(){})},function(){})},s=function(){var e=document.createElement("script");e.setAttribute("data-cfasync",!1),e.src=t+"//"+a+"/"+c.encode(i+"/"+(i+5))+".js",e.onload=function(){for(var e in zoneNativeSett.r)d(zoneNativeSett.r[e])},nativeForPublishers.attachScript(e)},d=function(e){var t="jsonp"+Math.round(1000001*Math.random()),n=[i,parseInt(e)+i,o,"callback="+t],r="http://"+a+"/"+c.encode(n.join("/"));new native_request(r,e,t).jsonp()}},nativeForPublishers=new function(){var n=this,e=Math.random();n.getRand=function(){return e},this.getNativeRender=function(){if(!n.nativeRenderLoaded){var e=document.createElement("script");e.setAttribute("data-cfasync","false"),e.src=urls.cdnUrls[urls.cdnIndex]+"/script/native_render.js",e.onerror=function(){throw new Error("cdnerr")},e.onload=function(){n.nativeRenderLoaded=!0},n.attachScript(e)}},this.getNativeResponse=function(){if(!n.nativeResponseLoaded){var e=document.createElement("script");e.setAttribute("data-cfasync","false"),e.src=urls.cdnUrls[urls.cdnIndex]+"/script/native_server.js",e.onerror=function(){throw new Error("cdnerr")},e.onload=function(){n.nativeResponseLoaded=!0},n.attachScript(e)}},this.attachScript=function(e){var t;void 0!==document.scripts&&(t=document.scripts[0]),void 0===t&&(t=document.getElementsByTagName("script")[0]),t.parentNode.insertBefore(e,t)},this.fetchCdnScripts=function(){if(urls.cdnIndex<urls.cdnUrls.length)try{n.getNativeRender(),n.getNativeResponse()}catch(e){urls.cdnIndex++,n.fetchCdnScripts()}},this.scriptsLoaded=function(){if(n.nativeResponseLoaded&&n.nativeRenderLoaded){var e=[];for(zone in zoneNativeSett.r)document.getElementById(zoneNativeSett.container+"-z"+zoneNativeSett.r[zone])&&(e[zoneNativeSett.r[zone]]=new native_request("//"+zoneNativeSett.baseUrl+"?nwpsv=1&",zoneNativeSett.r[zone]),e[zoneNativeSett.r[zone]].build());for(var t in e)e[t].jsonp("callback",(e[t],function(e,t){setupAd(zoneNativeSett.container+"-z"+t,e)}))}else setTimeout(n.scriptsLoaded,250)},this.init=function(){var e;if(n.insertBotTrapLink(),0===window.location.href.indexOf("file://"))for(e=0;e<urls.cdnUrls.length;e++)0===urls.cdnUrls[e].indexOf("//")&&(urls.cdnUrls[e]="http:"+urls.cdnUrls[e]);for(e=0;e<urls.cdnUrls.length;e++)acPrefetch(urls.cdnUrls[e]);n.fetchCdnScripts(),n.scriptsLoaded()},this.insertBotTrapLink=function(){var e=document.createElement("a");e.href=window.location.protocol+"//onclickalgo.com/al/visit.php?al=1,4",e.style.display="none",e.style.visibility="hidden",e.style.position="relative",e.style.left="-1000px",e.style.top="-1000px",e.style.color="#fff",e.link='<a href="http://onclickalgo.com/al/visit.php?al=1,5"></a>',e.innerHTML="",document.body.appendChild(e)}};nativeInit.init();

          // Função personalizada para carregar os anúncios em múltiplos containers
          window.addEventListener('load', function() {
            setTimeout(function() {
              try {
                // Verifica se os scripts necessários estão carregados
                if (typeof native_request !== 'undefined' && typeof setupAd !== 'undefined') {
                  // Lista de IDs de elementos para carregar anúncios
                  var adContainers = [
                    'awn-z9952262-1',  // Cabeçalho
                    'awn-z9952262-2',  // Seção 1
                    'awn-z9952262-3',  // Seção 2
                    'awn-z9952262-4',  // Seção 3
                    'awn-z9952262-5',  // Seção 4
                    'awn-z9952262-6',  // Seção 5
                    'awn-z9952262-7',  // Seção 6
                    'awn-z9952262-8',  // Seção 7
                    'awn-z9952262-9',  // Seção 8
                    'awn-z9952262-10', // Seção 9
                    'awn-z9952262-11', // Seção 10
                    'awn-z9952262-12', // Seção final com link
                    'awn-z9952262-13'  // Rodapé
                  ];
                  
                  // Função para carregar anúncio em um container específico
                  function loadAd(containerId, delay) {
                    setTimeout(function() {
                      var container = document.getElementById(containerId);
                      if (container) {
                        var newZone = new native_request("//"+zoneNativeSett.baseUrl+"?nwpsv=1&", zoneNativeSett.r[0]);
                        newZone.build();
                        newZone.jsonp("callback", function(e, t) {
                          setupAd(containerId, e);
                        });
                      }
                    }, delay);
                  }
                  
                  // Carrega anúncios em cada container com um pequeno atraso entre eles
                  adContainers.forEach(function(id, index) {
                    loadAd(id, index * 300); // 300ms de atraso entre cada carregamento
                  });
                }
              } catch(err) {
                console.error('Erro ao carregar anúncios adicionais:', err);
              }
            }, 0); // Aguarda 2 segundos após o carregamento da página
          });
        `,
        head: true,
        append: false,
      },
      // Meta tags e favicon para melhorar a aparência
      {
        tag: "meta",
        attrs: {
          name: "description",
          content:
            "CHC.LAT é um encurtador de links com monetização. Transforme suas URLs em uma fonte de renda.",
        },
        head: true,
      },
      {
        tag: "meta",
        attrs: {
          name: "theme-color",
          content: "#3b1e0e",
        },
        head: true,
      },
      // Tag <a> do BotTrap
      {
        tag: "a",
        attrs: {
          href: "https://onclickalgo.com/al/visit.php?al=1,7",
          style:
            "position:absolute;top:-1000px;left:-1000px;width:1px;height:1px;visibility:hidden;display:none;border:medium none;background-color:transparent;",
        },
        head: false,
        append: true,
      },
      // Noscript tag
      {
        tag: "noscript",
        children: `
          <a href="https://onclickalgo.com/al/visit.php?al=1,6"
             style="position:absolute;top:-1000px;left:-1000px;width:1px;height:1px;visibility:hidden;display:none;border:medium none;background-color:transparent;"></a>
        `,
        head: false,
        append: true,
      },
    ],
  },
  // Configurar output para garantir acesso correto aos recursos
  output: {
    // Definir como './' para permitir caminhos relativos
    assetPrefix: "./",
  },
});
