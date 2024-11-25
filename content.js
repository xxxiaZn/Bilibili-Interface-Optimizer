const AD_SELECTORS = {
    common: [
        'slide_ad',                        // 视频页右侧广告
        '.video-card-ad-small',            // 视频页右侧广告
        '.video-page-special-card-small',  // 视频页右侧广告
        '.adcard-content',                 // 主页右侧"稍后观看"按钮上面的广告
        '#biliMainFooter',                 // 搜索页底部
        '.recommended-swipe',              // 首页轮播广告
        '.left-entry',                     // 主页左侧导航栏
        '.trending',                       // 搜索栏热搜
        '.new-charge-btn',                 // 充电按钮
        '.ad-report',                      // 视频页右侧广告（推荐视频上方和下方）
        '.pop-live-small-mode',            // 推荐视频下方的推荐直播
        '.activity-m-v1',                  // 视频标签下方广告
        '.channel-icons',                  // 导航栏左侧图标
        '.right-channel-container',        // 导航栏右侧容器
        '.floor-single-card',              // 主页综艺、纪录片、电视剧、电影等视频卡片
        '.header-channel',                 // 主页下拉后顶部出现的导航栏
        '.flexible-roll-btn'               // 主页右下角"刷新内容"按钮
    ],
    shadowDOM: {
        commentAd: {
            path: ['#commentapp > bili-comments', '#header > bili-comments-header-renderer', '#notice'],
            description: '评论区顶部广告'
        }
    }
};

const utils = {
    hideElement(element) {
        if (element) {
            element.style.display = 'none';
        }
    },
    
    querySelectorAll(selector) {
        return Array.from(document.querySelectorAll(selector));
    },
    
    processShadowDOM(pathSelectors) {
        let currentElement = document;
        for (const selector of pathSelectors) {
            if (!currentElement) break;
            currentElement = currentElement instanceof Document 
                ? currentElement.querySelector(selector)
                : currentElement.shadowRoot?.querySelector(selector);
        }
        return currentElement;
    }
};

const adHandler = {
    hideCommonAds() {
        AD_SELECTORS.common.forEach(selector => {
            const elements = selector.startsWith('.')
                ? document.getElementsByClassName(selector.substring(1))
                : [document.getElementById(selector.replace('#', ''))];
            
            Array.from(elements).forEach(utils.hideElement);
        });
    },

    hideShadowDOMAds() {
        Object.values(AD_SELECTORS.shadowDOM).forEach(({ path }) => {
            const element = utils.processShadowDOM(path);
            utils.hideElement(element);
        });
    },

    hideFeedCards() {
        utils.querySelectorAll('.feed-card').forEach(card => {
            if (!card.querySelector('.enable-no-interest')) {
                utils.hideElement(card);
            }
        });
    },

    hideVideoCards() {
        if (window.location.hostname === 'www.bilibili.com') {
            Array.from(document.getElementsByClassName('bili-video-card')).forEach(card => {
                if (!card.classList.contains('enable-no-interest')) {
                    utils.hideElement(card);
                }
            });
        }
    },

    hideSearchAds() {
        if (window.location.hostname === 'search.bilibili.com') {
            utils.querySelectorAll('.col_3.col_xs_1_5.col_md_2.col_xl_1_7.mb_x40').forEach(card => {
                if (card.querySelector('a[href^="//cm.bilibili.com"]')) {
                    utils.hideElement(card);
                }
            });
        }
    }
};

const logoHandler = {
    move() {
        const logo = document.querySelector('.bili-header__banner .inner-logo');
        const searchContainer = document.querySelector('.bili-header__bar .center-search-container');
        
        if (logo && searchContainer) {
            const logoContainer = document.createElement('div');
            logoContainer.style.marginRight = '20px';
            logoContainer.appendChild(logo);
            searchContainer.parentNode.insertBefore(logoContainer, searchContainer);
            
            //替换logo图片,不稳定,有时候加载不出来
            const logoImg = logo.querySelector('.logo-img');
            if (logoImg) {
                logoImg.src = chrome.runtime.getURL('images/bilibili_logo.png');
                logoImg.srcset = '';
            }
        }
    }
};

function main() {
    adHandler.hideCommonAds();
    adHandler.hideShadowDOMAds();
    adHandler.hideFeedCards();
    adHandler.hideVideoCards();
    adHandler.hideSearchAds();
}

document.addEventListener('DOMContentLoaded', main);

const mainObserver = new MutationObserver(main);
mainObserver.observe(document.documentElement, {
    childList: true,
    subtree: true
});

const logoObserver = new MutationObserver(logoHandler.move);
logoObserver.observe(document.documentElement, {
    childList: true,
    subtree: true
});