"use strict";
/**
 * File: stardust.js
 * Project: Stardust
 * Author: Jonathan Gregson <jonathan@jdgregson.com>
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
/** toast **/
/**
 * Show a toast, or a short message, on the user interface.
 * @param {string} message The message to show on the UI.
 * @param {number=} timeout The number of milliseconds to show the toast.
 * @param {boolean=} enableHTML Whether or not to permit HTML in the output.
 *     Default: false.
 */
var showToast = function (message, timeout, enableHTML) {
    if (timeout === void 0) { timeout = 3000; }
    if (enableHTML === void 0) { enableHTML = false; }
    var toast = document.createElement('div');
    var toastWrap = document.createElement('div');
    toast.setAttribute('class', 'toast');
    toastWrap.setAttribute('class', 'toast-wrap');
    if (enableHTML) {
        toast.innerHTML = message;
    }
    else {
        toast.innerText = message;
    }
    toastWrap.appendChild(toast);
    document.body.appendChild(toastWrap);
    self.setTimeout(function () {
        toastWrap.style.opacity = '1';
    }, 50);
    self.setTimeout(function () {
        toastWrap.style.opacity = '0';
    }, timeout + 500);
    self.setTimeout(function () {
        document.body.removeChild(toastWrap);
    }, timeout + 2500);
};
/** tip orb */
/**
 * Creates an animated tooltip orb at x, y, which will spread out from x, y
 * until it disappears, and will then be removed from the DOM.
 * @param {number} x The X coordinate that the orb should originate from.
 * @param {number} y The Y coordinate that the orb should originate from.
 */
var showTipOrb = function (x, y) {
    var orb = document.createElement('div');
    orb.classList.add('tooltip-orb');
    orb.style.top = "".concat(y, "px");
    orb.style.left = "".concat(x, "px");
    document.body.appendChild(orb);
    self.setTimeout(function () {
        orb.style.transform = 'scale(50)';
    }, 10);
    self.setTimeout(function () {
        orb.style.opacity = '0';
    }, 10);
    self.setTimeout(function () {
        document.body.removeChild(orb);
    }, 1000);
};
/** loading bar **/
/**
 * Resets the loading bar so that it is ready to be shown again.
 */
var resetLoadingBar = function () {
    var loadingBar = document.getElementById('loading-bar');
    if (loadingBar) {
        loadingBar.style.display = 'none';
        loadingBar.style.left = '-100%';
        self.setTimeout(function () {
            loadingBar.style.display = 'block';
        }, 100);
    }
};
/**
 * Updates the loading bar to indicate that it is N percent complete.
 * @param {number} percent Integer representing the percentage to set the
 *     loading bar to.
 */
var updateLoadingBar = function (percent) {
    var loadingBar = document.getElementById('loading-bar');
    if (loadingBar) {
        if (percent > 100) {
            throw 'Cannot exceed 100%';
        }
        else if (percent === 100) {
            loadingBar.style.left = '0';
            self.setTimeout(function () {
                loadingBar.style.left = '100%';
            }, 100);
            self.setTimeout(function () {
                resetLoadingBar();
            }, 200);
        }
        else {
            loadingBar.style.left = "-".concat(100 - percent, "%");
        }
    }
};
/**
 * Updates the height of all bumper divs. Bumpers (a div with class .bumper) are
 * meant to push content down the page when the div above them is absolutely
 * positioned.
 */
var updateBumpers = function () {
    var bumpers = document.getElementsByClassName('bumper');
    for (var i = 0; i < bumpers.length; i++) {
        var bumper = bumpers[i];
        if (bumper.previousElementSibling &&
            bumper.previousElementSibling.tagName.toLowerCase() === 'div') {
            var bumperTarget = bumper.previousElementSibling;
            var bumperTargetStyle = getComputedStyle(bumperTarget);
            bumper.style.height = bumperTargetStyle.height;
        }
    }
};
/** DOM overrides **/
/**
 * Wraps select elements with the '.select-wrap' div so we can customize them
 * easier.
 */
var rebindSelectObjects = function () {
    var changesMade = false;
    var selects = document.querySelectorAll('select:not(.rebound)');
    for (var i = 0; i < selects.length; i++) {
        var select = selects[i];
        if (select.getAttribute('options-bound') ||
            select.getAttribute('actions-bound')) {
            select.removeAttribute('options-bound');
            select.removeAttribute('actions-bound');
        }
        var wrap = document.createElement('div');
        wrap.setAttribute('class', 'select-wrap');
        wrap.innerHTML = select.outerHTML;
        select.outerHTML = wrap.outerHTML;
        select.classList.add('rebound');
        changesMade = true;
    }
    if (changesMade) {
        bindOptions();
        bindActions();
    }
};
/** options and actions **/
/**
 * Returns the options object form local storage if set, or a default object if
 * not set.
 * @return {object} The options object.
 */
var getOptions = function () {
    var options = {
        isFirstLoad: true,
        theme: 'light'
    };
    if (localStorageAvailable()) {
        var savedOptions = localStorage.getItem('options');
        if (savedOptions) {
            options = JSON.parse(savedOptions);
            options.isFirstLoad = false;
        }
        if (typeof stardust.appDefaultOptions !== 'undefined') {
            options = __assign(__assign({}, stardust.appDefaultOptions), options);
        }
        return options;
    }
    else {
        console.warn('Local storage is not available, returning default options.');
        return options;
    }
};
/**
 * Saves the options object to local storage.
 */
var saveOptions = function () {
    if (localStorageAvailable()) {
        localStorage.setItem('options', JSON.stringify(stardust.options));
    }
};
/**
 * Resets the app settings to default by removing the options object from local
 * storage and forcing generation of a new one.
 * @param {boolean=} reload Whether or not to reload the page after resetting
 *     the options object.
 */
var resetOptions = function (reload) {
    if (reload === void 0) { reload = true; }
    if (localStorageAvailable()) {
        localStorage.removeItem('options');
    }
    stardust.options = getOptions();
    if (reload) {
        document.location.reload();
    }
};
/**
 * Binds options on the page (using the 'bind-option' attribute) to the
 * corresponding options in the options object, sets up option click and change
 * events, and sets the state of the options on the page. An example of how to
 * use this would be to add an option 'foo' in your app when you initialize
 * Stardust:
 *
 *     initStardust({...},
 *       options: {
 *         foo: false,
 *       },
 *     });
 *
 * Then use the 'bind-option' tag on an HTML input on the page:
 *
 *     <input type="checkbox" bind-option="foo" ... />
 *
 * Only one option can be bound to a single HTML element this way. Actions and
 * options can be bound to the same HTML elements.
 *
 * The bindOption function will be called when initStardust() is run, so if your
 * options are hard-coded in index.html or before initializing Stardust you
 * shouldn't need to do anything else. However, if you add options after page
 * load or after running initStardust() you will need to call:
 *
 *     bindOption();
 *
 * @param {boolean=} stringToBoolean Whether or not to convert strings 'true'
 *     and 'false' to boolean values when changed. Default is true.
 */
var bindOptions = function (stringToBoolean) {
    if (stringToBoolean === void 0) { stringToBoolean = true; }
    if (typeof stardust === 'undefined') {
        throw 'stardust is not defined';
    }
    var optionItems = document.querySelectorAll('[bind-option]');
    var _loop_1 = function (i) {
        var optionItem = optionItems[i];
        var optionItemTag = optionItem.tagName.toLowerCase();
        var isCheckbox = optionItem.getAttribute('type') === 'checkbox';
        var isSelect = optionItemTag === 'select';
        var isInput = optionItemTag === 'input';
        var isRadio = optionItemTag === 'radio';
        var boundOption = optionItem.getAttribute('bind-option') || '';
        if (!optionItem.getAttribute('options-bound')) {
            if (optionItemTag !== 'div' && optionItemTag !== 'span') {
                optionItem.addEventListener('change', function (e) {
                    if (typeof stardust === 'undefined') {
                        throw 'stardust is not defined';
                    }
                    if (e.target) {
                        if (isCheckbox) {
                            stardust.options[boundOption] = e.target
                                .checked
                                ? true
                                : false;
                        }
                        else if (isSelect) {
                            var target = e.target;
                            if (target.value === 'true' && stringToBoolean) {
                                stardust.options[boundOption] = true;
                            }
                            else if (target.value === 'false' && stringToBoolean) {
                                stardust.options[boundOption] = false;
                            }
                            else {
                                stardust.options[boundOption] = target.value;
                            }
                        }
                        else if (isInput) {
                            var target = e.target;
                            stardust.options[boundOption] = target.value;
                        }
                    }
                    saveOptions();
                });
            }
            else {
                optionItem.addEventListener('click', function (e) {
                    if (e.target === optionItem) {
                        var innerItem = optionItem.querySelector('[bind-option]');
                        if (innerItem) {
                            var innerItemTagName = innerItem.tagName.toLowerCase();
                            if (innerItem.getAttribute('type') === 'checkbox') {
                                innerItem.click();
                            }
                        }
                    }
                });
                optionItem.setAttribute('options-bound', 'true');
            }
        }
        var value = stardust.options[boundOption];
        if (isSelect) {
            var item = optionItem;
            item.value = value;
            item.setAttribute('options-bound', 'true');
        }
        else if (isCheckbox) {
            var item = optionItem;
            if (value === true || value === 'true') {
                item.checked = true;
            }
            else {
                item.checked = false;
            }
            item.setAttribute('options-bound', 'true');
        }
    };
    for (var i = 0; i < optionItems.length; i++) {
        _loop_1(i);
    }
};
/**
 * Binds action handlers to elements in the DOM (using the 'bind-action'
 * attribute) To use this, add an action handler when you initialize Stardust:
 *
 *     initStardust({
 *       actions: {
 *         doFoo: (e: Event) => {
 *           foo(e);
 *         },
 *         ...
 *       },
 *       options: {...},
 *     });
 *
 * Then use the 'bind-action' tag on an HTML element on the page:
 *
 *     <div type="checkbox" bind-action="click:doFoo" ... />
 *
 * Actions are bound using "event:action" in the "bind-action" attribute. For
 * example, to bind the "click" event to the "doFoo" action, you would use
 * "click:doFoo". To also bind the "hover" event to the "hoverFoo" action, you
 * would use a semi-colon to divide the two:
 *
 *     <div type="checkbox" bind-action="click:doFoo;mouseover:hoverFoo" ... />
 *
 * An unlimited number of events and actions can be bound to a single HTML
 * element this way. Actions and options can be bound to the same HTML elements.
 *
 * The bindActions function will be called when initStardust() is run, so if
 * your elements are hard-coded in index.html or before initializing Stardust
 * you shouldn't need to do anything else. However, if you add options after
 * page load or after running initStardust() you will need to call:
 *
 *     bindActions();
 */
var bindActions = function () {
    var itemsWithActions = document.querySelectorAll('[bind-action]');
    for (var i = 0; i < itemsWithActions.length; i++) {
        var boundElement = itemsWithActions[i];
        var actionItems = boundElement.getAttribute('bind-action');
        if (actionItems && !boundElement.getAttribute('actions-bound')) {
            var actions = actionItems.split(';');
            for (var i_1 = 0; i_1 < actions.length; i_1++) {
                var action = actions[i_1].split(':');
                if (typeof stardust.actions[action[1]] !== 'undefined') {
                    boundElement.addEventListener(action[0], stardust.actions[action[1]]);
                }
            }
            boundElement.setAttribute('actions-bound', 'true');
        }
    }
};
/** side menu **/
/**
 * Hides the side menu if something other than the side menu or its children
 * were clicked.
 * @param {object} e A click event.
 */
var hideSideMenu = function (e) {
    if (e.target) {
        var target = e.target;
        if (target.id !== 'side-menu-button-svg' &&
            target.tagName !== 'path' &&
            stardust.sideMenuIsVisible) {
            while (target && target !== document.body) {
                if (target.id === 'side-menu-wrap') {
                    return;
                }
                target = target.parentElement || document.body;
            }
            toggleSideMenu(true);
        }
    }
};
/**
 * Shows the side menu if it is hidden, and hides it if it is shown, or if hide
 * is true. If true is passed, the menu will be hidden regardless of its state.
 * @param {boolean} hide Whether or not to override the toggling behavior.
 */
var toggleSideMenu = function (hide) {
    if (hide === void 0) { hide = false; }
    var sideMenu = document.getElementById('side-menu-wrap');
    var headerBack = document.getElementById('header-back-wrap');
    var headerTitle = document.getElementById('header-title');
    if (sideMenu && headerBack && headerTitle) {
        var state = sideMenu.style.marginRight;
        headerTitle.classList.add('resizing');
        self.setTimeout(function () {
            headerTitle.classList.remove('resizing');
        }, 100);
        sideMenu.style.right = '0';
        if ((state && (state === '0' || state === '0px')) || hide) {
            sideMenu.style.marginRight = '-450px';
            stardust.sideMenuIsVisible = false;
            headerBack.style.marginLeft = '-40px';
            headerTitle.style.width = 'calc(100vw - 40px)';
            headerTitle.classList.remove('navigable');
        }
        else {
            sideMenu.style.marginRight = '0';
            stardust.sideMenuIsVisible = true;
            if (window.innerWidth < 550) {
                headerBack.style.marginLeft = '0';
                headerTitle.style.width = 'calc(100vw - 80px)';
                headerTitle.classList.add('navigable');
            }
        }
    }
};
/** security and crypto **/
/**
 * Returns a copy of a string with HTML characters encoded as entities.
 * @param {string} string An unsafe string.
 * @return {string} A safe string.
 */
var sanitizeString = function (string) {
    return string
        .replace(/<br ?\/?>/g, '\n')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};
/**
 * The equivalent of Math.random() but utilizing the browser's built-in
 * cryptographic libraries.
 * @return {float} A cryptographically-secure random floating point number
 *     between 0 and 1.
 */
var secureMathRandom = function () {
    return window.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967295;
};
/**
 * Returns a cryptographically-secure random string of alphanumeric characters
 * numberOfCharacters long. Special characters can be included by passing true
 * for useSpecialCharacters.
 * @param {number=} numberOfCharacters The length of the string that should be
 *     returned. Default: 32
 * @param {boolean=} useSpecialCharacters Whether or not to include special
 *     characters such as # and ( in the returned string. Default: false
 * @return {string} A cryptographically-secure random string of alphanumeric
 *     characters numberOfCharacters long.
 */
var secureRandomString = function (numberOfCharacters, useSpecialCharacters) {
    if (numberOfCharacters === void 0) { numberOfCharacters = 32; }
    if (useSpecialCharacters === void 0) { useSpecialCharacters = false; }
    var result = '';
    var validChars = [
        '0123456789',
        'abcdefghijklmnopqrstuvwxyz',
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    ].join('');
    if (useSpecialCharacters) {
        validChars += '`~!@#$%^&*()_+-=[]{}\\|;:\'",<.>/?';
    }
    while (result.length < numberOfCharacters) {
        result += validChars[Math.floor(secureMathRandom() * validChars.length)];
    }
    return result;
};
/** themes **/
/**
 * Loads the Stardust and app theme CSS files based on the provided theme name,
 * saves the applied theme name to options.theme, and saves the theme's primary
 * color to the localStorage key 'stardust-primary-color'.
 * @param {string=} themeName The name of the theme to apply. Will default to
 *     options.theme. If provided or defaulted theme is not valid, 'light' will
 *     be used instead.
 */
var applyStardustTheme = function (themeName) {
    var _a;
    if (themeName === void 0) { themeName = (_a = stardust === null || stardust === void 0 ? void 0 : stardust.options) === null || _a === void 0 ? void 0 : _a.theme; }
    if (!themeName || stardust.themes.indexOf(themeName) < 0) {
        themeName = 'light';
    }
    stardust.selectedTheme = themeName;
    var themeCssFiles = [
        "lib/stardust/css/stardust-theme-".concat(themeName, ".css"),
        "css/app-theme-".concat(themeName, ".css"),
    ];
    for (var i = 0; i < themeCssFiles.length; i++) {
        var style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('class', 'stardust-theme-style');
        style.setAttribute('href', themeCssFiles[i]);
        document.head.appendChild(style);
    }
    self.setTimeout(function () {
        var styles = document.querySelectorAll('.stardust-theme-style.applied');
        for (var i = 0; i < styles.length; i++) {
            document.head.removeChild(styles[i]);
        }
        styles = document.querySelectorAll('.stardust-theme-style');
        for (var i = 0; i < styles.length; i++) {
            styles[i].classList.add('applied');
        }
    }, 100);
    self.setTimeout(function () {
        if (localStorageAvailable()) {
            localStorage.setItem('stardust-primary-color', getThemePrimaryColor());
        }
    }, 100);
};
/**
 * Gets the primary app color based on the selected theme.
 * @return {string} Hex, RGB, or other color value representing the primary app
 *     color for the active theme.
 */
var getThemePrimaryColor = function () {
    var element = document.createElement('div');
    element.classList.add('stardust-primary-color');
    document.body.appendChild(element);
    var primaryColor = getComputedStyle(element).color;
    document.body.removeChild(element);
    return primaryColor;
};
/** splash screen **/
/**
 * Hides and then removes the splash screen if present.
 */
var hideSplash = function () {
    var splash = document.getElementById('splash-wrap');
    if (splash) {
        splash.style.opacity = '0';
        self.setTimeout(function () {
            splash.parentElement.removeChild(splash);
        }, 200);
    }
};
/** modals **/
// TODO implement button support for addModal. It should take in a button
// argument which is an object describing buttons to add, such as text, class,
// and click actions.
/**
 * Adds a modal popup to the DOM. The modal will be hidden by default. Once it
 * has been created using addModal (or the resulting HTML has been hard-coded
 * into the page) it can be shown by calling showModal(modalName).
 * @param {string} modalName The internal name of the modal. This will be used
 *     as an ID.
 * @param {string} modalContent HTML to be added to the body of the modal popup.
 * @param {string=} modalTitle Title of the modal popup.
 */
var addModal = function (modalName, modalContent, modalTitle) {
    if (modalTitle === void 0) { modalTitle = ''; }
    var modalHTML = "\n    <div id=\"".concat(modalName, "-wrap\" class=\"modal-wrap\" style=\"display: none;\" onclick=\"hideModalByEvent(event)\">\n      <div id=\"").concat(modalName, "\" class=\"modal\">\n        <div class=\"modal-title-wrap\">\n          <div class=\"modal-title\">").concat(modalTitle, "</div>\n          <div class=\"modal-close-button\" onclick=\"hideModalByEvent(event)\">+</div>\n        </div>\n        <div class=\"modal-content-wrap\">\n          <div class=\"modal-content\">").concat(modalContent, "</div>\n        </div>\n        <div id=\"").concat(modalName, "-modal-button-wrap\" class=\"modal-button-wrap\">\n          <button onclick=\"hideModal('").concat(modalName, "')\">OK</button>\n        </div>\n      </div>\n    </div>\n  ");
    var modalOpener = document.createElement('div');
    modalOpener.innerHTML = modalHTML;
    document.body.appendChild(modalOpener.children[0]);
};
/**
 * Shows the modal popup with name modalName, if present. The name should be the
 * same name used when creating the modal popup, or if the popup is hard-coded
 * in HTML, it should be the ID in the <div id="*" class="modal"> tag.
 * @param {string} modalName The name of the modal popup to show.
 */
var showModal = function (modalName) {
    var modal = document.querySelector("#".concat(modalName, "-wrap"));
    if (modal) {
        modal.style.display = 'block';
    }
};
/**
 * Hides the modal popup with name modalName, if present. The name should be the
 * same name used when creating the modal popup, or if the popup is hard-coded
 * in HTML, it should be the ID in the <div id="*" class="modal"> tag.
 * @param {string} modalName The name of the modal popup hide.
 */
var hideModal = function (modalName) {
    var modal = document.querySelector("#".concat(modalName, "-wrap"));
    if (modal) {
        modal.style.display = 'none';
    }
};
/**
 * Closes the modal popup if passed an event whose target is '.modal-wrap' or
 * '.modal-close-button', meaning the close button or the modal pupup background
 * was clicked.
 * @param {object} e The click event of the user.
 */
var hideModalByEvent = function (e) {
    if (e.target) {
        var target = e.target;
        var classList = target.classList;
        if (classList &&
            (classList.contains('modal-wrap') ||
                classList.contains('modal-close-button'))) {
            var modals = document.getElementsByClassName('modal-wrap');
            for (var i = 0; i < modals.length; i++) {
                var modal = modals[i];
                modal.style.display = 'none';
            }
        }
    }
};
/** misc helper functions **/
/**
 * Returns the value of a given URL parameter. If not present or the parameter
 * is not set to a value, an empty string will be returned.
 * @param {string} name The name of the parameter whose value to return.
 * @return {string} The value associated with that parameter.
 */
var getUrlParameter = function (name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null
        ? ''
        : decodeURIComponent(results[1].replace(/\+/g, ' '));
};
/**
 * Detects if localStorage access is available.
 * @return boolean Whether localStorage is available.
 */
var localStorageAvailable = function () {
    var storage;
    try {
        storage = window.localStorage;
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch (e) {
        return false;
    }
};
var headerTitleClick = function (e) {
    console.log('click');
    debugger;
    e.preventDefault();
    if (stardust && !stardust.sideMenuIsVisible) {
        loadRoute('default');
    }
    return false;
};
/** routes **/
var getRequestedRoute = function () {
    var url = new URL(document.location.href);
    return url.searchParams.get('page') || '';
};
/**
 * Loads a route by fetching the page content using fetch() and inserting it as
 * HTML into the DOM. If the route is not defined, the 'missing' route will be
 * loaded. If the 'missing' route is not defined, the 'default' route will be
 * loaded.
 * @param {string} routeName The name of the route to load.
 * @param {HTMLElement=} domNode The DOM Note into which the fetched HTML
 *    content should be inserted. If not provided, an element with the ID
 *    'content-inner-wrap' will be used.
 */
var loadRoute = function (routeName, domNode) {
    if (typeof stardust === 'undefined') {
        throw 'stardust is not defined';
    }
    if (typeof routeName === 'undefined' || routeName === '') {
        routeName = 'default';
    }
    else {
        var routeNames = Object.keys(stardust.routes);
        if (routeNames.indexOf(routeName) < 0) {
            if (routeNames.indexOf('missing') > -1) {
                routeName = 'missing';
            }
            else {
                routeName = 'default';
            }
        }
    }
    var defaultDomNode = 'content-inner-wrap';
    if (typeof domNode === 'undefined') {
        domNode = document.getElementById(defaultDomNode);
    }
    if (!domNode) {
        throw "could not find provided domNode or #".concat(defaultDomNode);
    }
    var route = stardust.routes[routeName];
    fetch(route.url).then(function (response) {
        if (response.status === 200) {
            response.text().then(function (text) {
                if (domNode) {
                    domNode.innerHTML = text;
                }
            });
        }
        else {
            var status_1 = sanitizeString(response.status + '');
            var text = "\n        <div class=\"card card-1\">\n          <div class=\"card-title\">Error: ".concat(status_1, "</div>\n          <div>The requested page exists, but there was an error when fetching it from the origin server.</div>\n          <br>\n          <div>Route URL: ").concat(sanitizeString(route.url), "</div>\n        </div>\n      ");
            if (domNode) {
                domNode.innerHTML = text;
            }
        }
    });
};
/** init **/
/**
 * Bootstraps the Stardust application.
 */
var initStardust = function (initOptions) {
    // Register a service worker to enable app installation as a PWA.
    if (typeof initOptions.enableServiceWorker === 'undefined' ||
        initOptions.enableServiceWorker) {
        navigator.serviceWorker.register('sw.js');
    }
    stardust = {
        routes: {
            "default": {
                url: 'pages/default.html'
            }
        },
        options: {},
        actions: {
            reset: function () {
                resetOptions();
            },
            applyTheme: function () {
                applyStardustTheme();
            },
            reload: function () {
                document.location.reload();
            }
        },
        themes: ['dark', 'light'],
        selectedTheme: 'light',
        sideMenuIsVisible: false
    };
    // Merge Stardust built-in routes, actions, themes, and options with any
    // app-provided ones.
    if (initOptions) {
        if (initOptions.routes) {
            stardust.routes = __assign(__assign({}, stardust.routes), initOptions.routes);
        }
        if (initOptions.actions) {
            stardust.actions = __assign(__assign({}, stardust.actions), initOptions.actions);
        }
        if (initOptions.themes) {
            stardust.themes = __assign(__assign({}, stardust.themes), initOptions.themes);
        }
        if (initOptions.options) {
            stardust.appDefaultOptions = initOptions.options;
        }
    }
    // Load options and themes.
    stardust.options = getOptions();
    applyStardustTheme(stardust.options.theme);
    // Initialize side menu.
    var sideMenuButton = document.getElementById('side-menu-button-wrap');
    if (sideMenuButton) {
        sideMenuButton.addEventListener('click', function () {
            toggleSideMenu();
        });
        window.addEventListener('click', function (e) {
            hideSideMenu(e);
        });
    }
    // Set bumpers to update every 100ms for two seconds after load to ensure
    // they accommodate content that may be added to the DOM after load, and then
    // set bumpers to update whenever the window is resized.
    // TODO: Look into doing this with a ResizeObserver, but there is no IE 11
    // support. Maybe a MutationObserver instead?
    updateBumpers();
    var bumperPageLoadTimer = self.setInterval(function () {
        updateBumpers();
    }, 100);
    self.setTimeout(function () {
        self.clearInterval(bumperPageLoadTimer);
    }, 2000);
    window.addEventListener('resize', function () {
        updateBumpers();
    });
    // Load requested route.
    loadRoute(getRequestedRoute());
    bindOptions();
    bindActions();
    saveOptions();
    rebindSelectObjects();
    self.setTimeout(function () {
        hideSplash();
    }, 200);
};
var stardust;
//# sourceMappingURL=stardust.js.map