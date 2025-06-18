import React, { useRef, useEffect, useState, useCallback, ReactElement, isValidElement, useMemo } from "react";

function isValidCssColor(color: string): boolean {
  if (typeof window === 'undefined') return false; // or false, depending on your fallback
  const s = new Option().style;
  s.color = ""; // Reset in case it's inheriting anything
  s.color = color;
  return !!s.color };

interface LayeredTabsParams {
    fondoBarColor?: string;
    ptgnBarColor?: string;
    fondoColor?: string;
    slcPptgnColor?: string;
    tabBarPostn?: number;
    maxSize?: string;
    children?: React.ReactNode;
    tabWidth?: number;
    fixedMaxSize?: boolean;
    fullWindow?: boolean; };

export interface TabProps {
  title?: string;
  titleLang?: string;
  independentBgColor?: string;
  independentTxColor?: string;
  children?: string | React.ReactNode; };

const Tab: React.FC<TabProps> = ({ children } ) => React.createElement(React.Fragment, null, children);

Tab.displayName = "LayeredTabs.Tab";

type LayeredTabsComponent = React.FC<LayeredTabsParams> & { Tab: React.FC<TabProps>; };

  const LayeredTabs: LayeredTabsComponent = ({ fondoBarColor = "white", ptgnBarColor = "white", fondoColor = "white", slcPptgnColor = "white", tabBarPostn = 0, maxSize = "xl", children, tabWidth = 8, fixedMaxSize = false, fullWindow = false } ) => {

  const [tabBarPosition, setTabBarPosition] = useState(0);
  useEffect(() => {
    if ([0, 1, 2, 3].includes(tabBarPostn as number)) setTabBarPosition(tabBarPostn as number);
    else setTabBarPosition(0); }, [tabBarPostn]);

  const [maxResSize, setMaxResSize] = useState("xl");
  useEffect(() => {
    if (["xl", "lg", "md", "sm", "xs"].includes(maxSize as string)) setMaxResSize(maxSize as string);
    else setMaxResSize("xl"); }, [maxSize]);

  const allowedTabWidths = [5, 8, 11];
  function normalizeTabWidth(value: number): 5 | 8 | 11 {
    const closest = allowedTabWidths.reduce( (prev, curr) => Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev );
    return closest as 5 | 8 | 11; }
  const tabMinWidth = normalizeTabWidth(tabWidth);

  const tabElements = React.Children.toArray(children).filter( (child): child is ReactElement<TabProps> => isValidElement(child) && typeof child.type !== "string" && 'displayName' in child.type && (child.type as { displayName: string }).displayName === "LayeredTabs.Tab" );

  const tabsTitleList = tabElements.map(el => el.props.title);
  const tabsTitleLangList = tabElements.map(el => el.props.titleLang);
  const tabsColorsList = tabElements.map(el => el.props.independentBgColor && isValidCssColor(el.props.independentBgColor) ? el.props.independentBgColor : null );
  const tabsTextList = tabElements.map(el => el.props.independentTxColor && isValidCssColor(el.props.independentTxColor) ? el.props.independentTxColor : null );
  const tabsContentList = tabElements.map(el => el.props.children);


  const UsePantallaTamagnos = () => {
    const [screenSize, setScreenSize] = useState<number | null>(null);
    const [screenReady, setScreenReady] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const handleResize = () => setScreenSize(window.innerWidth);
        handleResize();
        window.addEventListener("resize", handleResize);
        setScreenReady(true);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return {
        screenReady,
        screenSize: screenSize ?? 1024,
        xlScreen: screenSize !== null && screenSize >= 1280,
        lgScreen: screenSize !== null && screenSize >= 1024,
        mdScreen: screenSize !== null && screenSize >= 768,
        smScreen: screenSize !== null && screenSize >= 640 } }

  const { screenReady, xlScreen, lgScreen, mdScreen, smScreen } = UsePantallaTamagnos();
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    if (!screenReady) return;
    if (!pageLoaded) return;
    const timeout = setTimeout(() => setPageLoaded(true), 500);
    return () => clearTimeout(timeout); }, [screenReady, pageLoaded]);

    const dinamicSize = useCallback((value: number) => {
      if (maxResSize === "xl" && fixedMaxSize === false) return xlScreen ? value * 1.4118 : lgScreen ? value * 1.2941 : mdScreen ? value * 1.1765 : smScreen ? value * 1.1176 : value;
      else if (maxResSize === "xl" && fixedMaxSize === true) return value * 1.4118;
      else if (maxResSize === "lg" && fixedMaxSize === false) return xlScreen || lgScreen ? value * 1.2941 : mdScreen ? value * 1.1765 : smScreen ? value * 1.1176 : value;
      else if (maxResSize === "lg" && fixedMaxSize === true) return value * 1.2941;
      else if (maxResSize === "md" && fixedMaxSize === false) return xlScreen || lgScreen || mdScreen ? value * 1.1765 : smScreen ? value * 1.1176 : value;
      else if (maxResSize === "md" && fixedMaxSize === true) return value * 1.1765;
      else if (maxResSize === "sm" && fixedMaxSize === false) return xlScreen || lgScreen || mdScreen || smScreen ? value * 1.1176 : value;
      else if (maxResSize === "sm" && fixedMaxSize === true) return value * 1.1176;
      else return value;
    }, [fixedMaxSize, maxResSize, xlScreen, lgScreen, mdScreen, smScreen])

  const shoulderHeight = dinamicSize(2.125);
  const shoulderWidth = shoulderHeight * 0.7104;

  const [currentTab, setCurrentTab] = useState(0);

  const zIndexMax = tabsTitleList.length + 10;
  const getZIndex = (index: number, currentTab: number, topZIndex: number) => topZIndex - Math.abs(index - currentTab); 

  const shortenTitle = (title: string | undefined, language: string, maxChars: number): string => {
    if (!title) return '';
    if (title.length <= maxChars) return title;

    const vowelMap: { [key: string]: string } = {
      en: 'aeiouy',
      es: 'aeiouáéíóúü',
      fr: 'aeiouyâêîôûéèëïüù',
      de: 'aeiouyäöü',
      it: 'aeiouàèéìòù',
      pt: 'aeiouáâãàéêíóôõúü',
      la: 'aeiouy',
      default: 'aeiou'
    };

    const vowels = vowelMap[language] || vowelMap.default;
    const regex = new RegExp(`[^${vowels}]*[${vowels}]+`, 'gi');
    const matches = title.matchAll(regex);

    let result = '';
    // let lastIndex = 0;

    for (const match of matches) {
      const end = (match.index || 0) + match[0].length;
      if (end > maxChars) break;
      result = title.slice(0, end);
      // lastIndex = end;
    }

    return result.length < title.length ? result.trim() + '…' : title; };

  const [currentMouseOverTag, setCurrentMouseOverTag] = useState<number | null>(null);

  const tabShoulder = "polygon(76.901% 0.074%,76.901% 0.074%,73.551% 0.145%,70.366% 0.248%,67.343% 0.384%,64.479% 0.552%,61.773% 0.754%,59.222% 0.988%,56.826% 1.256%,54.581% 1.558%,52.485% 1.892%,50.537% 2.261%,50.537% 2.261%,49.096% 2.58%,47.729% 2.926%,46.439% 3.299%,45.228% 3.697%,44.099% 4.12%,43.054% 4.567%,42.096% 5.037%,41.228% 5.529%,40.452% 6.041%,39.77% 6.575%,39.77% 6.575%,39.026% 7.256%,38.377% 7.967%,37.81% 8.743%,37.311% 9.614%,36.87% 10.613%,36.472% 11.774%,36.105% 13.127%,35.757% 14.707%,35.414% 16.545%,35.063% 18.674%,35.063% 18.674%,34.705% 21.056%,34.277% 24.081%,33.791% 27.641%,33.263% 31.624%,32.707% 35.922%,32.136% 40.424%,31.564% 45.02%,31.007% 49.601%,30.476% 54.057%,29.988% 58.277%,29.988% 58.277%,29.394% 63.447%,28.835% 68.215%,28.312% 72.575%,27.826% 76.521%,27.376% 80.046%,26.965% 83.145%,26.593% 85.812%,26.26% 88.039%,25.968% 89.821%,25.717% 91.151%,25.717% 91.151%,25.548% 91.908%,25.368% 92.586%,25.171% 93.193%,24.954% 93.738%,24.712% 94.229%,24.44% 94.674%,24.133% 95.083%,23.788% 95.463%,23.399% 95.823%,22.961% 96.171%,22.961% 96.171%,22.115% 96.722%,21.125% 97.226%,19.985% 97.683%,18.688% 98.095%,17.23% 98.463%,15.604% 98.789%,13.804% 99.073%,11.826% 99.317%,9.662% 99.523%,7.308% 99.69%,7.308% 99.69%,6.713% 99.725%,6.039% 99.759%,5.303% 99.792%,4.524% 99.824%,3.722% 99.854%,2.916% 99.882%,2.123% 99.906%,1.363% 99.926%,0.654% 99.942%,0.016% 99.953%,0.016% 99.953%,0.476% 99.957%,2.207% 99.961%,5.105% 99.965%,9.066% 99.969%,13.989% 99.972%,19.768% 99.976%,26.3% 99.979%,33.482% 99.982%,41.211% 99.984%,49.382% 99.987%,100.016% 100%,100.016% 50%,100.016% 0%,90.007% 0.013%,90.007% 0.013%,88.346% 0.016%,86.69% 0.02%,85.066% 0.024%,83.501% 0.03%,82.023% 0.036%,80.659% 0.043%,79.437% 0.05%,78.385% 0.058%,77.531% 0.066%,76.901% 0.074%)";

  const tabBgColor = useCallback( (index: number) => {
    return tabsColorsList[index] ? tabsColorsList[index] : currentTab === index ? isValidCssColor(slcPptgnColor) ? slcPptgnColor : 'white' : isValidCssColor(ptgnBarColor) ? ptgnBarColor : 'white'; },
    [ptgnBarColor, slcPptgnColor, currentTab, tabsColorsList] );

  const tabShoulderBlock = useCallback( (index: number, pos: number) => {
    const styleA = { display: 'inline-block', boxSizing: 'border-box', padding: '0', margin: '0', position: 'relative', height: `100%`, aspectRatio: '378 / 743', overflow: 'hidden', transform: tabBarPosition === 0 || tabBarPosition === 2 ? pos === 0 ? "scale(1,-1)" : "translateX(-0.1rem) scale(-1,-1)" : pos === 0 ? "none" : "translateX(-0.1rem) scaleX(-1)" };
    const styleB = { transition: 'width 150ms linear', display: 'inline-block', background: tabBgColor(index), padding: '0', margin: '0', position: 'relative', boxSizing: 'border-box', height: `100%`, aspectRatio: '1056 / 1486', clipPath: tabShoulder };
    return React.createElement('div', { style: styleA },
      React.createElement('div', { style: styleB } ) ) },
      [tabBgColor, tabBarPosition] );

  const tabWidths = useMemo( () => {
    const tMW = tabMinWidth;
    const base = tMW;
    const shortened = tMW * 1.375;
    const longShortened = tMW * 1.625;
    return { base, shortened, longShortened } }, [tabMinWidth]);

  const titlesLongs = useMemo(() => {
    const tMW = tabMinWidth;
    const shortened = Math.round(tMW * 1.375);
    const longShortened = Math.round(tMW * 2.5);
    return { shortened, longShortened } }, [tabMinWidth]);

  const shortenedTitles = useMemo(() =>
    tabsTitleList.map( (title, index) => {
    if (!title) {
      return {
        title: '',
        shortened: '',
        longShortened: '',
        isShortened: false,
        isLongShortened: false } }
    const shortened = shortenTitle(title as string, tabsTitleLangList[index] ? tabsTitleLangList[index] : 'en', titlesLongs.shortened);
    const longShortened = shortenTitle(title as string, tabsTitleLangList[index] ? tabsTitleLangList[index] : 'en', titlesLongs.longShortened);
    return {
      title,
      shortened,
      longShortened,
      isShortened: shortened !== title,
      isLongShortened: longShortened !== title && longShortened !== shortened } } ),
    [titlesLongs, tabsTitleList, tabsTitleLangList] );

    const tabsTransition = (transProp: string): React.CSSProperties => ({
      transitionProperty: transProp,
      transitionDuration: '130ms',
      transitionTimingFunction: 'linear' });

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => { return () => { if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current) } }, []);

  if (!screenReady) return null;

  return React.createElement('div', { style: { overflow: 'hidden', display: 'block', padding: '0', margin: '0', boxSizing: 'border-box', width: `100%`, height: `100%`, background: isValidCssColor(fondoColor) ? fondoColor : 'transparent', position: fullWindow ? 'fixed' : 'relative', left: fullWindow ? '0' : 'auto', top: fullWindow ? '0' : 'auto', zIndex: fullWindow ? '999' : 'auto' } },

          React.createElement('div', { style: { display: 'grid', gap: '0', gridTemplateColumns: '1fr', gridTemplateRows: tabBarPosition === 0  ? dinamicSize(2.125) + 'rem 1fr' : tabBarPosition === 1 ? dinamicSize(2.125 + 1.4164) + 'rem 1fr' : tabBarPosition === 2 ? '1fr ' + dinamicSize(2.125 + 1.4164) + 'rem' : '1fr ' + dinamicSize(2.125) + 'rem', padding: '0', margin: '0', position: 'relative', boxSizing: 'border-box', width: `100%`, height: `100%` } },

              // maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 9%, rgba(0,0,0,1) 91%, rgba(0,0,0,0) 100%)',
            ( tabBarPosition === 2 || tabBarPosition === 3 ) && React.createElement('section', { style: { height: '100%' /*dinamicSize(18) + 'rem' */, zIndex: 10, overflowY: 'scroll',  display: 'block', background: tabsColorsList[currentTab] ? tabsColorsList[currentTab] :  isValidCssColor(fondoColor) ? fondoColor : 'transparent', padding: '0', margin: '0', position: 'relative', boxSizing: 'border-box', width: `100%` } },
              typeof tabsContentList[currentTab] === 'string' ? React.createElement('p', { style: { transition: 'all 150ms linear', display: 'block', position: 'relative', boxSizing: 'border-box', hyphens: 'auto', textAlign: 'justify', textIndent: dinamicSize(1) + 'rem', fontSize: dinamicSize(1.125) + 'rem', fontWeight: 400, color: tabsTextList[currentTab] ?? 'black', lineHeight: 1.625, padding: dinamicSize(1.3)+ 'rem ' + dinamicSize(1.5) + 'rem', margin: '0' } }, tabsContentList[currentTab] ) : tabsContentList[currentTab] ?? null ),

            // Tabbar // maskImage: 'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 9%, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 91%, rgba(0,0,0,0) 100%)'  
            React.createElement('section', { style: { height: dinamicSize(2.125) + dinamicSize(1.4164) + 'rem', overflowY: 'hidden', display: 'block', padding: '0', position: 'relative', boxSizing: 'border-box', width: `100%`, margin: tabBarPosition === 0 ? '0 0 -' + dinamicSize(1.4164) + 'rem  0' : tabBarPosition === 3 ? '-' + dinamicSize(1.4164) + 'rem 0 0 0' : '0' } },

                React.createElement("div", { style: { zIndex: zIndexMax, display: 'block', position: "absolute", boxSizing: 'border-box', inset: "0", pointerEvents: 'none', backgroundImage: tabBarPosition === 0 || tabBarPosition === 2 ? "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.005) 5%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.01) 21%, rgba(0,0,0,0) 100%)" : "linear-gradient(to top, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.005) 5%, rgba(0,0,0,0) 100%), linear-gradient(to top, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.01) 21%, rgba(0,0,0,0) 100%)" } } ),

                React.createElement("div", { style: { transition: 'all 150ms linear', display: 'block', margin: `0`, boxSizing: 'border-box', position: 'relative', width: 'auto', height: '100%', whiteSpace: 'nowrap', overflowX: 'scroll', overflowY: 'hidden', scrollbarWidth: 'none', padding: tabBarPosition === 0 || tabBarPosition === 2 ? `0 ${dinamicSize(2.5)}rem ${dinamicSize(1.4164)}rem ${dinamicSize(2.5)}rem` : `${dinamicSize(1.4164)}rem ${dinamicSize(2.5)}rem 0 ${dinamicSize(2.5)}rem`, background: isValidCssColor(fondoBarColor) ? fondoBarColor : 'white' } },

                    // Tabs
                    tabsTitleList.map((title, index: number) =>

                    React.createElement('div', { key: index, onClick: () => currentTab === index ? null : setCurrentTab(index), style: {  ...tabsTransition('all'), transform: 'translateX(calc(' + (-shoulderWidth * index) + 'rem))', zIndex: getZIndex(index,currentTab,zIndexMax), display: 'inline-block', position: 'relative', boxSizing: 'border-box', padding: '0', margin: '0', width: currentTab === index || (index === 0 && currentMouseOverTag === 0) ? shortenedTitles[index].isLongShortened ? dinamicSize(tabWidths.longShortened + ( (2.125 * 2 * 378) / 743 ) ) + 'rem' : shortenedTitles[index].isShortened ? dinamicSize(tabWidths.shortened + ( (2.125 * 2 * 378) / 743 ) ) + 'rem' : dinamicSize(tabWidths.base + ( (2.125 * 2 * 378) / 743 ) ) + 'rem' : dinamicSize(tabWidths.base + ( (2.125 * 2 * 378) / 743 ) ) + 'rem', height: '100%', filter: tabBarPosition === 0 || tabBarPosition === 2 ? `drop-shadow(${ index === currentTab ? 0 : index < currentTab ? -0.3 : 0.3 }rem ${dinamicSize(0.5)}rem ${dinamicSize(0.6)}rem rgba(0,0,0,${currentTab === index ? 0.06 : 0.05}))` : `drop-shadow(${ index === currentTab ? 0 : index < currentTab ? -0.3 : 0.3 }rem -${dinamicSize(0.5)}rem ${dinamicSize(0.6)}rem rgba(0,0,0,${currentTab === index ? 0.06 : 0.05}))` }},
                      React.createElement('div', { style: { transition: 'all 150ms linear', cursor: currentTab === index ? 'default' : 'pointer', display: 'inline-block', padding: '0', margin: '0', position: 'absolute', top: '0', [ index !== 0 && index < currentTab ? 'right' : 'left' ]: '0', boxSizing: 'border-box', overflow: 'visible', width: 'auto', height: `100%`, filter: tabBarPosition === 0 ? `drop-shadow(${ index === currentTab ? 0 : index < currentTab ? -0.15 : 0.15 }rem ${dinamicSize(0.1)}em ${dinamicSize(0.1)}rem rgba(0,0,0,${currentTab === index ? 0.35 : 0.2}))` : tabBarPosition === 1 ? `drop-shadow(${ index === currentTab ? 0 : index < currentTab ? -0.15 : 0.15 }rem -${dinamicSize(0.05)}em ${dinamicSize(0.1)}rem rgba(0,0,0,${currentTab === index ? 0.3 : 0.15}))` : tabBarPosition === 2 ? `drop-shadow(${ index === currentTab ? 0 : index < currentTab ? -0.15 : 0.15 }rem  ${dinamicSize(0.1)}em ${dinamicSize(0.1)}rem rgba(0,0,0,${currentTab === index ? 0.35 : 0.2}))` : `drop-shadow(${ index === currentTab ? 0 : index < currentTab ? -0.15 : 0.15 }rem -${dinamicSize(0.05)}em ${dinamicSize(0.1)}rem rgba(0,0,0,${currentTab === index ? 0.3 : 0.2} ) )` } },
                        React.createElement('div', { style: { transition: 'all 150ms linear', display: 'block', whiteSpace: 'nowrap', padding: '0', margin: '0', position: 'relative', boxSizing: 'border-box', width: `100%`, height: `100%` } },

                          tabShoulderBlock(index, 0),

                          React.createElement('div', { onMouseOver: () => { if (hoverTimeoutRef.current) { clearTimeout(hoverTimeoutRef.current); }; hoverTimeoutRef.current = setTimeout(() => { setCurrentMouseOverTag(index); }, 340); }, onMouseOut: () => { if (hoverTimeoutRef.current) { clearTimeout(hoverTimeoutRef.current); hoverTimeoutRef.current = null; }; setCurrentMouseOverTag(null); }, style: { ...tabsTransition('all'), transform: 'translateX(-0.05rem)', display: 'inline-block', background: tabBgColor(index), padding: '0', margin: '0', position: 'relative', boxSizing: 'border-box', height: `100%`, width: currentTab === index ? shortenedTitles[index].isLongShortened ? dinamicSize(tabWidths.longShortened)  + 'rem' : shortenedTitles[index].isShortened ? dinamicSize(tabWidths.shortened) + 'rem' : dinamicSize(tabWidths.base) + 'rem' : currentMouseOverTag === index ? shortenedTitles[index].isLongShortened ? dinamicSize(tabWidths.longShortened) + 'rem' : shortenedTitles[index].isShortened ? dinamicSize(tabWidths.shortened) + 'rem' : dinamicSize(tabWidths.base) + 'rem' : dinamicSize(tabWidths.base) + 'rem', verticalAlign: 'top', alignContent: 'end', overflow: 'hidden' } },
                            React.createElement('span', { style: { ...tabsTransition('opacity'), display: 'inline-block', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', padding: '0', margin: '0', boxSizing: 'border-box', fontWeight: '500', fontSize: `${dinamicSize(1.125)}rem`, color: tabsTextList[index] ?? 'black', opacity: currentTab === index ? shortenedTitles[index].isShortened ? 0 : 0.7 : currentMouseOverTag === index ? shortenedTitles[index].isShortened ? 0 : 0.6 : 0.3, pointerEvents: 'none' } },
                              typeof title === "string" ? shortenedTitles[index].isShortened ? shortenedTitles[index].shortened : title : null ),
                            React.createElement('span', { style: { ...tabsTransition('opacity'), display: 'inline-block', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', padding: '0', margin: '0', boxSizing: 'border-box', fontWeight: '500', fontSize: `${dinamicSize(1.125)}rem`, color: tabsTextList[index] ?? 'black', opacity: currentTab === index ? shortenedTitles[index].isShortened ? 0.7 : 0 : currentMouseOverTag === index ? shortenedTitles[index].isShortened ? 0.6 : 0 : 0, pointerEvents: 'none' } },
                              typeof title === "string" ? shortenedTitles[index].isLongShortened ? shortenedTitles[index].longShortened : shortenedTitles[index].isShortened ? shortenedTitles[index].longShortened : title : null ) ),

                          tabShoulderBlock(index, 1) ) ) ) )

                ) ),

              // dinamicSize(1.3)+ 'rem ' + dinamicSize(1.5) + 'rem'
              // maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 9%, rgba(0,0,0,1) 91%, rgba(0,0,0,0) 100%)',
            ( tabBarPosition === 0 || tabBarPosition === 1 ) && React.createElement('section', { style: { zIndex: 10, height: '100%' /* dinamicSize(18) + 'rem' */, overflowY: 'scroll', display: 'block', background: tabsColorsList[currentTab] ? tabsColorsList[currentTab] : isValidCssColor(fondoColor) ? fondoColor : 'transparent', padding: '0', margin: '0', position: 'relative', boxSizing: 'border-box', width: `100%` } },
              typeof tabsContentList[currentTab] === 'string' ? React.createElement('p', { style: { transition: 'all 150ms linear', display: 'block', position: 'relative', boxSizing: 'border-box', hyphens: 'auto', textAlign: 'justify', textIndent: dinamicSize(1) + 'rem', fontSize: dinamicSize(1.125) + 'rem', fontWeight: 400, color: tabsTextList[currentTab] ?? 'black', lineHeight: 1.625, padding: dinamicSize(1.3)+ 'rem ' + dinamicSize(1.5) + 'rem', margin: '0' } }, tabsContentList[currentTab] ) : tabsContentList[currentTab] ?? null ),

          ) ) };

LayeredTabs.Tab = Tab;

export default LayeredTabs;
