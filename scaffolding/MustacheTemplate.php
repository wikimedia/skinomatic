<?php
/**
 * A skin that uses Mustache for rendering.
 * @final do not extend.
 */
final class MustacheTemplate extends BaseTemplate {
	/**
	 * Get data for rendering a series of portals
	 *
	 * @return array
	 */
	public function getSidebarProps() : array {
		$portals = $this->get( 'sidebar', [] );
		$props = [];
		// Force the rendering of the following portals
		if ( !isset( $portals['TOOLBOX'] ) ) {
			$portals['TOOLBOX'] = true;
		}
		if ( !isset( $portals['LANGUAGES'] ) ) {
			$portals['LANGUAGES'] = true;
		}
		// Render portals
		foreach ( $portals as $name => $content ) {
			if ( $content === false ) {
				continue;
			}

			// Numeric strings gets an integer when set as key, cast back - T73639
			$name = (string)$name;

			switch ( $name ) {
				case 'SEARCH':
					break;
				case 'TOOLBOX':
					$portal = $this->buildPortalProps( 'tb', $this->getToolbox(), 'toolbox',
						'SkinTemplateToolboxEnd' );
					ob_start();
					Hooks::run( 'VectorAfterToolbox', [], '1.35' );
					$props[] = $portal + [
						'html-hook-vector-after-toolbox' => ob_get_clean(),
					];
					break;
				case 'LANGUAGES':
					if ( $this->get( 'language_urls' ) !== false ) {
						$props[] = $this->buildPortalProps(
							'lang', $this->get( 'language_urls' ), 'otherlanguages'
						);
					}
					break;
				default:
					$props[] = $this->buildPortalProps( $name, $content );
					break;
			}
		}

		return [
			'array-portals-rest' => array_slice( $props, 1 ),
			'data-portals-first' => $props[0] ?? null,
		];
	}

	/**
	 * @param string $name
	 * @param array|string $content
	 * @param null|string $msg
	 * @param null|string|array $hook
	 * @return array
	 */
	private function buildPortalProps( $name, $content, $msg = null, $hook = null ) : array {
		if ( $msg === null ) {
			$msg = $name;
		}

		$msgObj = $this->getMsg( $msg );

		$props = [
			'portal-id' => "p-$name",
			'html-tooltip' => Linker::tooltip( 'p-' . $name ),
			'label' => $msgObj->exists() ? $msgObj->text() : $msg,
			'label-id' => "p-$name-label",
			'html-userlangattributes' => $this->get( 'userlangattributes', '' ),
			'html-portal-content' => '',
			'html-after-portal' => $this->getAfterPortlet( $name ),
		];

		if ( is_array( $content ) ) {
			$props['html-portal-content'] .= '<ul>';
			foreach ( $content as $key => $val ) {
				$props['html-portal-content'] .= $this->makeListItem( $key, $val );
			}
			if ( $hook !== null ) {
				// Avoid PHP 7.1 warning
				$skin = $this;
				ob_start();
				Hooks::run( $hook, [ &$skin, true ] );
				$props['html-portal-content'] .= ob_get_contents();
				ob_end_clean();
			}
			$props['html-portal-content'] .= '</ul>';
		} else {
			// Allow raw HTML block to be defined by extensions
			$props['html-portal-content'] = $content;
		}

		return $props;
	}

		/**
	 * @param string $label to be used to derive the id and human readable label of the menu
	 * @param array $urls to convert to list items stored as string in html-items key
	 * @param array $options (optional) to be passed to makeListItem
	 * @return array
	 */
	private function getMenuData( string $label, array $urls = [], array $options = [] ) : array {
		$props = [
			'empty-portlet' => ( count( $urls ) == 0 ) ? 'emptyPortlet' : '',
			'id' => "p-$label",
			'label-id' => "p-{$label}-label",
			'label' => $this->getMsg( $label )->text(),
			'html-userlangattributes' => $this->get( 'userlangattributes', '' ),
			'html-items' => '',
		];

		foreach ( $urls as $key => $item ) {
			$props['html-items'] .= $this->makeListItem( $key, $item, $options );
		}
		return $props;
	}

	/**
	 * @return array
	 */
	public function getMenuProps() : array {
		$contentNavigation = $this->get( 'content_navigation', [] );
		$personalTools = $this->getPersonalTools();

		return [
			'data-personal-menu' => $this->getMenuData( 'personaltools', $personalTools ),
			'data-namespaces' => $this->getMenuData( 'namespaces', $contentNavigation[ 'namespaces' ] ?? [] ),
			'data-variants' => $this->getMenuData( 'variants', $contentNavigation[ 'variants' ] ?? [] ),
			'data-page-actions' => $this->getMenuData( 'views', $contentNavigation[ 'views' ] ?? [] ),
			'data-page-actions-more' => $this->getMenuData( 'cactions', $contentNavigation[ 'actions' ] ?? [] ),
		];
	}

	/**
	 * Get rows that make up the footer
	 * @return array for use in Mustache template describing the footer elements.
	 */
	private function getTemplateFooterRow( array $links ) : array {
		$footerRows = [];
		$skin = $this->getSkin();
		foreach ( $links as $category => $links ) {
			$items = [];
			$rowId = "footer-$category";

			foreach ( $links as $key => $link ) {
				if ( is_string( $link ) ) {
					// If $link is a string then its a key to something else
					$htmlLink = $this->get( $link, '' );
					$htmlImg = null;
					$id = "$rowId-$link";
				} else {
					// otherwise it's an array of properties that can be passed to makeFooterIcon
					$htmlImg = $skin->makeFooterIcon( $link );
					$htmlLink = $skin->makeFooterIcon( $link, 'withoutImage' );
					$id = null;
				}
				$items[] = [
					'id' => $id,
					'name' => $link,
					'html-link' => $htmlLink,
					'html-img' => $htmlImg,
				];
			}

			$footerRows[] = [
				'category' => htmlspecialchars( $category ),
				'id' => $rowId,
				'className' => '',
				'array-items' => $items
			];
		}

		return $footerRows;
	}

	public function getFooterData() : array {
		return [
			'data-footer-links' => $this->getTemplateFooterRow( $this->getFooterLinks() ),
			'data-footer-icons' => $this->getTemplateFooterRow( $this->getFooterIcons( 'icononly' ) ),
			'data-footer-icons-nocopyright' => $this->getTemplateFooterRow( $this->getFooterIcons( 'nocopyright' ) ),
		];
	}

	function execute() {
		// empty. Delegate to SkinMustache.
	}
}
