/**
 * File: stardust.js
 * Project: Stardust
 * Author: Jonathan Gregson <jonathan@jdgregson.com>
 */
/** interfaces **/
interface StardustRoute {
    url: string;
}
interface StardustRouteCollection {
    default: StardustRoute;
    [key: string]: StardustRoute;
}
interface StardustOptions {
    isFirstLoad: boolean;
    theme: string;
    [key: string]: any;
}
interface AppOptions {
    [key: string]: any;
}
interface Stardust {
    routes: StardustRouteCollection;
    options: StardustOptions;
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
declare const showToast: (message: string, timeout?: number, enableHTML?: boolean) => void;
/** tip orb */
/**
 * Creates an animated tooltip orb at x, y, which will spread out from x, y
 * until it disappears, and will then be removed from the DOM.
 * @param {number} x The X coordinate that the orb should originate from.
 * @param {number} y The Y coordinate that the orb should originate from.
 */
declare const showTipOrb: (x: string | number, y: string | number) => void;
/** loading bar **/
/**
 * Resets the loading bar so that it is ready to be shown again.
 */
declare const resetLoadingBar: () => void;
/**
 * Updates the loading bar to indicate that it is N percent complete.
 * @param {number} percent Integer representing the percentage to set the
 *     loading bar to.
 */
declare const updateLoadingBar: (percent: number) => void;
/**
 * Updates the height of all bumper divs. Bumpers (a div with class .bumper) are
 * meant to push content down the page when the div above them is absolutely
 * positioned.
 */
declare const updateBumpers: () => void;
/** DOM overrides **/
/**
 * Wraps select elements with the '.select-wrap' div so we can customize them
 * easier.
 */
declare const rebindSelectObjects: () => void;
/** options and actions **/
/**
 * Returns the options object form local storage if set, or a default object if
 * not set.
 * @return {object} The options object.
 */
declare const getOptions: () => StardustOptions;
/**
 * Saves the options object to local storage.
 */
declare const saveOptions: () => void;
/**
 * Resets the app settings to default by removing the options object from local
 * storage and forcing generation of a new one.
 * @param {boolean=} reload Whether or not to reload the page after resetting
 *     the options object.
 */
declare const resetOptions: (reload?: boolean) => void;
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
declare const bindOptions: (stringToBoolean?: boolean) => void;
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
declare const bindActions: () => void;
/** side menu **/
/**
 * Hides the side menu if something other than the side menu or its children
 * were clicked.
 * @param {object} e A click event.
 */
declare const hideSideMenu: (e: Event) => void;
/**
 * Shows the side menu if it is hidden, and hides it if it is shown, or if hide
 * is true. If true is passed, the menu will be hidden regardless of its state.
 * @param {boolean} hide Whether or not to override the toggling behavior.
 */
declare const toggleSideMenu: (hide?: boolean) => void;
/** security and crypto **/
/**
 * Returns a copy of a string with HTML characters encoded as entities.
 * @param {string} string An unsafe string.
 * @return {string} A safe string.
 */
declare const sanitizeString: (string: string) => string;
/**
 * The equivalent of Math.random() but utilizing the browser's built-in
 * cryptographic libraries.
 * @return {float} A cryptographically-secure random floating point number
 *     between 0 and 1.
 */
declare const secureMathRandom: () => number;
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
declare const secureRandomString: (numberOfCharacters?: number, useSpecialCharacters?: boolean) => string;
/** themes **/
/**
 * Loads the Stardust and app theme CSS files based on the provided theme name,
 * saves the applied theme name to options.theme, and saves the theme's primary
 * color to the localStorage key 'stardust-primary-color'.
 * @param {string=} themeName The name of the theme to apply. Will default to
 *     options.theme. If provided or defaulted theme is not valid, 'light' will
 *     be used instead.
 */
declare const applyStardustTheme: (themeName?: string) => void;
/**
 * Gets the primary app color based on the selected theme.
 * @return {string} Hex, RGB, or other color value representing the primary app
 *     color for the active theme.
 */
declare const getThemePrimaryColor: () => string;
/** splash screen **/
/**
 * Hides and then removes the splash screen if present.
 */
declare const hideSplash: () => void;
/** modals **/
/**
 * Adds a modal popup to the DOM. The modal will be hidden by default. Once it
 * has been created using addModal (or the resulting HTML has been hard-coded
 * into the page) it can be shown by calling showModal(modalName).
 * @param {string} modalName The internal name of the modal. This will be used
 *     as an ID.
 * @param {string} modalContent HTML to be added to the body of the modal popup.
 * @param {string=} modalTitle Title of the modal popup.
 */
declare const addModal: (modalName: string, modalContent: string, modalTitle?: string) => void;
/**
 * Shows the modal popup with name modalName, if present. The name should be the
 * same name used when creating the modal popup, or if the popup is hard-coded
 * in HTML, it should be the ID in the <div id="*" class="modal"> tag.
 * @param {string} modalName The name of the modal popup to show.
 */
declare const showModal: (modalName: string) => void;
/**
 * Hides the modal popup with name modalName, if present. The name should be the
 * same name used when creating the modal popup, or if the popup is hard-coded
 * in HTML, it should be the ID in the <div id="*" class="modal"> tag.
 * @param {string} modalName The name of the modal popup hide.
 */
declare const hideModal: (modalName: string) => void;
/**
 * Closes the modal popup if passed an event whose target is '.modal-wrap' or
 * '.modal-close-button', meaning the close button or the modal pupup background
 * was clicked.
 * @param {object} e The click event of the user.
 */
declare const hideModalByEvent: (e: Event) => void;
/** misc helper functions **/
/**
 * Returns the value of a given URL parameter. If not present or the parameter
 * is not set to a value, an empty string will be returned.
 * @param {string} name The name of the parameter whose value to return.
 * @return {string} The value associated with that parameter.
 */
declare const getUrlParameter: (name: string) => string;
/**
 * Detects if localStorage access is available.
 * @return boolean Whether localStorage is available.
 */
declare const localStorageAvailable: () => boolean;
declare const headerTitleClick: (e: Event) => boolean;
/** routes **/
declare const getRequestedRoute: () => string;
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
declare const loadRoute: (routeName?: string, domNode?: HTMLElement | null) => void;
/** init **/
/**
 * Bootstraps the Stardust application.
 */
declare const initStardust: (initOptions: AppOptions) => void;
declare let stardust: Stardust;
