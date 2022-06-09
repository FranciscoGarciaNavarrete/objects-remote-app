import React from 'react';
import ReactDOM from 'react-dom';

import SearchMap from './components/SearchMap'

const App = () => {
	return <SearchMap />;
};

class WebComponent extends HTMLElement {
	connectedCallback() {
		ReactDOM.render(
			<App />,
			this
		);
	}
}

const ELEMENT_ID = 'search-map-app';

if(!customElements.get(ELEMENT_ID)){
  customElements.define(ELEMENT_ID, WebComponent);
}
