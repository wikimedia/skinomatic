<?php

/**
 * Template for use with Mustache rendered skins that uses MustacheTemplate.
 */
class SkinMustache extends SkinTemplate {
	public $skinname = null;
	public $templateDirectory = null;

	public function __construct( $skinname = null, $templateDirectory = null ) {
		global $wgStyleDirectory;
		parent::__construct( $skinname );
		$this->templateDirectory = $templateDirectory;

		// If the skin directory has not been set, autodiscover the template directory
		// by finding a directory that matches the skin name.
		if ( $this->templateDirectory === null ) {
			$folder = $this->msg( "skinname-$skinname" );
			if ( !$folder->exists() ) {
				$folder = ucfirst( $skinname );
			}
			$this->templateDirectory = "$wgStyleDirectory/$folder/templates";
			$templatePath = $this->templateDirectory . '/' . $this->skinname . '.mustache';
			if ( !file_exists( $templatePath ) ) {
				throw new MWException( __METHOD__ . " A MustacheSkin must have have a Mustache template at `$templatePath`." );
			}
		}
	}

	/**
	 * Setup a Mustache template
	 */
	protected function setupTemplate( $classname ) {
		return new MustacheTemplate( $this->getConfig() );
	}

	/**
	 * Derive style and script modules from the skin name.
	 */
	public function getDefaultModules() {
		$modules = parent::getDefaultModules();
		$name = $this->skinname;
		$modules['styles']['skin'] = [ "skins.$name" ];
		$modules[$name] = [ "skins.$name.scripts" ];
		return $modules;
	}

	/**
	 * Initialize various variables and generate the template
	 */
	function outputPage() {
		Profiler::instance()->setAllowOutput();
		$out = $this->getOutput();

		$this->initPage( $out );
		$tpl = $this->prepareQuickTemplate();
		$tp = new TemplateParser( $this->templateDirectory );
		$this->addMessagesToTemplateData( $tpl );
		// execute template
		$res = $tpl->execute();
		$res = $tp->processTemplate( $this->skinname, $this->getSkinTemplateData( $tpl ) );

		// result may be an error
		$this->printOrError( $res );
	}

	/**
	 * Parse the template for the messages that need to be added to the template.
	 * Only plain text messages are supported.
	 */
	private function addMessagesToTemplateData( $tpl ) {

		$messageKeys = [];
		// Extract messages from the template source
		$files = array_diff( scandir( $this->templateDirectory ), [ '..', '.' ] );
		foreach ( $files as $file ) {
			$contents = file_get_contents( $this->templateDirectory . '/' . $file );
			$matches = [];
			preg_match_all( '{{msg-([^\}]*)}}', $contents, $matches );
			$messageKeys = array_merge( $messageKeys, $matches[1] );
		}

		foreach ( $messageKeys as $messageKey ) {
			$tpl->set( 'msg-' . $messageKey, $this->msg( $messageKey ) );
		}
	}

	/**
	 * Skins may extend this function with additional properties if necessary. Any added skin keys
	 * should be prefixed with the skinname to show that they are locally defined.
	 * @since 1.35
	 * @param QuickTemplate $tpl
	 * @return array of template data that can be passed to the TemplateParser processTemplate method
	 */
	public function getSkinTemplateData( $tpl ) : array {
		$config = $this->getConfig();
		return array_merge( $tpl->data, [
			'html-headelement' => $tpl->get( 'headelement', '' ),
			'html-indicators' => $tpl->getIndicators(),
			'html-printtail' => $tpl->getTrail() . '</body></html>',
			// Remember that the string '0' is a valid title.
			// From OutputPage::getPageTitle, via ::setPageTitle().
			'html-title' => $tpl->get( 'title', '' ),
			'html-catlinks' => $tpl->get( 'catlinks', '' ),
			// Result of OutputPage::addHTML calls
			'html-bodycontent' => $tpl->get( 'bodycontent' ),
			'html-logo-attributes' => Xml::expandAttributes(
				Linker::tooltipAndAccesskeyAttribs( 'p-logo' ) + [
						'class' => 'mw-wiki-logo',
						'href' => Skin::makeMainPageUrl(),
				]
			),
			'data-sidebar' => $tpl->getSidebarProps(),
			'data-search-box' => [
				'action-url' => $tpl->get( 'wgScript', '' ),
				'searchaction' => $tpl->get( 'searchaction' ),
				'html-input' => $tpl->makeSearchInput( [ 'id' => 'searchInput' ] ),
				'html-input-searchtitle' => Html::hidden( 'title', $tpl->get( 'searchtitle', null ) ),
				'html-button-go' => $tpl->makeSearchButton(
					'go',
					[ 'id' => 'searchButton', 'class' => 'searchButton' ]
				),
				'html-button-fulltext' => $config->get( 'UseTwoButtonsSearchForm' ) ? $tpl->makeSearchButton(
					'fulltext',
					[ 'id' => 'mw-searchButton', 'class' => 'searchButton' ]
				) : null,
			],
		], $tpl->getMenuProps(), $tpl->getFooterData() );
	}
}
