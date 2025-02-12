jQuery(function() {
    'use strict';
    var daftplugPublic = jQuery('.daftplugPublic[data-daftplug-plugin="daftplug_instantify"]');
    var optionName = daftplugPublic.attr('data-daftplug-plugin');
    var objectName = window[optionName + '_public_js_vars'];
    var parser = new UAParser();
    var navigationTabBar = daftplugPublic.find('.daftplugPublicNavigationTabBar');
    var pushButton = daftplugPublic.find('.daftplugPublicPushButton');
    var scrollProgressBar = daftplugPublic.find('.daftplugPublicScrollProgressBar_fill');
    var webShareButton = daftplugPublic.find('.daftplugPublicWebShareButton');
    var idleReloadButton = daftplugPublic.find('.daftplugPublicIdleReloadButton');
    var isMobile = String(parser.getDevice().type).includes('mobile') && !String(parser.getDevice().type).includes('tablet');
    var isTablet = String(parser.getDevice().type).includes('tablet') && !String(parser.getDevice().type).includes('mobile');
    var isDesktop = !String(parser.getDevice().type).includes('tablet') && !String(parser.getDevice().type).includes('mobile');
    var isChrome = String(parser.getBrowser().name).includes('Chrome');
    var isEdge = String(parser.getBrowser().name).includes('Edge');
    var isAndroidChrome = String(parser.getOS().name).includes('Android') && isChrome;
    var isAndroidEdge = String(parser.getOS().name).includes('Android') && isEdge;
    var isAndroidFirefox = String(parser.getOS().name).includes('Android') && String(parser.getBrowser().name).includes('Firefox');
    var isAndroidOpera = String(parser.getOS().name).includes('Android') && String(parser.getBrowser().name).includes('Opera');
    var isIosSafari = String(parser.getOS().name).includes('iOS') && String(parser.getBrowser().name).includes('Safari');
    var isFirstVisit = getCookie('firstVisit');
    var isFullscreenOverlayShown = getCookie('fullscreenOverlay');
    var isHeaderOverlayShown = getCookie('headerOverlay');
    var isSnackbarOverlayShown = getCookie('snackbarOverlay');
    var isPostOverlayShown = getCookie('postOverlay');
    var isIosOverlayShown = getCookie('iosOverlay');
    var isMenuOverlayShown = getCookie('menuOverlay');
    var isFeedOverlayShown = getCookie('feedOverlay');
    var isCheckoutOverlayShown = getCookie('checkoutOverlay');
    var isCouponOverlayShown = getCookie('couponOverlay');
    var fullscreenOverlay = daftplugPublic.find('.daftplugPublicFullscreenOverlay');
    var chromeFullscreenOverlay = fullscreenOverlay.filter('.-chrome');
    var firefoxFullscreenOverlay = fullscreenOverlay.filter('.-firefox');
    var operaFullscreenOverlay = fullscreenOverlay.filter('.-opera');
    var safariFullscreenOverlay = fullscreenOverlay.filter('.-safari');
    var headerOverlay = daftplugPublic.find('.daftplugPublicHeaderOverlay');
    var snackbarOverlay = daftplugPublic.find('.daftplugPublicSnackbarOverlay');
    var postOverlay = daftplugPublic.find('.daftplugPublicPostOverlay');
    var iosOverlay = daftplugPublic.find('.daftplugPublicIosOverlay');
    var menuOverlay = daftplugPublic.find('.daftplugPublicMenuOverlay');
    var feedOverlay = daftplugPublic.find('.daftplugPublicFeedOverlay');
    var checkoutOverlay = daftplugPublic.find('.daftplugPublicCheckoutOverlay');
    var couponOverlay = daftplugPublic.find('.daftplugPublicCouponOverlay');
    var installButton = daftplugPublic.find('.daftplugPublicInstallButton');
    var rotateNotice = daftplugPublic.find('.daftplugPublicRotateNotice');

    // Check if Facebook app browser
    function isFacebookApp() {
        var ua = navigator.userAgent || navigator.vendor || window.opera;
        return (ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1);
    }

    // Check if PWA
    function isPwa() {
        return ['fullscreen', 'standalone', 'minimal-ui'].some(
            (displayMode) => window.matchMedia('(display-mode: '+displayMode+')').matches
        );
    }
    
    // Set cookie
    function setCookie(name, value, days) {
        var expires = '';
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString();
        }
        document.cookie = name + '=' + (value || '') + expires + '; path=/';
    }
    
    // Get cookie
    function getCookie(name) {
        var nameEQ = name + '=';
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Remove cookie
    function removeCookie(name) {
        setCookie(name, '', -1);
    }

    // Add query parameter to URL
    function addQueryParameter(url, parameterName, parameterValue, atStart) {
        var cl;
        var urlHash;

        if (url.indexOf('#') > 0) {
            cl = url.indexOf('#');
            urlHash = url.substring(url.indexOf('#'), url.length);
        } else {
            urlHash = '';
            cl = url.length;
        }

        var sourceUrl = url.substring(0, cl);
        var urlParts = sourceUrl.split('?');
        var newQueryString = '';
    
        if (urlParts.length > 1 && urlParts[1] != '') {
            var parameters = urlParts[1].split('&');
            for (var i = 0;
                (i < parameters.length); i++) {
                var parameterParts = parameters[i].split('=');
                if (!(parameterParts[0] == parameterName)) {
                    if (newQueryString == '')
                        newQueryString = '?';
                    else
                        newQueryString += '&';
                    newQueryString += parameterParts[0] + '=' + (parameterParts[1] ? parameterParts[1] : '');
                }
            }
        }

        if (newQueryString == '') {
            newQueryString = '?';
        }

        if (atStart) {
            newQueryString = '?' + parameterName + '=' + parameterValue + (newQueryString.length > 1 ? '&' + newQueryString.substring(1) : '');
        } else {
            if (newQueryString !== '' && newQueryString != '?') {
                newQueryString += '&';
            }

            newQueryString += parameterName + '=' + (parameterValue ? parameterValue : '');
        }

        return urlParts[0] + newQueryString + urlHash;
    }

    // Handle offline forms
    if (objectName.settings.pwaOfflineForms == 'on') {
        Array.from(document.querySelectorAll('form')).forEach(form => {
            new OfflineForm(form);
        })
    }

    // Handle navigation tab bar
    if (objectName.settings.pwaNavigationTabBar == 'on'
    && ((objectName.settings.pwaNavigationTabBarPlatforms.includes('mobile') && isMobile)
    || (objectName.settings.pwaNavigationTabBarPlatforms.includes('tablet') && isTablet)
    || (objectName.settings.pwaNavigationTabBarPlatforms.includes('pwa') && isPwa()))) {
        if (navigationTabBar.find('li').length == 0) {
            navigationTabBar.hide();
        } else {
            if (navigationTabBar.is(':visible')) {
                jQuery('body').css('padding-bottom', '60px');
                
                setInterval(function(e) {
                    jQuery('#daftplugPublicToastMessage').css('bottom', '85px');
                }, 10);

                if (objectName.settings.pwaPushButton == 'on' && objectName.settings.pwaPushButtonPosition.indexOf('bottom') >= 0 && pushButton.length) {
                    pushButton.css('bottom', '75px');
                }

                if (objectName.settings.pwaWebShareButton == 'on' && objectName.settings.pwaWebShareButtonPosition.indexOf('bottom') >= 0 && webShareButton.length) {
                    webShareButton.css('bottom', '75px');
                }

                if (objectName.settings.pwaDarkMode == 'on' && jQuery('.darkmode-toggle, .darkmode-layer').length) {
                    jQuery('.darkmode-toggle, .darkmode-layer').css('bottom', '150px');
                }
            }
            
            var directSearchItem = navigationTabBar.find('.daftplugPublicNavigationTabBar_item.-directSearch');
            var directSearchLink = directSearchItem.find('.daftplugPublicNavigationTabBar_link');
            directSearchLink.on('click', function(e) {
                e.preventDefault();
                var self = jQuery(this);
                var searchContainer = self.prev();
                var searchForm = searchContainer.find('.daftplugPublicNavigationTabBar_searchForm');
                var searchField = searchForm.find('.daftplugPublicNavigationTabBar_searchField');
                searchContainer.fadeIn('fast', function(e) {
                    searchField.trigger('focus').blur(function(e) {
                        searchForm[0].reset();
                        searchContainer.fadeOut('fast');
                    });
                });
            });
        }
    }

    // Handle scroll progress bar
    if (objectName.settings.pwaScrollProgressBar == 'on'
    && ((objectName.settings.pwaScrollProgressBarPlatforms.includes('desktop') && isDesktop)
    || (objectName.settings.pwaScrollProgressBarPlatforms.includes('mobile') && isMobile)
    || (objectName.settings.pwaScrollProgressBarPlatforms.includes('tablet') && isTablet)
    || (objectName.settings.pwaScrollProgressBarPlatforms.includes('pwa') && isPwa()))) {
        jQuery(document).on('scroll', function() {
            var pixels = jQuery(document).scrollTop();
            var pageHeight = jQuery(document).height() - jQuery(window).height();
            var progress = 100 * pixels / pageHeight;
            scrollProgressBar.css('width', progress + '%');
        });
    }

    // Handle dark mode
    if (objectName.settings.pwaDarkMode == 'on'
    && ((objectName.settings.pwaDarkModePlatforms.includes('desktop') && isDesktop)
    || (objectName.settings.pwaDarkModePlatforms.includes('mobile') && isMobile)
    || (objectName.settings.pwaDarkModePlatforms.includes('tablet') && isTablet)
    || (objectName.settings.pwaDarkModePlatforms.includes('pwa') && isPwa()))) {
        if (objectName.settings.pwaDarkModeSwitchButtonPosition == 'bottom-right') {
            var rightPosition = '25px';
            var leftPosition = 'unset';
        } else {
            var rightPosition = 'unset';
            var leftPosition = '25px';
        }
        var osAware = objectName.settings.pwaDarkModeOSAware == 'on' ? true : false;
        var darkMode = new Darkmode({
            bottom: '100px',
            right: rightPosition,
            left: leftPosition,
            time: '0.3s',
            mixColor: '#fff',
            backgroundColor: '#fff',
            buttonColorDark: '#100f2c',
            buttonColorLight: '#fff',
            saveInCookies: true,
            label: '🌓',
            autoMatchOsTheme: osAware,
        });
        darkMode.showWidget();
        if (objectName.settings.pwaDarkModeBatteryLow == 'on' && !darkMode.isActivated() && 'getBattery' in navigator) {
            navigator.getBattery().then(function(battery) {
                if (battery.level < 0.1) {
                    darkMode.toggle();
                }
            });
        }
    }

    // Handle web share button
    if (objectName.settings.pwaWebShareButton == 'on' && navigator.share 
    && ((objectName.settings.pwaWebShareButtonPlatforms.includes('mobile') && isMobile)
    || (objectName.settings.pwaWebShareButtonPlatforms.includes('tablet') && isTablet)
    || (objectName.settings.pwaWebShareButtonPlatforms.includes('pwa') && isPwa()))) {
        webShareButton.css('display', 'flex').on('click', function(e) {
            navigator.share({
                title: document.title,
                url: document.querySelector('link[rel=canonical]') ? document.querySelector('link[rel=canonical]').href : document.location.href,
            }).catch(console.error);
        });
    }

    // Handle pull down navigation
    if (objectName.settings.pwaPullDownNavigation == 'on'
    && ((objectName.settings.pwaPullDownNavigationPlatforms.includes('mobile') && isMobile)
    || (objectName.settings.pwaPullDownNavigationPlatforms.includes('tablet') && isTablet)
    || (objectName.settings.pwaPullDownNavigationPlatforms.includes('pwa') && isPwa()))) {
        jQuery(document.body).css('overscroll-behavior-y', 'contain');
        setTimeout(function(e) {
            pullDownNavigation();
            jQuery('.daftplugPublicPullDownNavigation').css('background', objectName.settings.pwaPullDownNavigationBgColor);
        }, 1000);
    }

    // Handle swipe navigation
    if (objectName.settings.pwaSwipeNavigation == 'on'
    && ((objectName.settings.pwaSwipeNavigationPlatforms.includes('mobile') && isMobile)
    || (objectName.settings.pwaSwipeNavigationPlatforms.includes('tablet') && isTablet)
    || (objectName.settings.pwaSwipeNavigationPlatforms.includes('pwa') && isPwa()))) {
        jQuery('body').attr('data-xthreshold', '111').swipeleft(function() { 
            window.history.back();
            jQuery.toast({
                title: objectName.settings.pwaSwipeBackMsg,
                duration: 3000,
                position: 'bottom',
            });
        }).swiperight(function() { 
            window.history.forward(); 
            jQuery.toast({
                title: objectName.settings.pwaSwipeForwardMsg,
                duration: 3000,
                position: 'bottom',
            });
        });
    }

    // Handle shake to refresh
    if (objectName.settings.pwaShakeToRefresh == 'on'
    && ((objectName.settings.pwaShakeToRefreshPlatforms.includes('mobile') && isMobile)
    || (objectName.settings.pwaShakeToRefreshPlatforms.includes('tablet') && isTablet)
    || (objectName.settings.pwaShakeToRefreshPlatforms.includes('pwa') && isPwa()))) {
        var shakeEvent = new Shake({threshold: 15});
        shakeEvent.start();
        window.addEventListener('shake', function() {
            location.reload();
        }, false);
    }

    // Handle inactive blur
    if (objectName.settings.pwaInactiveBlur == 'on'
    && ((objectName.settings.pwaInactiveBlurPlatforms.includes('mobile') && isMobile)
    || (objectName.settings.pwaInactiveBlurPlatforms.includes('tablet') && isTablet)
    || (objectName.settings.pwaInactiveBlurPlatforms.includes('pwa') && isPwa()))) {
        jQuery(window).on('visibilitychange pageshow pagehide focus blur resume freeze', function(e) {
            if (document.hidden || !document.hasFocus() || e.type == 'pagehide' || e.type == 'blur' || e.type == 'freeze') {
                jQuery('html').css({
                    'filter': 'blur(3px)',
                    '-webkit-filter': 'blur(3px)',
                    '-moz-filter': 'blur(3px)',
                    '-o-filter': 'blur(3px)',
                    '-ms-filter': 'blur(3px)'
                });
            } else {
                jQuery('html').css({
                    'filter': 'initial',
                    '-webkit-filter': 'initial',
                    '-moz-filter': 'initial',
                    '-o-filter': 'initial',
                    '-ms-filter': 'initial'
                });
            }
        });
    }

    // Handle preloader
    if (objectName.settings.pwaPreloader == 'on'
    && ((objectName.settings.pwaPreloaderPlatforms.includes('desktop') && isDesktop)
    || (objectName.settings.pwaPreloaderPlatforms.includes('mobile') && isMobile)
    || (objectName.settings.pwaPreloaderPlatforms.includes('tablet') && isTablet)
    || (objectName.settings.pwaPreloaderPlatforms.includes('pwa') && isPwa()))) {
        var perfData = window.performance.timing,
        EstimatedTime = -(perfData.loadEventEnd - perfData.navigationStart),
        time = parseInt((EstimatedTime / 1000) % 60) * 100,
        start = 0,
        end = 70,
        duration = time,
        range = end - start,
        current = start,
        increment = 1,
        stepTime = Math.abs(Math.floor(duration / range));
        
        switch (objectName.settings.pwaPreloaderStyle) {
            case 'percent':
                jQuery(window).on('beforeunload pronto.request', function(e) {
                    e.returnValue = '';
                    jQuery('.daftplugPublicPreloader').css('display', 'flex').hide().fadeIn(200);
                });
                var progressFill = jQuery('.daftplugPublicPreloader_fill');
                var counter = jQuery('.daftplugPublicPreloader_counter');
                var timer = setInterval(function() {
                    if (current < end) {
                        current += increment;
                    }
                    progressFill.css({
                        'transition-duration': '0.001s',
                        'width': current + '%',
                    });
                    counter.text(current + '%');
                    if ((current == end && perfData.loadEventEnd > 0) || perfData.loadEventEnd > 0) {
                        var endLoading = setInterval(function() {
                            current += increment;
                            progressFill.css('width', current + '%');
                            counter.text(current + '%');
                            if (current == 100) {
                                setTimeout(function() {
                                    jQuery('.daftplugPublicPreloader').fadeOut(500, function(e) {
                                        progressFill.css('width', '0');
                                        counter.text('0%');
                                    });
                                }, 300);
                                clearInterval(endLoading);
                            }
                        }, 1)
                        clearInterval(timer);
                    }
                }, stepTime);
                break;
            case 'skeleton':
                jQuery(window).on('beforeunload pronto.request', function(e) {
                    e.returnValue = '';
                    jQuery('.daftplugPublicPreloader').css('display', 'flex').hide().fadeIn(200);
                });
                var timer = setInterval(function() {
                    if (current < end) {
                        current += increment;
                    }
                    jQuery('.daftplugPublicPreloader').hide();
                    jQuery('a, svg, i, input, select, button, video').not('.daftplugPublicPullDownNavigation_icon').addClass('-daftplugPublicSkeletonLoad');
                    jQuery('img:visible:not(.rev-slidebg), audio:visible, video:visible, iframe:visible').each(function(e) {
                        jQuery(this).wrap(`<div class="${jQuery(this).attr('class')} -daftplugPublicSkeletonLoad -media" style="width: ${jQuery(this).width()}px; height: ${jQuery(this).height()}px;"></div>`).hide();
                    });
                    jQuery('*:visible').filter(function() {
                        if (this.currentStyle) {
                            return this.currentStyle['backgroundImage'] !== 'none';
                        } else if (window.getComputedStyle) {
                            return document.defaultView.getComputedStyle(this,null).getPropertyValue('background-image') !== 'none';
                        }
                    }).not('.daftplugPublicPullDownNavigation_icon').addClass('-daftplugPublicSkeletonLoad');
                    jQuery('*:visible').filter(function() {
                        return jQuery(this).children().length == 0 && jQuery(this).text().trim().length > 0;
                    }).not('.daftplugPublicPullDownNavigation_icon').addClass('-daftplugPublicSkeletonLoad');
                    jQuery('*').not('iframe, .-daftplugPublicSkeletonLoad').contents().each(function() {
                        if (this.nodeType == 3 && this.nodeValue.trim() != '') {
                            jQuery(this).wrap('<ins class="-daftplugPublicSkeletonLoad"/>');
                        }
                    });
                    if ((current == end && perfData.loadEventEnd > 0) || perfData.loadEventEnd > 0) {
                        var endLoading = setInterval(function() {
                            current += increment;
                            if (current == 100) {
                                jQuery('.-daftplugPublicSkeletonLoad.-media').contents().unwrap().show();
                                jQuery('ins[class="-daftplugPublicSkeletonLoad"]').contents().unwrap();
                                jQuery('*').removeClass('-daftplugPublicSkeletonLoad');
                                jQuery('#daftplugPublicSkeletonLoadCss').remove();
                                clearInterval(endLoading);
                            }
                        }, 1)
                        clearInterval(timer);
                    }
                }, stepTime);
                break;
            case 'fade':
                jQuery(window).on('beforeunload pronto.request', function(e) {
                    e.returnValue = '';
                    jQuery(document.body).removeClass('-daftplugPublicFadeIn').addClass('-daftplugPublicFadeOut');
                });
                var timer = setInterval(function() {
                    if (current < end) {
                        current += increment;
                    }
                    if ((current == end && perfData.loadEventEnd > 0) || perfData.loadEventEnd > 0) {
                        var endLoading = setInterval(function() {
                            current += increment;
                            if (current == 100) {
                                jQuery(document.body).removeClass('-daftplugPublicFadeOut').addClass('-daftplugPublicFadeIn');
                                clearInterval(endLoading);
                            }
                        }, 1)
                        clearInterval(timer);
                    }
                }, stepTime);
                break;
            default:
                jQuery(window).on('beforeunload pronto.request', function(e) {
                    e.returnValue = '';
                    jQuery('.daftplugPublicPreloader').css('display', 'flex').hide().fadeIn(200);
                });
                var timer = setInterval(function() {
                    if (current < end) {
                        current += increment;
                    }
                    if ((current == end && perfData.loadEventEnd > 0) || perfData.loadEventEnd > 0) {
                        var endLoading = setInterval(function() {
                            current += increment;
                            if (current == 100) {
                                setTimeout(function() {
                                    jQuery('.daftplugPublicPreloader').fadeOut(500);
                                }, 300);
                                clearInterval(endLoading);
                            }
                        }, 1)
                        clearInterval(timer);
                    }
                }, stepTime);
                break;
                
        }
    }

    // Handle ajaxify
    if (objectName.settings.pwaAjaxify == 'on'
    && ((objectName.settings.pwaAjaxifyPlatforms.includes('desktop') && isDesktop)
    || (objectName.settings.pwaAjaxifyPlatforms.includes('mobile') && isMobile)
    || (objectName.settings.pwaAjaxifyPlatforms.includes('tablet') && isTablet)
    || (objectName.settings.pwaAjaxifyPlatforms.includes('pwa') && isPwa()))) {
        var additionalSelectors = objectName.settings.pwaAjaxifySelectors == '' ? 'a:not(.no-ajaxy)' : 'a:not(.no-ajaxy),' + objectName.settings.pwaAjaxifySelectors;
        var formsSelector = objectName.settings.pwaAjaxifyForms == 'on' ? 'form:not(.no-ajaxy)' : false;
        new Ajaxify({
            selector: additionalSelectors,
            forms: formsSelector,
            refresh: true,
            inlineskip: 'daftplug-instantify',
            alwayshints: 'daftplug-instantify',
        });
    }

    // Handle adaptive loading
    if (objectName.settings.pwaAdaptiveLoading == 'on' && objectName.ampUrl
    && ((objectName.settings.pwaAdaptiveLoadingPlatforms.includes('desktop') && isDesktop)
    || (objectName.settings.pwaAdaptiveLoadingPlatforms.includes('mobile') && isMobile)
    || (objectName.settings.pwaAdaptiveLoadingPlatforms.includes('tablet') && isTablet)
    || (objectName.settings.pwaAdaptiveLoadingPlatforms.includes('pwa') && isPwa()))) {   
        var networkInfo = navigator.connection || navigator.mozConnection || navigator.webkitConnection || navigator.msConnection;
        if (networkInfo && (networkInfo.effectiveType !== '4g' || networkInfo.saveData)) {
            window.location = objectName.ampUrl;
        }
    }

    // Handle periodic background sync
    if (objectName.settings.pwaPeriodicBackgroundSync == 'on' && 'serviceWorker' in navigator) {
        (async function() {
            const serviceWorkerRegistration = await navigator.serviceWorker.ready;
            if ('periodicSync' in serviceWorkerRegistration) {
                const status = await navigator.permissions.query({
                    name: 'periodic-background-sync',
                });
                if (status.state === 'granted') {
                    try {
                        await serviceWorkerRegistration.periodicSync.register('periodicSync', {
                            minInterval: 24 * 60 * 60 * 1000,
                        });
                        console.log('Periodic background sync registered!');
                    } catch (e) {
                        console.error(`Periodic background sync failed:\n${e}`);
                    }
                }
            }
        })();
    }

    // Handle content index
    if (objectName.settings.pwaContentIndexing == 'on' && 'serviceWorker' in navigator) {
        (async function() {
            const serviceWorkerRegistration = await navigator.serviceWorker.ready;
            if ('index' in serviceWorkerRegistration) {
                caches.keys().then(cacheNames => {
                    return Promise.all(
                        cacheNames.map(cacheName => {
                            if (cacheName.endsWith('-html')) {
                                caches.open(cacheName).then(cache => {
                                    cache.keys().then(keys => {
                                        return Promise.all(
                                            keys.map(key => {
                                                if (window.location.href == key.url) {
                                                    serviceWorkerRegistration.index.add({
                                                        id: window.location.href,
                                                        url: window.location.href,
                                                        title: document.title,
                                                        description: jQuery('meta[name="description"]').prop('content'),
                                                        icons: [{
                                                            src: (objectName.iconUrl).replace(/(\.[\w\d_-]+)$/i, '-150x150$1'),
                                                            sizes: '150x150',
                                                            type: 'image/png',
                                                        }],
                                                    });
                                                }
                                            })
                                        )
                                    })
                                })   
                            }
                        })
                    );
                });
            }
        })();
    }

    // Handle persistent storage
    if (objectName.settings.pwaPersistentStorage == 'on' && navigator.storage && navigator.storage.persist) {
        (async function() {
            var isPersisted = await navigator.storage.persisted();
            if (!isPersisted) {
                await navigator.storage.persist();
            }
        })();
    }

    // Handle vibration
    if (objectName.settings.pwaVibration == 'on'
    && ((objectName.settings.pwaVibrationPlatforms.includes('mobile') && isMobile)
    || (objectName.settings.pwaVibrationPlatforms.includes('tablet') && isTablet)
    || (objectName.settings.pwaVibrationPlatforms.includes('pwa') && isPwa()))) {
        jQuery('body').vibrate();
    }

    // Handle idle detection
    if (objectName.settings.pwaIdleDetection == 'on'
    && ((objectName.settings.pwaIdleDetectionPlatforms.includes('desktop') && isDesktop)
    || (objectName.settings.pwaIdleDetectionPlatforms.includes('mobile') && isMobile)
    || (objectName.settings.pwaIdleDetectionPlatforms.includes('tablet') && isTablet)
    || (objectName.settings.pwaIdleDetectionPlatforms.includes('pwa') && isPwa()))) {
        if ('IdleDetector' in window) {
            async function checkIdleDetectionPermission() {
                const state = await IdleDetector.requestPermission();
                if (state !== 'granted') {
                    return console.log('Idle detection permission not granted.');
                }
            }

            document.addEventListener('click', checkIdleDetectionPermission);

            (async function() {
                try {
                    const controller = new AbortController();
                    const signal = controller.signal;
                    const idleDetector = new IdleDetector();
                    idleDetector.addEventListener('change', () => {
                        const userState = idleDetector.userState;
                        const screenState = idleDetector.screenState;
                        console.log(`Idle change: ${userState}, ${screenState}.`);
                        if (userState == 'idle') {
                            idleReloadButton.addClass('-active');
                        } else {
                            idleReloadButton.removeClass('-active');
                        }
                    });
                    idleDetector.start({
                        threshold: objectName.settings.pwaIdleDetectionThreshold * 60000,
                        signal,
                    });
                } catch (err) {
                    console.error(err.name, err.message);
                }
            })();

            idleReloadButton.on('click', function(e) {
                location.reload();
            });
        }
    }

    // Handle screen wake lock
    if (objectName.settings.pwaScreenWakeLock == 'on'
    && ((objectName.settings.pwaScreenWakeLockPlatforms.includes('mobile') && isMobile)
    || (objectName.settings.pwaScreenWakeLockPlatforms.includes('tablet') && isTablet)
    || (objectName.settings.pwaScreenWakeLockPlatforms.includes('pwa') && isPwa()))) {
        if ('wakeLock' in navigator) {
            var wakeLock = null;
            var requestWakeLock = async function requestWakeLock() {
                wakeLock = await navigator.wakeLock.request('screen');
            };
            var handleVisibilityChange = function handleVisibilityChange() {
                if (wakeLock !== null && document.visibilityState === 'visible') {
                    requestWakeLock();
                }
            };
            requestWakeLock();                 
            document.addEventListener('visibilitychange', handleVisibilityChange);
            document.addEventListener('fullscreenchange', handleVisibilityChange);
        }
    }

    // Handle installation overlays
    if (objectName.settings.pwaOverlays == 'on' && (isMobile || isTablet) && !isPwa() && !isFacebookApp()) {
        if (objectName.settings.pwaOverlaysSkip == 'on' && isFirstVisit == null) {
            setCookie('firstVisit', 'done', 9999);
            sessionStorage.setItem('firstVisit', 'true');
        } else {
            if (!sessionStorage.getItem('firstVisit')) {
                // Handle fullscreen installation overlays
                if (objectName.settings.pwaOverlaysTypeFullscreen == 'on' && isFullscreenOverlayShown == null && fullscreenOverlay.length) {
                    if (((objectName.settings.pwaOverlaysBrowsers.includes('chrome') && isAndroidChrome) || (objectName.settings.pwaOverlaysBrowsers.includes('edge') && isAndroidEdge)) && chromeFullscreenOverlay.length) {
                        var isFullscreenOverlayFired = false;
                        var installPromptEvent = void 0;
                        window.addEventListener('beforeinstallprompt', function(event) {
                            event.preventDefault();
                            installPromptEvent = event;
                            if (!isFullscreenOverlayFired) {
                                setTimeout(function() {
                                    chromeFullscreenOverlay.fadeIn('fast', function(e) {
                                        isFullscreenOverlayFired = true;
                                        chromeFullscreenOverlay.on('click', '.daftplugPublicFullscreenOverlay_button', function(e) {
                                            chromeFullscreenOverlay.fadeOut('fast', function(e) {
                                                setCookie('fullscreenOverlay', 'shown', objectName.settings.pwaOverlaysShowAgain);
                                                installPromptEvent.prompt();
                                                installPromptEvent = null;
                                            });
                                        });
                                    });
                                }, objectName.settings.pwaOverlaysDelay * 1000);
                            }
                        });
                    } else if (objectName.settings.pwaOverlaysBrowsers.includes('firefox') && isAndroidFirefox && firefoxFullscreenOverlay.length) {
                        setTimeout(function() {
                            firefoxFullscreenOverlay.fadeIn('fast');
                        }, objectName.settings.pwaOverlaysDelay * 1000);
                    } else if (objectName.settings.pwaOverlaysBrowsers.includes('opera') && isAndroidOpera && operaFullscreenOverlay.length) {
                        setTimeout(function() {
                            operaFullscreenOverlay.fadeIn('fast');
                        }, objectName.settings.pwaOverlaysDelay * 1000);
                    } else if (objectName.settings.pwaOverlaysBrowsers.includes('safari') && isIosSafari && safariFullscreenOverlay.length) {
                        setTimeout(function() {
                            safariFullscreenOverlay.fadeIn('fast');
                        }, objectName.settings.pwaOverlaysDelay * 1000);
                    }
                    
                    fullscreenOverlay.on('click', '.daftplugPublicFullscreenOverlay_close', function(e) {
                        fullscreenOverlay.fadeOut('fast', function(e) {
                            setCookie('fullscreenOverlay', 'shown', objectName.settings.pwaOverlaysShowAgain);
                        });
                    });
                }

                // Handle header installation overlay
                if (objectName.settings.pwaOverlaysTypeHeader == 'on' && isHeaderOverlayShown == null && headerOverlay.length) {
                    if ((objectName.settings.pwaOverlaysBrowsers.includes('chrome') && isAndroidChrome) || (objectName.settings.pwaOverlaysBrowsers.includes('edge') && isAndroidEdge)) {
                        var isHeaderOverlayFired = false;
                        var installPromptEvent = void 0;
                        window.addEventListener('beforeinstallprompt', function(event) {
                            event.preventDefault();
                            installPromptEvent = event;
                            if (!isHeaderOverlayFired) {
                                setTimeout(function() {
                                    headerOverlay.css('display', 'flex').hide().fadeIn('fast', function(e) {
                                        isHeaderOverlayFired = true;
                                        headerOverlay.on('click', '.daftplugPublicHeaderOverlay_button', function(e) {
                                            headerOverlay.fadeOut('fast', function(e) {
                                                setCookie('headerOverlay', 'shown', objectName.settings.pwaOverlaysShowAgain);
                                                installPromptEvent.prompt();
                                                installPromptEvent = null;
                                            });
                                        });
                                    });
                                }, objectName.settings.pwaOverlaysDelay * 1000);
                            }
                        });
                    } else if (objectName.settings.pwaOverlaysBrowsers.includes('firefox') && isAndroidFirefox && firefoxFullscreenOverlay.length) {
                        setTimeout(function() {
                            headerOverlay.css('display', 'flex').hide().fadeIn('fast').on('click', '.daftplugPublicHeaderOverlay_button', function(e) {
                                headerOverlay.fadeOut('fast', function(e) {
                                    setCookie('headerOverlay', 'shown', objectName.settings.pwaOverlaysShowAgain);
                                    firefoxFullscreenOverlay.fadeIn('fast').on('click', '.daftplugPublicFullscreenOverlay_close', function(e) {
                                        firefoxFullscreenOverlay.fadeOut('fast');
                                    });
                                });
                            });
                        }, objectName.settings.pwaOverlaysDelay * 1000);
                    } else if (objectName.settings.pwaOverlaysBrowsers.includes('opera') && isAndroidOpera && operaFullscreenOverlay.length) {
                        setTimeout(function() {
                            headerOverlay.css('display', 'flex').hide().fadeIn('fast').on('click', '.daftplugPublicHeaderOverlay_button', function(e) {
                                headerOverlay.fadeOut('fast', function(e) {
                                    setCookie('headerOverlay', 'shown', objectName.settings.pwaOverlaysShowAgain);
                                    operaFullscreenOverlay.fadeIn('fast').on('click', '.daftplugPublicFullscreenOverlay_close', function(e) {
                                        operaFullscreenOverlay.fadeOut('fast');
                                    });
                                });
                            });
                        }, objectName.settings.pwaOverlaysDelay * 1000);
                    } else if (objectName.settings.pwaOverlaysBrowsers.includes('safari') && isIosSafari && safariFullscreenOverlay.length) {
                        setTimeout(function() {
                            headerOverlay.css('display', 'flex').hide().fadeIn('fast').on('click', '.daftplugPublicHeaderOverlay_button', function(e) {
                                headerOverlay.fadeOut('fast', function(e) {
                                    setCookie('headerOverlay', 'shown', objectName.settings.pwaOverlaysShowAgain);
                                    safariFullscreenOverlay.fadeIn('fast').on('click', '.daftplugPublicFullscreenOverlay_close', function(e) {
                                        safariFullscreenOverlay.fadeOut('fast');
                                    });
                                });
                            });
                        }, objectName.settings.pwaOverlaysDelay * 1000);
                    }

                    headerOverlay.on('click', '.daftplugPublicHeaderOverlay_dismiss', function(e) {
                        headerOverlay.fadeOut('fast', function(e) {
                            setCookie('headerOverlay', 'shown', objectName.settings.pwaOverlaysShowAgain);
                        });
                    });
                }

                // Handle snackbar installation overlay
                if (objectName.settings.pwaOverlaysTypeSnackbar == 'on' && isSnackbarOverlayShown == null && snackbarOverlay.length) {
                    if ((objectName.settings.pwaOverlaysBrowsers.includes('chrome') && isAndroidChrome) || (objectName.settings.pwaOverlaysBrowsers.includes('edge') && isAndroidEdge)) {
                        var isSnackbarOverlayFired = false;
                        var installPromptEvent = void 0;
                        window.addEventListener('beforeinstallprompt', function(event) {
                            event.preventDefault();
                            installPromptEvent = event;
                            if (!isSnackbarOverlayFired) {
                                setTimeout(function() {
                                    snackbarOverlay.css('display', 'flex').hide().fadeIn('fast', function(e) {
                                        isSnackbarOverlayFired = true;
                                        snackbarOverlay.on('click', '.daftplugPublicSnackbarOverlay_button', function(e) {
                                            snackbarOverlay.fadeOut('fast', function(e) {
                                                setCookie('snackbarOverlay', 'shown', objectName.settings.pwaOverlaysShowAgain);
                                                installPromptEvent.prompt();
                                                installPromptEvent = null;
                                            });
                                        });
                                    });
                                    setTimeout(function() {
                                        snackbarOverlay.fadeOut('fast', function(e) {
                                            setCookie('snackbarOverlay', 'shown', objectName.settings.pwaOverlaysShowAgain);
                                        });
                                    }, 8000);
                                }, objectName.settings.pwaOverlaysDelay * 1000);
                            }
                        });
                    } else if (objectName.settings.pwaOverlaysBrowsers.includes('firefox') && isAndroidFirefox && firefoxFullscreenOverlay.length) {
                        setTimeout(function() {
                            snackbarOverlay.css('display', 'flex').hide().fadeIn('fast').on('click', '.daftplugPublicSnackbarOverlay_button', function(e) {
                                snackbarOverlay.fadeOut('fast', function(e) {
                                    setCookie('snackbarOverlay', 'shown', objectName.settings.pwaOverlaysShowAgain);
                                    firefoxFullscreenOverlay.fadeIn('fast').on('click', '.daftplugPublicFullscreenOverlay_close', function(e) {
                                        firefoxFullscreenOverlay.fadeOut('fast');
                                    });
                                });
                            });
                            setTimeout(function() {
                                snackbarOverlay.fadeOut('fast', function(e) {
                                    setCookie('snackbarOverlay', 'shown', objectName.settings.pwaOverlaysShowAgain);
                                });
                            }, 8000);
                        }, objectName.settings.pwaOverlaysDelay * 1000);
                    } else if (objectName.settings.pwaOverlaysBrowsers.includes('opera') && isAndroidOpera && operaFullscreenOverlay.length) {
                        setTimeout(function() {
                            snackbarOverlay.css('display', 'flex').hide().fadeIn('fast').on('click', '.daftplugPublicSnackbarOverlay_button', function(e) {
                                snackbarOverlay.fadeOut('fast', function(e) {
                                    setCookie('snackbarOverlay', 'shown', objectName.settings.pwaOverlaysShowAgain);
                                    operaFullscreenOverlay.fadeIn('fast').on('click', '.daftplugPublicFullscreenOverlay_close', function(e) {
                                        operaFullscreenOverlay.fadeOut('fast');
                                    });
                                });
                            });
                            setTimeout(function() {
                                snackbarOverlay.fadeOut('fast', function(e) {
                                    setCookie('snackbarOverlay', 'shown', objectName.settings.pwaOverlaysShowAgain);
                                });
                            }, 8000);
                        }, objectName.settings.pwaOverlaysDelay * 1000);
                    } else if (objectName.settings.pwaOverlaysBrowsers.includes('safari') && isIosSafari && safariFullscreenOverlay.length) {
                        setTimeout(function() {
                            snackbarOverlay.css('display', 'flex').hide().fadeIn('fast').on('click', '.daftplugPublicSnackbarOverlay_button', function(e) {
                                snackbarOverlay.fadeOut('fast', function(e) {
                                    setCookie('snackbarOverlay', 'shown', objectName.settings.pwaOverlaysShowAgain);
                                    safariFullscreenOverlay.fadeIn('fast').on('click', '.daftplugPublicFullscreenOverlay_close', function(e) {
                                        safariFullscreenOverlay.fadeOut('fast');
                                    });
                                });
                            });
                            setTimeout(function() {
                                snackbarOverlay.fadeOut('fast', function(e) {
                                    setCookie('snackbarOverlay', 'shown', objectName.settings.pwaOverlaysShowAgain);
                                });
                            }, 8000);
                        }, objectName.settings.pwaOverlaysDelay * 1000);
                    }
                }

                // Handle post installation overlay
                if (objectName.settings.pwaOverlaysTypePost == 'on' && isPostOverlayShown == null && postOverlay.length) {
                    if ((objectName.settings.pwaOverlaysBrowsers.includes('chrome') && isAndroidChrome) || (objectName.settings.pwaOverlaysBrowsers.includes('edge') && isAndroidEdge)) {
                        var isPostOverlayFired = false;
                        var installPromptEvent = void 0;
                        window.addEventListener('beforeinstallprompt', function(event) {
                            event.preventDefault();
                            installPromptEvent = event;
                            setTimeout(function() {
                                if (!isPostOverlayFired) {
                                    postOverlay.fadeIn('fast', function(e) {
                                        isPostOverlayFired = true;
                                        postOverlay.on('click', '.daftplugPublicPostOverlayAction_button.-install', function(e) {
                                            postOverlay.fadeOut('fast', function(e) {
                                                setCookie('postOverlay', 'shown', objectName.settings.pwaOverlaysShowAgain);
                                                installPromptEvent.prompt();
                                                installPromptEvent = null;
                                            });
                                        });
                                    });
                                }
                            }, objectName.settings.pwaOverlaysDelay * 1000);
                        });
                    } else if (objectName.settings.pwaOverlaysBrowsers.includes('firefox') && isAndroidFirefox && firefoxFullscreenOverlay.length) {
                        setTimeout(function() {
                            postOverlay.fadeIn('fast').on('click', '.daftplugPublicPostOverlayAction_button.-install', function(e) {
                                postOverlay.fadeOut('fast', function(e) {
                                    setCookie('postOverlay', 'shown', objectName.settings.pwaOverlaysShowAgain);
                                    firefoxFullscreenOverlay.fadeIn('fast').on('click', '.daftplugPublicFullscreenOverlay_close', function(e) {
                                        firefoxFullscreenOverlay.fadeOut('fast');
                                    });
                                });
                            });
                        }, objectName.settings.pwaOverlaysDelay * 1000);
                    } else if (objectName.settings.pwaOverlaysBrowsers.includes('opera') && isAndroidOpera && operaFullscreenOverlay.length) {
                        setTimeout(function() {
                            postOverlay.fadeIn('fast').on('click', '.daftplugPublicPostOverlayAction_button.-install', function(e) {
                                postOverlay.fadeOut('fast', function(e) {
                                    setCookie('postOverlay', 'shown', objectName.settings.pwaOverlaysShowAgain);
                                    operaFullscreenOverlay.fadeIn('fast').on('click', '.daftplugPublicFullscreenOverlay_close', function(e) {
                                        operaFullscreenOverlay.fadeOut('fast');
                                    });
                                });
                            });
                        }, objectName.settings.pwaOverlaysDelay * 1000);
                    } else if (objectName.settings.pwaOverlaysBrowsers.includes('safari') && isIosSafari && safariFullscreenOverlay.length) {
                        setTimeout(function() {
                            postOverlay.fadeIn('fast').on('click', '.daftplugPublicPostOverlayAction_button.-install', function(e) {
                                postOverlay.fadeOut('fast', function(e) {
                                    setCookie('postOverlay', 'shown', objectName.settings.pwaOverlaysShowAgain);
                                    safariFullscreenOverlay.fadeIn('fast').on('click', '.daftplugPublicFullscreenOverlay_close', function(e) {
                                        safariFullscreenOverlay.fadeOut('fast');
                                    });
                                });
                            });
                        }, objectName.settings.pwaOverlaysDelay * 1000);
                    }

                    postOverlay.on('click', '.daftplugPublicPostOverlayAction_button.-dismiss', function(e) {
                        postOverlay.fadeOut('fast', function(e) {
                            setCookie('postOverlay', 'shown', objectName.settings.pwaOverlaysShowAgain);
                        });
                    });
                }

                // Handle ios special installation overlay
                if (objectName.settings.pwaOverlaysTypeIos == 'on' && isIosOverlayShown == null && iosOverlay.length && objectName.settings.pwaOverlaysBrowsers.includes('safari') && isIosSafari) {
                    setTimeout(function() {
                        iosOverlay.fadeIn('fast').on('click', '.daftplugPublicIosOverlay_close', function(e) {
                            iosOverlay.fadeOut('fast', function(e) {
                                setCookie('iosOverlay', 'shown', objectName.settings.pwaOverlaysShowAgain);
                            });
                        });
                    }, objectName.settings.pwaOverlaysDelay * 1000);
                }

                // Handle menu installation overlay
                if (objectName.settings.pwaOverlaysTypeMenu == 'on' && isMenuOverlayShown == null && menuOverlay.length) {
                    if ((objectName.settings.pwaOverlaysBrowsers.includes('chrome') && isAndroidChrome) || (objectName.settings.pwaOverlaysBrowsers.includes('edge') && isAndroidEdge)) {
                        var isMenuOverlayFired = false;
                        var installPromptEvent = void 0;
                        window.addEventListener('beforeinstallprompt', function(event) {
                            event.preventDefault();
                            installPromptEvent = event;
                            setTimeout(function() {
                                if (!isMenuOverlayFired) {
                                    menuOverlay.css('display', 'flex').hide().fadeIn('fast', function(e) {
                                        isMenuOverlayFired = true;
                                        menuOverlay.on('click', '.daftplugPublicMenuOverlay_install', function(e) {
                                            menuOverlay.fadeOut('fast', function(e) {
                                                setCookie('menuOverlay', 'shown', objectName.settings.pwaOverlaysShowAgain);
                                                installPromptEvent.prompt();
                                                installPromptEvent = null;
                                            });
                                        });
                                    });
                                }
                            }, objectName.settings.pwaOverlaysDelay * 1000);
                        });
                    } else if (objectName.settings.pwaOverlaysBrowsers.includes('firefox') && isAndroidFirefox && firefoxFullscreenOverlay.length) {
                        setTimeout(function() {
                            menuOverlay.css('display', 'flex').hide().fadeIn('fast').on('click', '.daftplugPublicMenuOverlay_install', function(e) {
                                menuOverlay.fadeOut('fast', function(e) {
                                    setCookie('menuOverlay', 'shown', objectName.settings.pwaOverlaysShowAgain);
                                    firefoxFullscreenOverlay.fadeIn('fast').on('click', '.daftplugPublicFullscreenOverlay_close', function(e) {
                                        firefoxFullscreenOverlay.fadeOut('fast');
                                    });
                                });
                            });
                        }, objectName.settings.pwaOverlaysDelay * 1000);
                    } else if (objectName.settings.pwaOverlaysBrowsers.includes('opera') && isAndroidOpera && operaFullscreenOverlay.length) {
                        setTimeout(function() {
                            menuOverlay.css('display', 'flex').hide().fadeIn('fast').on('click', '.daftplugPublicMenuOverlay_install', function(e) {
                                menuOverlay.fadeOut('fast', function(e) {
                                    setCookie('menuOverlay', 'shown', objectName.settings.pwaOverlaysShowAgain);
                                    operaFullscreenOverlay.fadeIn('fast').on('click', '.daftplugPublicFullscreenOverlay_close', function(e) {
                                        operaFullscreenOverlay.fadeOut('fast');
                                    });
                                });
                            });
                        }, objectName.settings.pwaOverlaysDelay * 1000);
                    } else if (objectName.settings.pwaOverlaysBrowsers.includes('safari') && isIosSafari && safariFullscreenOverlay.length) {
                        setTimeout(function() {
                            menuOverlay.css('display', 'flex').hide().fadeIn('fast').on('click', '.daftplugPublicMenuOverlay_install', function(e) {
                                menuOverlay.fadeOut('fast', function(e) {
                                    setCookie('menuOverlay', 'shown', objectName.settings.pwaOverlaysShowAgain);
                                    safariFullscreenOverlay.fadeIn('fast').on('click', '.daftplugPublicFullscreenOverlay_close', function(e) {
                                        safariFullscreenOverlay.fadeOut('fast');
                                    });
                                });
                            });
                        }, objectName.settings.pwaOverlaysDelay * 1000);
                    }

                    menuOverlay.on('click', '.daftplugPublicMenuOverlay_dismiss', function(e) {
                        menuOverlay.fadeOut('fast', function(e) {
                            setCookie('menuOverlay', 'shown', objectName.settings.pwaOverlaysShowAgain);
                        });
                    });
                }

                // Handle feed installation overlay
                if (objectName.settings.pwaOverlaysTypeFeed == 'on' && isFeedOverlayShown == null && feedOverlay.length) {
                    if ((objectName.settings.pwaOverlaysBrowsers.includes('chrome') && isAndroidChrome) || (objectName.settings.pwaOverlaysBrowsers.includes('edge') && isAndroidEdge)) {
                        var isFeedOverlayFired = false;
                        var installPromptEvent = void 0;
                        window.addEventListener('beforeinstallprompt', function(event) {
                            event.preventDefault();
                            installPromptEvent = event;
                            setTimeout(function() {
                                if (!isFeedOverlayFired) {
                                    feedOverlay.css('display', 'flex').hide().fadeIn('fast', function(e) {
                                        isFeedOverlayFired = true;
                                        feedOverlay.on('click', '.daftplugPublicFeedOverlay_install', function(e) {
                                            feedOverlay.fadeOut('fast', function(e) {
                                                setCookie('feedOverlay', 'shown', objectName.settings.pwaOverlaysShowAgain);
                                                installPromptEvent.prompt();
                                                installPromptEvent = null;
                                            });
                                        });
                                    });
                                }
                            }, objectName.settings.pwaOverlaysDelay * 1000);
                        });
                    } else if (objectName.settings.pwaOverlaysBrowsers.includes('firefox') && isAndroidFirefox && firefoxFullscreenOverlay.length) {
                        setTimeout(function() {
                            feedOverlay.css('display', 'flex').hide().fadeIn('fast').on('click', '.daftplugPublicFeedOverlay_install', function(e) {
                                feedOverlay.fadeOut('fast', function(e) {
                                    setCookie('feedOverlay', 'shown', objectName.settings.pwaOverlaysShowAgain);
                                    firefoxFullscreenOverlay.fadeIn('fast').on('click', '.daftplugPublicFullscreenOverlay_close', function(e) {
                                        firefoxFullscreenOverlay.fadeOut('fast');
                                    });
                                });
                            });
                        }, objectName.settings.pwaOverlaysDelay * 1000);
                    } else if (objectName.settings.pwaOverlaysBrowsers.includes('opera') && isAndroidOpera && operaFullscreenOverlay.length) {
                        setTimeout(function() {
                            feedOverlay.css('display', 'flex').hide().fadeIn('fast').on('click', '.daftplugPublicFeedOverlay_install', function(e) {
                                feedOverlay.fadeOut('fast', function(e) {
                                    setCookie('feedOverlay', 'shown', objectName.settings.pwaOverlaysShowAgain);
                                    operaFullscreenOverlay.fadeIn('fast').on('click', '.daftplugPublicFullscreenOverlay_close', function(e) {
                                        operaFullscreenOverlay.fadeOut('fast');
                                    });
                                });
                            });
                        }, objectName.settings.pwaOverlaysDelay * 1000);
                    } else if (objectName.settings.pwaOverlaysBrowsers.includes('safari') && isIosSafari && safariFullscreenOverlay.length) {
                        setTimeout(function() {
                            feedOverlay.css('display', 'flex').hide().fadeIn('fast').on('click', '.daftplugPublicFeedOverlay_install', function(e) {
                                feedOverlay.fadeOut('fast', function(e) {
                                    setCookie('feedOverlay', 'shown', objectName.settings.pwaOverlaysShowAgain);
                                    safariFullscreenOverlay.fadeIn('fast').on('click', '.daftplugPublicFullscreenOverlay_close', function(e) {
                                        safariFullscreenOverlay.fadeOut('fast');
                                    });
                                });
                            });
                        }, objectName.settings.pwaOverlaysDelay * 1000);
                    }

                    feedOverlay.on('click', '.daftplugPublicFeedOverlay_dismiss', function(e) {
                        feedOverlay.fadeOut('fast', function(e) {
                            setCookie('feedOverlay', 'shown', objectName.settings.pwaOverlaysShowAgain);
                        });
                    });
                }

                // Handle checkout installation overlay
                if (objectName.settings.pwaOverlaysTypeCheckout == 'on' && isCheckoutOverlayShown == null && checkoutOverlay.length) {
                    if ((objectName.settings.pwaOverlaysBrowsers.includes('chrome') && isAndroidChrome) || (objectName.settings.pwaOverlaysBrowsers.includes('edge') && isAndroidEdge)) {
                        var isCheckoutOverlayFired = false;
                        var installPromptEvent = void 0;  
                        window.addEventListener('beforeinstallprompt', function(event) {
                            event.preventDefault();
                            installPromptEvent = event;
                            setTimeout(function() {
                                if (!isCheckoutOverlayFired) {
                                    checkoutOverlay.css('display', 'flex').hide().fadeIn('fast', function(e) {
                                        isCheckoutOverlayFired = true;
                                        checkoutOverlay.on('click', '.daftplugPublicCheckoutOverlay_install', function(e) {
                                            checkoutOverlay.fadeOut('fast', function(e) {
                                                setCookie('checkoutOverlay', 'shown', objectName.settings.pwaOverlaysShowAgain);
                                                installPromptEvent.prompt();
                                                installPromptEvent = null;
                                            });
                                        });
                                    });
                                }
                            }, objectName.settings.pwaOverlaysDelay * 1000);
                        });
                    } else if (objectName.settings.pwaOverlaysBrowsers.includes('firefox') && isAndroidFirefox && firefoxFullscreenOverlay.length) {
                        setTimeout(function() {
                            checkoutOverlay.css('display', 'flex').hide().fadeIn('fast').on('click', '.daftplugPublicCheckoutOverlay_install', function(e) {
                                checkoutOverlay.fadeOut('fast', function(e) {
                                    setCookie('checkoutOverlay', 'shown', objectName.settings.pwaOverlaysShowAgain);
                                    firefoxFullscreenOverlay.fadeIn('fast').on('click', '.daftplugPublicFullscreenOverlay_close', function(e) {
                                        firefoxFullscreenOverlay.fadeOut('fast');
                                    });
                                });
                            });
                        }, objectName.settings.pwaOverlaysDelay * 1000);
                    } else if (objectName.settings.pwaOverlaysBrowsers.includes('opera') && isAndroidOpera && operaFullscreenOverlay.length) {
                        setTimeout(function() {
                            checkoutOverlay.css('display', 'flex').hide().fadeIn('fast').on('click', '.daftplugPublicCheckoutOverlay_install', function(e) {
                                checkoutOverlay.fadeOut('fast', function(e) {
                                    setCookie('checkoutOverlay', 'shown', objectName.settings.pwaOverlaysShowAgain);
                                    operaFullscreenOverlay.fadeIn('fast').on('click', '.daftplugPublicFullscreenOverlay_close', function(e) {
                                        operaFullscreenOverlay.fadeOut('fast');
                                    });
                                });
                            });
                        }, objectName.settings.pwaOverlaysDelay * 1000);
                    } else if (objectName.settings.pwaOverlaysBrowsers.includes('safari') && isIosSafari && safariFullscreenOverlay.length) {
                        setTimeout(function() {
                            checkoutOverlay.css('display', 'flex').hide().fadeIn('fast').on('click', '.daftplugPublicCheckoutOverlay_install', function(e) {
                                checkoutOverlay.fadeOut('fast', function(e) {
                                    setCookie('checkoutOverlay', 'shown', objectName.settings.pwaOverlaysShowAgain);
                                    safariFullscreenOverlay.fadeIn('fast').on('click', '.daftplugPublicFullscreenOverlay_close', function(e) {
                                        safariFullscreenOverlay.fadeOut('fast');
                                    });
                                });
                            });
                        }, objectName.settings.pwaOverlaysDelay * 1000);
                    }

                    checkoutOverlay.on('click', '.daftplugPublicCheckoutOverlay_dismiss', function(e) {
                        checkoutOverlay.fadeOut('fast', function(e) {
                            setCookie('checkoutOverlay', 'shown', objectName.settings.pwaOverlaysShowAgain);
                        });
                    });
                }

                // Handle coupon reward installation overlay
                if (objectName.settings.pwaOverlaysTypeCoupon == 'on' && isCouponOverlayShown == null && couponOverlay.length) {
                    if ((objectName.settings.pwaOverlaysBrowsers.includes('chrome') && isAndroidChrome) || (objectName.settings.pwaOverlaysBrowsers.includes('edge') && isAndroidEdge)) {
                        var isCouponOverlayFired = false;
                        var installPromptEvent = void 0;
                        window.addEventListener('beforeinstallprompt', function(event) {
                            event.preventDefault();
                            installPromptEvent = event;
                            setTimeout(function() {
                                if (!isCouponOverlayFired) {
                                    couponOverlay.fadeIn('fast', function(e) {
                                        isCouponOverlayFired = true;
                                        couponOverlay.on('click', '.daftplugPublicCouponOverlay_button.-install', function(e) {
                                            couponOverlay.fadeOut('fast', function(e) {
                                                setCookie('couponOverlay', 'shown', objectName.settings.pwaOverlaysShowAgain);
                                                installPromptEvent.prompt();
                                                installPromptEvent = null;
                                            });
                                        });
                                    });
                                }
                            }, objectName.settings.pwaOverlaysDelay * 1000);
                        });
                    } else if (objectName.settings.pwaOverlaysBrowsers.includes('firefox') && isAndroidFirefox && firefoxFullscreenOverlay.length) {
                        setTimeout(function() {
                            couponOverlay.fadeIn('fast').on('click', '.daftplugPublicCouponOverlay_button.-install', function(e) {
                                couponOverlay.fadeOut('fast', function(e) {
                                    setCookie('couponOverlay', 'shown', objectName.settings.pwaOverlaysShowAgain);
                                    firefoxFullscreenOverlay.fadeIn('fast').on('click', '.daftplugPublicFullscreenOverlay_close', function(e) {
                                        firefoxFullscreenOverlay.fadeOut('fast');
                                    });
                                });
                            });
                        }, objectName.settings.pwaOverlaysDelay * 1000);
                    } else if (objectName.settings.pwaOverlaysBrowsers.includes('opera') && isAndroidOpera && operaFullscreenOverlay.length) {
                        setTimeout(function() {
                            couponOverlay.fadeIn('fast').on('click', '.daftplugPublicCouponOverlay_button.-install', function(e) {
                                couponOverlay.fadeOut('fast', function(e) {
                                    setCookie('couponOverlay', 'shown', objectName.settings.pwaOverlaysShowAgain);
                                    operaFullscreenOverlay.fadeIn('fast').on('click', '.daftplugPublicFullscreenOverlay_close', function(e) {
                                        operaFullscreenOverlay.fadeOut('fast');
                                    });
                                });
                            });
                        }, objectName.settings.pwaOverlaysDelay * 1000);
                    } else if (objectName.settings.pwaOverlaysBrowsers.includes('safari') && isIosSafari && safariFullscreenOverlay.length) {
                        setTimeout(function() {
                            couponOverlay.fadeIn('fast').on('click', '.daftplugPublicCouponOverlay_button.-install', function(e) {
                                couponOverlay.fadeOut('fast', function(e) {
                                    setCookie('couponOverlay', 'shown', objectName.settings.pwaOverlaysShowAgain);
                                    safariFullscreenOverlay.fadeIn('fast').on('click', '.daftplugPublicFullscreenOverlay_close', function(e) {
                                        safariFullscreenOverlay.fadeOut('fast');
                                    });
                                });
                            });
                        }, objectName.settings.pwaOverlaysDelay * 1000);
                    }

                    couponOverlay.on('click', '.daftplugPublicCouponOverlay_close, .daftplugPublicCouponOverlay_background', function(e) {
                        couponOverlay.fadeOut('fast', function(e) {
                            setCookie('couponOverlay', 'shown', objectName.settings.pwaOverlaysShowAgain);
                        });
                    });
                }
            }
        }
    }

    // Handle installation button
    if (objectName.settings.pwaInstallButton == 'on' && !isPwa() && !isFacebookApp() && installButton.length) {
        if ((objectName.settings.pwaOverlaysBrowsers.includes('chrome') && isChrome) || (objectName.settings.pwaOverlaysBrowsers.includes('edge') && isEdge)) {
            var installPromptEvent = void 0;
            window.addEventListener('beforeinstallprompt', function(event) {
                event.preventDefault();
                installPromptEvent = event;
                setTimeout(function() {
                    installButton.css('display', 'inline-block').on('click', function(e) {
                        installPromptEvent.prompt();
                        installPromptEvent = null;
                    });
                }, 1000);
            });
        } else if (objectName.settings.pwaInstallButtonBrowsers.includes('firefox') && isAndroidFirefox && firefoxFullscreenOverlay.length) {
            setTimeout(function() {
                installButton.css('display', 'inline-block').on('click', function(e) {
                    firefoxFullscreenOverlay.fadeIn('fast').on('click', '.daftplugPublicFullscreenOverlay_close', function(e) {
                        firefoxFullscreenOverlay.fadeOut('fast');
                    });
                });
            }, 1000);
        } else if (objectName.settings.pwaInstallButtonBrowsers.includes('opera') && isAndroidOpera && operaFullscreenOverlay.length) {
            setTimeout(function() {
                installButton.css('display', 'inline-block').on('click', function(e) {
                    operaFullscreenOverlay.fadeIn('fast').on('click', '.daftplugPublicFullscreenOverlay_close', function(e) {
                        operaFullscreenOverlay.fadeOut('fast');
                    });
                });
            }, 1000);
        } else if (objectName.settings.pwaInstallButtonBrowsers.includes('safari') && isIosSafari && safariFullscreenOverlay.length) {
            setTimeout(function() {
                installButton.css('display', 'inline-block').on('click', function(e) {
                    safariFullscreenOverlay.fadeIn('fast').on('click', '.daftplugPublicFullscreenOverlay_close', function(e) {
                        safariFullscreenOverlay.fadeOut('fast');
                    });
                });
            }, 1000);
        }
    }

    // Handle pwa stuff
    if (isPwa()) {
        // Add isPwa class to body
        jQuery(document.body).addClass('isPwa');

        // Detect PWA on server-side
        if (objectName.settings.pwaDetectionMode == 'queryParameter') {
            var currentUrlParams = new URLSearchParams(window.location.search);
            if (currentUrlParams.has('isPwa')) {
                jQuery(document).on('DOMNodeInserted', document.body, function(e) {
                    jQuery('a[href*="'+window.location.hostname+'"], a[href^="/"], a[href^="."]').each(function(e) {
                        var self = jQuery(this);
                        var hrefUrl = self.attr('href');
                        var newUrl = addQueryParameter(hrefUrl, 'isPwa', 'true');
                        self.attr('href', newUrl);
                    });
                });
            } else {
                window.location.search += '&isPwa=true';
            }
        } else {
            setCookie('isPwa', 'true');
        }

        // Handle first time open PWA
        if (localStorage.getItem('installedPwa') === null) {
            // Handle PWA installer data
            jQuery.ajax({
                url: objectName.ajaxUrl,
                dataType: 'text',
                type: 'POST',
                data: {
                    action: optionName + '_save_installer_data',
                    browser: parser.getBrowser().name,
                    device: parser.getOS().name,
                },
                beforeSend: function() {
                    
                },
                success: function(response, textStatus, jqXhr) {
                    localStorage.setItem('installedPwa', 'true');
                },
                complete: function() {
    
                },
                error: function(jqXhr, textStatus, errorThrown) {
                    console.log(jqXhr);
                }
            });

            // Handle coupon reward popup
            if (isMobile || isTablet) {
                jQuery.ajax({
                    url: objectName.ajaxUrl,
                    dataType: 'text',
                    type: 'POST',
                    data: {
                        action: optionName + '_display_coupon_reward',
                    },
                    beforeSend: function() {
                        
                    },
                    success: function(response, textStatus, jqXhr) {
                        var response = JSON.parse(response);
                        if (response.success) {
                            daftplugPublic.append(`
                                <div class="daftplugPublicCouponOverlay -reward">
                                    <div class="daftplugPublicCouponOverlay_background"></div>
                                    <div class="daftplugPublicCouponOverlay_content">
                                        <div class="daftplugPublicCouponOverlay_close"></div>
                                        <img class="daftplugPublicCouponOverlay_icon" src="${response.data.iconUrl}"/>
                                        <div class="daftplugPublicCouponOverlay_title">${response.data.title}</div>
                                        <div class="daftplugPublicCouponOverlay_message">${response.data.message}</div>
                                        <button class="daftplugPublicCouponOverlay_button" style="padding: 10px 20px; font-size: 20px;">${response.data.couponCode}</button>
                                    </div>
                                </div>
                            `);

                            jQuery('.daftplugPublicCouponOverlay.-reward .daftplugPublicCouponOverlay_button').on('click tap', function(e) {
                                (async() => {
                                    try {
                                        await navigator.clipboard.writeText(response.data.couponCode);
                                        jQuery('.daftplugPublicCouponOverlay.-reward').addClass('-copying').delay(500).queue(function() {
                                            jQuery(this).removeClass('-copying').dequeue();
                                        });
                                    } catch(err) {
                                        console.error('Failed to copy: ', err);
                                    }
                                })();
                            });

                            jQuery('.daftplugPublicCouponOverlay.-reward .daftplugPublicCouponOverlay_close, .daftplugPublicCouponOverlay.-reward .daftplugPublicCouponOverlay_background').on('click tap', function(e) {
                                jQuery('.daftplugPublicCouponOverlay.-reward').fadeOut('fast');
                            });
                        }
                    },
                    complete: function() {
        
                    },
                    error: function(jqXhr, textStatus, errorThrown) {
                        console.log(jqXhr);
                    }
                });
            }
        }
    } else {
        // Remove cookie for the server
        removeCookie('isPwa');
    }
});