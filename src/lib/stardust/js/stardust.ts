/**
 * File: stardust.js
 * Project: Stardust
 * Author: Jonathan Gregson <jonathan@jdgregson.com>
 */

/** interfaces **/

interface StardustOptions {
  isFirstLoad: boolean;
  theme: string;
  [key: string]: any;
}

interface Stardust {
  options?: any;
  appDefaultOptions?: any;
  actions: any;
  themes: Array<string>;
  selectedTheme: string;
  sideMenuIsVisible: boolean;
}

/** toast **/

/**
 * Show a toast, or a short message, on the user interface.
 * @param {string} message The message to show on the UI.
 * @param {number=} timeout The number of milliseconds to show the toast.
 * @param {boolean=} enableHTML Whether or not to permit HTML in the output.
 *     Default: false.
 */
const showToast = (message: string, timeout = 3000, enableHTML = false) => {
  const toast = document.createElement('div');
  const toastWrap = document.createElement('div');
  toast.setAttribute('class', 'toast');
  toastWrap.setAttribute('class', 'toast-wrap');
  if (enableHTML) {
    toast.innerHTML = message;
  } else {
    toast.innerText = message;
  }
  toastWrap.appendChild(toast);
  document.body.appendChild(toastWrap);

  self.setTimeout(() => {
    toastWrap.style.opacity = '1';
  }, 50);

  self.setTimeout(() => {
    toastWrap.style.opacity = '0';
  }, timeout + 500);

  self.setTimeout(() => {
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
const showTipOrb = (x: string | number, y: string | number) => {
  const orb = document.createElement('div');
  orb.classList.add('tooltip-orb');
  orb.style.top = `${y}px`;
  orb.style.left = `${x}px`;
  document.body.appendChild(orb);

  self.setTimeout(() => {
    orb.style.transform = 'scale(50)';
  }, 10);

  self.setTimeout(() => {
    orb.style.opacity = '0';
  }, 10);

  self.setTimeout(() => {
    document.body.removeChild(orb);
  }, 1000);
};

/** loading bar **/

/**
 * Resets the loading bar so that it is ready to be shown again.
 */
const resetLoadingBar = () => {
  const loadingBar = document.getElementById('loading-bar') as HTMLDivElement;
  if (loadingBar) {
    loadingBar.style.display = 'none';
    loadingBar.style.left = '-100%';
    self.setTimeout(() => {
      loadingBar.style.display = 'block';
    }, 100);
  }
};

/**
 * Updates the loading bar to indicate that it is N percent complete.
 * @param {number} percent Integer representing the percentage to set the
 *     loading bar to.
 */
const updateLoadingBar = (percent: number) => {
  const loadingBar = document.getElementById('loading-bar') as HTMLDivElement;
  if (loadingBar) {
    if (percent > 100) {
      throw 'Cannot exceed 100%';
    } else if (percent === 100) {
      loadingBar.style.left = '0';
      self.setTimeout(() => {
        loadingBar.style.left = '100%';
      }, 100);
      self.setTimeout(() => {
        resetLoadingBar();
      }, 200);
    } else {
      loadingBar.style.left = `-${100 - percent}%`;
    }
  }
};

/** DOM overrides **/

/**
 * Wraps select elements with the '.select-wrap' div so we can customize them
 * easier.
 */
const rebindSelectObjects = () => {
  let changesMade = false;
  const selects = document.querySelectorAll('select:not(.rebound)');
  for (let i = 0; i < selects.length; i++) {
    const select = selects[i];
    const wrap = document.createElement('div');
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
const getOptions = () => {
  let options = {
    isFirstLoad: true,
    theme: 'light',
  } as StardustOptions;
  if (typeof localStorage !== 'undefined') {
    let savedOptions = localStorage.getItem('options');
    if (savedOptions) {
      options = <StardustOptions>JSON.parse(savedOptions);
      options.isFirstLoad = false;
    }
    if (typeof stardust.appDefaultOptions !== 'undefined') {
      options = {...stardust.appDefaultOptions, ...options};
    }
    return options;
  } else {
    console.warn('Local storage is not available, returning default options.');
    return options;
  }
};

/**
 * Saves the options object to local storage.
 */
const saveOptions = () => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('options', JSON.stringify(stardust.options));
  }
};

/**
 * Resets the app settings to default by removing the options object from local
 * storage and forcing generation of a new one.
 * @param {boolean=} reload Whether or not to reload the page after resetting
 *     the options object.
 */
const resetOptions = (reload = true) => {
  localStorage.removeItem('options');
  stardust.options = getOptions();
  if (reload) {
    document.location.reload();
  }
};

/**
 * Binds options on the page to the corresponding options in the options object,
 * sets up option change events, and sets the state of the options on the page.
 */
const bindOptions = (stringToBoolean = true) => {
  const optionItems = document.querySelectorAll('[bindOption]');
  for (let i = 0; i < optionItems.length; i++) {
    const optionItem = optionItems[i] as HTMLElement;
    const isCheckbox = optionItem.getAttribute('type') === 'checkbox';
    const isSelect = optionItem.tagName.toLowerCase() === 'select';
    const isInput = optionItem.tagName.toLowerCase() === 'input';
    const isRadio = optionItem.tagName.toLowerCase() === 'radio';
    const boundOption = optionItem.getAttribute('bindOption') || '';
    optionItem.addEventListener('change', (e: Event) => {
      if (e.target) {
        if (isCheckbox) {
          stardust.options[boundOption] = (e.target as HTMLInputElement).checked ? true : false;
        } else if (isSelect) {
          const target = e.target as HTMLSelectElement;
          if (target.value === 'true' && stringToBoolean) {
            stardust.options[boundOption] = true;
          } else if (target.value === 'false' && stringToBoolean) {
            stardust.options[boundOption] = false;
          } else {
            stardust.options[boundOption] = target.value;
          }
        } else if (isInput) {
          const target = e.target as HTMLInputElement;
          stardust.options[boundOption] = target.value;
        }
      }
      saveOptions();
    });

    const value = stardust.options[boundOption];
    if (isSelect) {
      (optionItem as HTMLSelectElement).value = value;
    } else if (isCheckbox) {
      if (value === true || value === 'true') {
        (optionItem as HTMLInputElement).checked = true;
      } else {
        (optionItem as HTMLInputElement).checked = false;
      }
    }
  }
};

const bindActions = () => {
  const itemsWithActions = document.querySelectorAll('[bindAction]');
  for (let i = 0; i < itemsWithActions.length; i++) {
    const boundElement = itemsWithActions[i];
    const actionItems = boundElement.getAttribute('bindAction');
    if (actionItems) {
      const actions = actionItems.split(';');
      for (let i = 0; i < actions.length; i++) {
        const action = actions[i].split(':');
        if (typeof stardust.actions[action[1]] !== 'undefined') {
          boundElement.addEventListener(
            action[0],
            stardust.actions[action[1]]
          );
        }
      }
    }
  }
};

/** side menu **/

/**
 * Hides the side menu if something other than the side menu or its children
 * were clicked.
 * @param {object} e A click event.
 */
const hideSideMenu = (e: Event) => {
  if (e.target) {
    let target = e.target as HTMLElement;
    if (
      target.id !== 'side-menu-button-svg' &&
      target.id !== 'side-menu-button-svg' &&
      target.tagName !== 'path' &&
      stardust.sideMenuIsVisible
    ) {
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
const toggleSideMenu = (hide = false) => {
  const sideMenu = document.getElementById('side-menu-wrap') as HTMLDivElement;
  const headerBack = document.getElementById('header-back-wrap') as HTMLDivElement;
  const headerTitle = document.getElementById('header-title') as HTMLDivElement;
  if (sideMenu && headerBack && headerTitle) {
    const state = sideMenu.style.marginRight;
    headerTitle.classList.add('resizing');
    self.setTimeout(() => {
      headerTitle.classList.remove('resizing');
    }, 100);
    sideMenu.style.right = '0';
    if ((state && (state === '0' || state === '0px')) || hide) {
      sideMenu.style.marginRight = '-450px';
      stardust.sideMenuIsVisible = false;
      headerBack.style.marginLeft = '-40px';
      headerTitle.style.width = 'calc(100vw - 40px)';
      headerTitle.classList.remove('navigable');
    } else {
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
const sanitizeString = (string: string) => {
  const p = document.createElement('p');
  p.innerText = string;
  return p.innerHTML.replace(/<br ?\/?>/g, '\n');
};

/**
 * The equivalent of Math.random() but utilizing the browser's built in
 * cryptographic libraries.
 * @return {float} A cryptographically secure random floating point value
 *     between 0 and 1.
 */
const secureMathRandom = () => {
  return window.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967295;
};

/**
 * Returns a cryptographically secure random string of alphanumeric characters
 * numberOfCharacters long. Special characters can be included by passing true
 * for useSpecialCharacters.
 * @param {number} numberOfCharacters The length of the string that should be
 *     returned.
 * @param {boolean} useSpecialCharacters Whether or not to include special
 *     characters such as # and ( in the returned string.
 * @return {string} A cryptographically secure random string of alphanumeric
 *     characters numberOfCharacters long.
 */
const secureRandomString = (
  numberOfCharacters = 32,
  useSpecialCharacters = false
) => {
  let result = '';
  let validChars = [
    '0123456789',
    'abcdefghijklmnopqrstuvwxyz',
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  ].join('');
  validChars += useSpecialCharacters
    ? '`~!@#$%^&*()_+-=[]{}\\|;:\'",<.>/?'
    : '';
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
const applyStardustTheme = (themeName = stardust.options.theme) => {
  if (stardust.themes.indexOf(themeName) < 0) {
    themeName = 'light';
  }
  stardust.selectedTheme = themeName;
  const styles = document.querySelectorAll('.stardust-theme-style');
  for (let i = 0; i < styles.length; i++) {
    document.head.removeChild(styles[i]);
  }
  const themeCssFiles = [
    `lib/stardust/css/stardust-theme-${themeName}.css`,
    `css/app-theme-${themeName}.css`,
  ];
  for (let i = 0; i < themeCssFiles.length; i++) {
    const style = document.createElement('link');
    style.setAttribute('rel', 'stylesheet');
    style.setAttribute('class', 'stardust-theme-style');
    style.setAttribute('href', themeCssFiles[i]);
    document.head.appendChild(style);
  }
  self.setTimeout(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('stardust-primary-color', getThemePrimaryColor());
    }
  }, 100);
};

/**
 * Gets the primary app color based on the selected theme.
 * @return {string} Hex, RGB, or other color value representing the primary app
 *     color for the active theme.
 */
const getThemePrimaryColor = () => {
  const element = document.createElement('div');
  element.classList.add('stardust-primary-color');
  document.body.appendChild(element);
  const primaryColor = getComputedStyle(element).color;
  document.body.removeChild(element);
  return primaryColor;
};

/** splash screen **/

/**
 * Hides and then removes the splash screen if present.
 */
const hideSplash = () => {
  const splash = document.getElementById('splash-wrap') as HTMLDivElement;
  if (splash) {
    splash.style.opacity = '0';
    self.setTimeout(() => {
      document.body.removeChild(splash);
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
const addModal = (modalName: string, modalContent: string, modalTitle = '') => {
  const modalHTML = `
    <div id="${modalName}-wrap" class="modal-wrap" style="display: none;" onclick="hideModalByEvent(event)">
      <div id="${modalName}" class="modal">
        <div class="modal-title-wrap">
          <div class="modal-title">${modalTitle}</div>
          <div class="modal-close-button" onclick="hideModalByEvent(event)">+</div>
        </div>
        <div class="modal-content-wrap">
          <div class="modal-content">${modalContent}</div>
        </div>
        <div id="${modalName}-modal-button-wrap" class="modal-button-wrap">
          <button onclick="hideModal('${modalName}')">OK</button>
        </div>
      </div>
    </div>
  `;

  const modalOpener = document.createElement('div');
  modalOpener.innerHTML = modalHTML;
  document.body.appendChild(modalOpener.children[0]);
};

/**
 * Shows the modal popup with name modalName, if present. The name should be the
 * same name used when creating the modal popup, or if the popup is hard-coded
 * in HTML, it should be the ID in the <div id="*" class="modal"> tag.
 * @param {string} modalName The name of the modal popup to show.
 */
const showModal = (modalName: string) => {
  const modal = document.querySelector(`#${modalName}-wrap`) as HTMLDivElement;
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
const hideModal = (modalName: string) => {
  const modal = document.querySelector(`#${modalName}-wrap`) as HTMLDivElement;
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
const hideModalByEvent = (e: Event) => {
  if (e.target) {
    const target = e.target as HTMLElement;
    const classList = target.classList;
    if (
      classList &&
      (classList.contains('modal-wrap') ||
        classList.contains('modal-close-button'))
    ) {
      const modals = document.getElementsByClassName('modal-wrap');
      for (let i = 0; i < modals.length; i++) {
        const modal = modals[i] as HTMLDivElement;
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
const getUrlParameter = (name: string) => {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  const results = regex.exec(location.search);
  return results === null
    ? ''
    : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

/** init **/

/**
 * Bootstraps the Stardust application.
 */
const initStardust = (initOptions: any) => {
  stardust = {
    options: {},
    actions: {
      reset: () => {
        resetOptions();
      },
      applyTheme: () => {
        applyStardustTheme();
      },
      reload: () => {
        document.location.reload();
      },
    },
    themes: [
      'dark',
      'light'
    ],
    selectedTheme: 'light',
    sideMenuIsVisible: false
  };

  if (initOptions) {
    if (initOptions.actions) {
      stardust.actions = {...stardust.actions, ...initOptions.actions};
    }
    if (initOptions.themes) {
      stardust.themes = {...stardust.themes, ...initOptions.themes};
    }
    if (initOptions.options) {
      stardust.appDefaultOptions = initOptions.options;
    }
  }

  stardust.options = getOptions();
  applyStardustTheme(stardust.options.theme);

  const sideMenuButton = document.getElementById('side-menu-button-wrap') as HTMLDivElement;
  if (sideMenuButton) {
    sideMenuButton.addEventListener('click', () => {
      toggleSideMenu();
    });
    window.addEventListener('click', (e: Event) => {
      hideSideMenu(e);
    });
  }

  bindOptions();
  bindActions();
  saveOptions();
  rebindSelectObjects();
  self.setTimeout(() => {
    hideSplash();
  }, 1);
};

let stardust: Stardust;
