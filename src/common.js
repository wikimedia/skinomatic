const HTML_INDICATORS = `<div class="mw-indicators mw-body-content">
<div id="mw-indicator-good-star" class="mw-indicator">
        <a href="/wiki/Wikipedia:Good_articles"
                title="This is a good article. Follow the link for more information.">
                        <img alt="This is a good article. Follow the link for more information."
                                src="//upload.wikimedia.org/wikipedia/en/thumb/9/94/Symbol_support_vote.svg/19px-Symbol_su
pport_vote.svg.png" decoding="async" width="19" height="20"
                                srcset="//upload.wikimedia.org/wikipedia/en/thumb/9/94/Symbol_support_vote.svg/29px-Symbol
_support_vote.svg.png 1.5x, //upload.wikimedia.org/wikipedia/en/thumb/9/94/Symbol_support_vote.svg/39px-Symbol_support_vot
e.svg.png 2x" data-file-width="180" data-file-height="185" />
        </a>
</div>
<div id="mw-indicator-pp-autoreview" class="mw-indicator">
        <a href="/wiki/Wikipedia:Protection_policy#pending"
                title="All edits by unregistered and new users are subject to review prior to becoming visible to unregist
ered users">
                <img alt="Page protected with pending changes" src="//upload.wikimedia.org/wikipedia/en/thumb/b/b7/Pending
-protection-shackle.svg/20px-Pending-protection-shackle.svg.png"
                        decoding="async" width="20" height="20" srcset="//upload.wikimedia.org/wikipedia/en/thumb/b/b7/Pen
ding-protection-shackle.svg/30px-Pending-protection-shackle.svg.png 1.5x, //upload.wikimedia.org/wikipedia/en/thumb/b/b7/P
ending-protection-shackle.svg/40px-Pending-protection-shackle.svg.png 2x" data-file-width="512" data-file-height="512" />
        </a>
</div>
</div>
`;

const IPSUM_LOREM = `<div class="mw-parser-output">
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed diam mauris, congue sed mauris non, auctor ornare quam. In sit amet ligula ut turpis auctor mollis. Nam malesuada erat sollicitudin nisl faucibus tristique. Cras mattis feugiat posuere. Pellentesque laoreet erat tortor, id pellentesque ante dapibus vitae. Praesent sodales erat quis pellentesque pretium. Quisque tincidunt non dolor et blandit. Donec a molestie magna, sed auctor felis. Etiam finibus urna facilisis mauris maximus rhoncus. Integer feugiat accumsan mattis. Sed et sem sit amet ligula vestibulum efficitur. Vivamus eu neque eleifend, dignissim lectus vitae, eleifend sem.

<h2>Ipsum norum</h2>
Morbi ut tempor tellus. Suspendisse potenti. Donec ut suscipit nisi. Ut sodales dolor justo, sed viverra nulla iaculis sit amet. Nulla vel lectus mollis, mollis purus at, iaculis metus. Ut finibus elementum augue eleifend malesuada. Donec lobortis, enim eget dictum luctus, erat lectus lobortis enim, non fringilla diam nunc eget arcu. In neque tellus, bibendum rhoncus est eget, suscipit pretium libero. Duis quis ipsum augue. Nunc ac libero et turpis rhoncus viverra. Ut ultrices, justo vitae accumsan varius, nisl ligula bibendum mauris, rutrum scelerisque lectus mi id magna. In hac habitasse platea dictumst.

<h2>Donec laoreet</h2>
Donec nec metus ut lacus mattis consequat laoreet vitae mi. Praesent urna nulla, facilisis eget ultrices vitae, luctus quis diam. Donec interdum tortor sit amet lobortis sagittis. Aliquam sed vehicula tellus. Quisque volutpat sem in metus feugiat venenatis. Aenean hendrerit condimentum dui, sed feugiat urna dapibus fringilla. Nam accumsan tellus nec enim laoreet, eget accumsan odio pretium. Praesent sem dui, volutpat ac orci eu, fringilla vulputate mauris. Fusce ut semper velit, sit amet tempus est. Integer luctus volutpat mollis. Aliquam ut elit et mauris consequat porttitor.

In vitae imperdiet turpis, eu sagittis justo. Fusce a bibendum massa. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed in nisl eu tellus tincidunt congue. Phasellus ornare est non ex suscipit, eget malesuada purus hendrerit. Nam ut accumsan felis. Suspendisse pulvinar velit quis justo lacinia, eget bibendum mauris bibendum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ac nulla ut dolor porta dapibus eget fringilla enim. Nullam massa tellus, dapibus ut tempus quis, consectetur vel nisi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nulla dui, maximus consequat porttitor eu, feugiat nec enim. Nullam at leo massa. Cras eget congue tellus, nec fringilla elit. Etiam posuere suscipit sem, eget efficitur orci dictum quis.

Morbi sed maximus ex, in tincidunt nibh. Praesent tempus nibh ac dolor pretium eleifend. Fusce eleifend aliquam tortor, at ornare mauris interdum quis. Suspendisse eu justo sed tellus tempor mollis. Quisque semper nisi eget sapien feugiat sodales. Nullam et tristique ante. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec vitae tempor urna. Pellentesque efficitur commodo pretium. Curabitur viverra arcu eu eleifend semper. Fusce quis euismod lorem. Integer eleifend mattis est a venenatis. Suspendisse id risus eros. 
</div>`
const placeholder = ( msg, height ) => {
    return `<div style="width: 100%; height: ${height || 200}px; margin-bottom: 2px;
            font-size: 12px; padding: 8px; box-sizing: border-box;
            display: flex; background: #eee; align-items: center;justify-content: center;">${msg}</div>`;
};

const headelement = (css, modules) => {
	return `<html class="client-js"><head>
<link rel="stylesheet" href="https://en.wikipedia.org/w/load.php?lang=en-gb&modules=${modules.join('|')}&only=styles">
<style>${css}</style></head><body>`;
}

const printtail = () => {
	return `</body></html>`;
}

const FOOTER_ROWS = [
	{
		id: 'footer-info',
		'array-items': [
			{
				id: 'footer-info-lastmod',
				'html-link': 'This page was last modified on 10 January 2020, at 21:24.'
			},
			{
				id: 'footer-info-copyright',
				'html-link': `This text is available under the <a href="https://creativecommons.org/licenses/by-sa/3.0/">Creative Commons Attribution-ShareAlike Licence</a>;
additional terms may apply. See <a href="https://foundation.wikimedia.org/wiki/Special:MyLanguage/Terms_of_Use">Terms of Use</a> for details.`

			}
		]
	},
	{
		id: 'footer-places',
		'array-items': [
			{
				id: 'footer-places-privacy',
				'html-link': `<a href="https://foundation.wikimedia.org/wiki/Privacy_policy" class="extiw" title="wmf:Privacy policy">Privacy policy</a>`
			},
			{
				id: 'footer-places-about',
				'html-link': `<a href="/wiki/Wikipedia:About" title="Wikipedia:About">About Wikipedia</a>`
			},
			{
				id: 'footer-places-disclaimer',
				'html-link': `<a href="/wiki/Wikipedia:General_disclaimer" title="Wikipedia:General disclaimer">Disclaimers</a>`
			},
			{
				id: 'footer-places-contact',
				'html-link': `<a href="//en.wikipedia.org/wiki/Wikipedia:Contact_us">Contact Wikipedia</a>`
			},
			{
				id: 'footer-places-developers',
				'html-link': `<a href="https://www.mediawiki.org/wiki/Special:MyLanguage/How_to_contribute">Developers</a>`
			},
			{
				id: 'footer-places-statslink',
				'html-link': `<a href="https://stats.wikimedia.org/v2/#/en.wikipedia.org">Statistics</a>`
			},
			{
				id: 'footer-places-cookiestatement',
				'html-link': `<a href="https://foundation.wikimedia.org/wiki/Cookie_statement">Cookie statement</a>`
			},
			{
				id: 'footer-places-mobileview',
				'html-link': `<a href="//en.m.wikipedia.org/w/index.php?title=Paris&amp;useskin=vector&amp;mobileaction=toggle_view_mobile" class="noprint stopMobileRedirectToggle">Mobile view</a>`
			}
		]
	}
];

const FOOTER_ICONS = [
	{
		id: 'footer-icons',
		'array-items': [
			{
				id: 'footer-copyrightico',
				'html-img': `<a href="https://wikimediafoundation.org/"><img src="https://wikipedia.org/static/images/wikimedia-button.png" srcset="https://wikipedia.org/static/images/wikimedia-button-1.5x.png 1.5x, https://wikipedia.org/static/images/wikimedia-button-2x.png 2x" width="88" height="31" alt="Wikimedia Foundation"/></a>`
			},
			{
				id: 'footer-poweredbyico',
				'html-img': `<a href="https://www.mediawiki.org/"><img src="https://wikipedia.org/static/images/poweredby_mediawiki_88x31.png" alt="Powered by MediaWiki" srcset="https://wikipedia.org/static/images/poweredby_mediawiki_132x47.png 1.5x, https://wikipedia.org/static/images/poweredby_mediawiki_176x62.png 2x" width="88" height="31"/></a>`
			}
		]
	}
];

const htmluserlangattributes = `dir="ltr" lang="en-GB"`;

const htmllogoattributes = `class="mw-wiki-logo" href="/wiki/Main_Page" title="Visit the main page"`;

const htmlloggedin = '<li id="pt-anonuserpage">Not logged in</li>';

const htmlpersonaltools = `<li id="pt-anontalk"><a href="/wiki/Special:MyTalk" title="Discussion about edits from this IP address [⌃⌥n]" accesskey="n">Talk</a></li><li id="pt-anoncontribs"><a href="/wiki/Special:MyContributions" title="A list of edits made from this IP address [⌃⌥y]" accesskey="y">Contributions</a></li><li id="pt-createaccount"><a href="/w/index.php?title=Special:CreateAccount&amp;returnto=Main+Page" title="You are encouraged to create an account and log in; however, it is not mandatory">Create account</a></li><li id="pt-login"><a href="/w/index.php?title=Special:UserLogin&amp;returnto=Main+Page" title="You're encouraged to log in; however, it's not mandatory. [⌃⌥o]" accesskey="o">Log in</a></li>`;

const htmlpersonaltoolsloggedin = `<li id="pt-userpage"><a href="/wiki/User:Jdlrobson" dir="auto" title="Your user page [⌃⌥.]" accesskey=".">Jdlrobson</a></li><li id="pt-notifications-alert"><a href="/wiki/Special:Notifications" class="mw-echo-notifications-badge mw-echo-notification-badge-nojs oo-ui-icon-bell mw-echo-notifications-badge-all-read" data-counter-num="0" data-counter-text="0" title="Your alerts">Alerts (0)</a></li><li id="pt-notifications-notice"><a href="/wiki/Special:Notifications" class="mw-echo-notifications-badge mw-echo-notification-badge-nojs oo-ui-icon-tray" data-counter-num="3" data-counter-text="3" title="Your notices">Notices (3)</a></li><li id="pt-mytalk"><a href="/wiki/User_talk:Jdlrobson" title="Your talk page [⌃⌥n]" accesskey="n">Talk</a></li><li id="pt-sandbox"><a href="/wiki/User:Jdlrobson/sandbox" title="Your sandbox">Sandbox</a></li><li id="pt-preferences"><a href="/wiki/Special:Preferences" title="Your preferences">Preferences</a></li><li id="pt-betafeatures"><a href="/wiki/Special:Preferences#mw-prefsection-betafeatures" title="Beta features">Beta</a></li><li id="pt-watchlist"><a href="/wiki/Special:Watchlist" title="A list of pages you are monitoring for changes [⌃⌥l]" accesskey="l">Watchlist</a></li><li id="pt-mycontris"><a href="/wiki/Special:Contributions/Jdlrobson" title="A list of your contributions [⌃⌥y]" accesskey="y">Contributions</a></li><li id="pt-logout"><a href="/w/index.php?title=Special:UserLogout&amp;returnto=Main+Page&amp;returntoquery=useskin%3Dvector" title="Log out">Log out</a></li>`;

const htmlviews = `<li id="ca-view" class="collapsible selected">
<a href="/wiki/Main_Page">Read</a>
</li>
<li id="ca-viewsource" class="collapsible">
<a href="/w/index.php?title=Main_Page&amp;action=edit" title="This page is protected.
You can view its source [⌃⌥e]" accesskey="e">View source</a></li>
<li id="ca-history" class="collapsible">
<a href="/w/index.php?title=Main_Page&amp;action=history" title="Past revisions of this page [⌃⌥h]" accesskey="h">View history</a>
</li>
<li id="ca-unwatch" class="collapsible icon mw-watchlink"><a href="/w/index.php?title=Main_Page&amp;action=unwatch" data-mw="interface" title="Remove this page from your watchlist [⌃⌥w]" accesskey="w">Unwatch</a></li>
`;

const htmlnamespaces = `<li id="ca-nstab-main" class="selected"><a href="/wiki/Main_Page" title="View the content page [⌃⌥c]" accesskey="c">Main page</a></li>
<li id="ca-talk"><a href="/wiki/Talk:Main_Page" rel="discussion" title="Discussion about the content page [⌃⌥t]" accesskey="t">Talk (3)</a></li>`;

const htmlvariants = `<li id="ca-varlang-0">
<a href="/zh/%E4%B8%AD%E5%8D%8E%E4%BA%BA%E6%B0%91%E5%85%B1%E5%92%8C%E5%9B%BD"
		hreflang="zh" lang="zh">不转换</a></li>
<li id="ca-varlang-1">
<a href="/zh-hans/%E4%B8%AD%E5%8D%8E%E4%BA%BA%E6%B0%91%E5%85%B1%E5%92%8C%E5%9B%BD"
		hreflang="zh-Hans" lang="zh-Hans">简体</a>
</li>
<li id="ca-varlang-2">
<a href="/zh-hant/%E4%B8%AD%E5%8D%8E%E4%BA%BA%E6%B0%91%E5%85%B1%E5%92%8C%E5%9B%BD"
		hreflang="zh-Hant" lang="zh-Hant">繁體</a>
</li>
<li id="ca-varlang-3">
<a href="/zh-cn/%E4%B8%AD%E5%8D%8E%E4%BA%BA%E6%B0%91%E5%85%B1%E5%92%8C%E5%9B%BD"
		hreflang="zh-Hans-CN" lang="zh-Hans-CN">大陆简体</a>
</li>
<li id="ca-varlang-4">
<a href="/zh-hk/%E4%B8%AD%E5%8D%8E%E4%BA%BA%E6%B0%91%E5%85%B1%E5%92%8C%E5%9B%BD"
		hreflang="zh-Hant-HK" lang="zh-Hant-HK">香港繁體</a>
</li>
<li id="ca-varlang-5">
<a href="/zh-mo/%E4%B8%AD%E5%8D%8E%E4%BA%BA%E6%B0%91%E5%85%B1%E5%92%8C%E5%9B%BD"
		hreflang="zh-Hant-MO" lang="zh-Hant-MO">澳門繁體</a>
</li>
<li id="ca-varlang-7" class="selected">
<a href="/zh-sg/%E4%B8%AD%E5%8D%8E%E4%BA%BA%E6%B0%91%E5%85%B1%E5%92%8C%E5%9B%BD"
		hreflang="zh-Hans-SG" lang="zh-Hans-SG">新加坡简体</a>
</li>
<li id="ca-varlang-8">
<a href="/zh-tw/%E4%B8%AD%E5%8D%8E%E4%BA%BA%E6%B0%91%E5%85%B1%E5%92%8C%E5%9B%BD"
		hreflang="zh-Hant-TW" lang="zh-Hant-TW">臺灣正體</a>
</li>`;

const datasearch = {
	'action-url': '/w/index.php',
	'html-input': '<input type="search" name="search" placeholder="Search Wikipedia" title="Search Wikipedia [⌃⌥f]" accesskey="f" id="searchInput" autocomplete="off">',
	'html-input-searchtitle': '<input type="hidden" value="Special:Search" name="title">',
	'html-button-go': '<input type="submit" name="go" value="Go" title="Go to a page with this exact name if it exists" id="searchButton" class="searchButton">'
};

const portletAfter = (html) => {
	return `<div class="after-portlet after-portlet-tb">${html}</div>`
};

const portals = [
	{
		'portal-id': 'p-navigation',
		'msg-label': 'Navigation',
		'msg-label-id': 'p-navigation-label',
		'html-portal-content': `<ul>
		<li id="n-mainpage-description"><a href="/wiki/Main_Page" title="Visit the main page [⌃⌥z]" accesskey="z">Main page</a></li><li id="n-contents"><a href="/wiki/Wikipedia:Contents" title="Guides to browsing Wikipedia">Contents</a></li><li id="n-featuredcontent"><a href="/wiki/Wikipedia:Featured_content" title="Featured content – the best of Wikipedia">Featured content</a></li><li id="n-currentevents"><a href="/wiki/Portal:Current_events" title="Find background information on current events">Current events</a></li><li id="n-randompage"><a href="/wiki/Special:Random" title="Load a random page [⌃⌥x]" accesskey="x">Random page</a></li><li id="n-sitesupport"><a href="https://donate.wikimedia.org/wiki/Special:FundraiserRedirector?utm_source=donate&amp;utm_medium=sidebar&amp;utm_campaign=C13_en.wikipedia.org&amp;uselang=en" title="Support us">Donate</a></li><li id="n-shoplink"><a href="//shop.wikimedia.org" title="Visit the Wikipedia store">Wikipedia store</a></li>
</ul>`,
		'html-after-portal': portletAfter( placeholder( 'Possible hook output (navigation)', 50 ) )
	},
	{
		'portal-id': 'p-tb',
		'html-tooltip': 'A message tooltip-p-tb must exist for this to appear',
		'msg-label': 'Tools',
		'msg-label-id': 'p-tb-label',
		'html-portal-content': `<ul>
<li id="t-whatlinkshere"><a href="/wiki/Special:WhatLinksHere/Spain" title="A list of all wiki pages that link here [⌃⌥j]" accesskey="j">What links here</a></li><li id="t-recentchangeslinked"><a href="/wiki/Special:RecentChangesLinked/Spain" rel="nofollow" title="Recent changes in pages linked from this page [⌃⌥k]" accesskey="k">Related changes</a></li><li id="t-upload"><a href="/wiki/Wikipedia:File_Upload_Wizard" title="Upload files [⌃⌥u]" accesskey="u">Upload file</a></li><li id="t-specialpages"><a href="/wiki/Special:SpecialPages" title="A list of all special pages [⌃⌥q]" accesskey="q">Special pages</a></li><li id="t-permalink"><a href="/w/index.php?title=Spain&amp;oldid=935087243" title="Permanent link to this revision of the page">Permanent link</a></li><li id="t-info"><a href="/w/index.php?title=Spain&amp;action=info" title="More information about this page">Page information</a></li><li id="t-wikibase"><a href="https://www.wikidata.org/wiki/Special:EntityPage/Q29" title="Link to connected data repository item [⌃⌥g]" accesskey="g">Wikidata item</a></li><li id="t-cite"><a href="/w/index.php?title=Special:CiteThisPage&amp;page=Spain&amp;id=935087243" title="Information on how to cite this page">Cite this page</a></li>
</ul>`,
		'html-after-portal': portletAfter( placeholder( 'Possible hook output (tb)', 50 ) )
	},
	{
		'portal-id': 'p-wikibase-otherprojects',
		'html-tooltip': 'A message tooltip-p-lang must exist for this to appear',
		'msg-label': 'In other projects',
		'msg-label-id': 'p-wikibase-otherprojects-label',
		'html-userlangattributes': htmluserlangattributes,
		'html-portal-content': `<ul>
		<li class="wb-otherproject-link wb-otherproject-commons"><a href="https://commons.wikimedia.org/wiki/Category:Spain" hreflang="en">Wikimedia Commons</a></li><li class="wb-otherproject-link wb-otherproject-wikinews"><a href="https://en.wikinews.org/wiki/Category:Spain" hreflang="en">Wikinews</a></li><li class="wb-otherproject-link wb-otherproject-wikiquote"><a href="https://en.wikiquote.org/wiki/Spain" hreflang="en">Wikiquote</a></li><li class="wb-otherproject-link wb-otherproject-wikivoyage"><a href="https://en.wikivoyage.org/wiki/Spain" hreflang="en">Wikivoyage</a></li></ul>`,
		'html-after-portal': ''
	},
	{
		'portal-id': 'p-lang',
		'html-tooltip': 'A message tooltip-p-lang must exist for this to appear',
		'msg-label': 'In other languages',
		'msg-label-id': 'p-lang-label',
		'html-userlangattributes': htmluserlangattributes,
		'html-portal-content': `<ul>
		<li class="interlanguage-link interwiki-ace">
				<a href="https://ace.wikipedia.org/wiki/Seupanyo"
						title="Seupanyo – Achinese" lang="ace" hreflang="ace" class="interlanguage-link-target">Acèh</a>
						</li><li class="interlanguage-link interwiki-kbd"><a href="https://kbd.wikipedia.org/wiki/%D0%AD%D1%81%D0%BF%D0%B0%D0%BD%D0%B8%D1%8D" title="Эспаниэ – Kabardian" lang="kbd" hreflang="kbd" class="interlanguage-link-target">Адыгэбзэ</a></li><li class="interlanguage-link interwiki-ady"><a href="https://ady.wikipedia.org/wiki/%D0%98%D1%81%D0%BF%D0%B0%D0%BD%D0%B8%D0%B5" title="Испание – Adyghe" lang="ady" hreflang="ady" class="interlanguage-link-target">Адыгабзэ</a></li><li class="interlanguage-link interwiki-af"><a href="https://af.wikipedia.org/wiki/Spanje" title="Spanje – Afrikaans" lang="af" hreflang="af" class="interlanguage-link-target">Afrikaans</a></li><li class="interlanguage-link interwiki-ak"><a href="https://ak.wikipedia.org/wiki/Spain" title="Spain – Akan" lang="ak" hreflang="ak" class="interlanguage-link-target">Akan</a></li><li class="interlanguage-link interwiki-als"><a href="https://als.wikipedia.org/wiki/Spanien" title="Spanien – Alemannisch" lang="gsw" hreflang="gsw" class="interlanguage-link-target">Alemannisch</a></li><li class="interlanguage-link interwiki-am"><a href="https://am.wikipedia.org/wiki/%E1%8A%A5%E1%88%B5%E1%8D%93%E1%8A%95%E1%8B%AB" title="እስፓንያ – Amharic" lang="am" hreflang="am" class="interlanguage-link-target">አማርኛ</a></li><li class="interlanguage-link interwiki-ang"><a href="https://ang.wikipedia.org/wiki/Sp%C4%93onland" title="Spēonland – Old English" lang="ang" hreflang="ang" class="interlanguage-link-target">Ænglisc</a></li><li class="interlanguage-link interwiki-ab"><a href="https://ab.wikipedia.org/wiki/%D0%98%D1%81%D0%BF%D0%B0%D0%BD%D0%B8%D0%B0" title="Испаниа – Abkhazian" lang="ab" hreflang="ab" class="interlanguage-link-target">Аҧсшәа</a></li><li class="interlanguage-link interwiki-ar badge-Q17437798 badge-goodarticle" title="good article"><a href="https://ar.wikipedia.org/wiki/%D8%A5%D8%B3%D8%A8%D8%A7%D9%86%D9%8A%D8%A7" title="إسبانيا – Arabic" lang="ar" hreflang="ar" class="interlanguage-link-target">العربية</a></li><li class="interlanguage-link interwiki-an">
</ul>`,
		'html-after-portal': portletAfter(
			placeholder( 'Possible hook output (lang)', 50 )
		)
	}
];

const datamore = {
	'empty-portlet': '',
	'msg-label': 'More',
	'menu-id': 'p-cactions',
	'menu-label-id': 'p-cactions-label',
	'html-userlangattributes': htmluserlangattributes,
	'html-items': `<li id="ca-delete">
	<a href="/w/index.php?title=Main_Page&amp;action=delete"
			title="Delete this page [⌃⌥d]" accesskey="d">Delete</a>
</li>
<li id="ca-move">
	<a href="/w/index.php/Special:MovePage/Main_Page"
			title="Move this page [⌃⌥m]" accesskey="m">Move</a>
</li>
<li id="ca-protect">
	<a href="/w/index.php?title=Main_Page&amp;action=protect"
			title="Protect this page [⌃⌥=]" accesskey="=">Protect</a>
</li>`
};


export {
	datamore,
	HTML_INDICATORS, htmluserlangattributes, placeholder,
	printtail, headelement, htmllogoattributes,
	IPSUM_LOREM,
	htmlloggedin, htmlpersonaltools, htmlpersonaltoolsloggedin,
	htmlviews, htmlnamespaces, datasearch,
	portals,
	htmlvariants,
	FOOTER_ICONS,
	FOOTER_ROWS
};
