class MapSearchPanel extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	componentDidMount() {
		const { onSearchAddress } = this.props;
		let autocomplete = new google.maps.places.Autocomplete(ReactDOM.findDOMNode(this.refs.search_bar))
		autocomplete.setTypes(['address']);
		autocomplete.addListener('place_changed', _ => {
			let place = autocomplete.getPlace();
			let lat = place.geometry.location.lat();
			let lng = place.geometry.location.lng();
			let geo_location = `${lat},${lng}`;
			onSearchAddress(geo_location);
		})
	}

	render() {
		const { onSearchAddress } = this.props;
		return (
			<div className='map_panel map_panel-search my-align-items-inline'>
				<i className='my-icon my-icon-search' />
				<input
					ref='search_bar'
					type='text'
					className='my-card my-gray-placeholder'
					placeholder='Search Map'
					onBlur={this.getGeolocationIfDoesntExist.bind(this)}
					onChange={onSearchAddress.bind(null, null)}
				/>
			</div>
		)
	}

	getGeolocationIfDoesntExist() {
		const { onSearchAddress, geo_location_search } = this.props;
		setTimeout( _ => {
			if (this.refs.search_bar.value != '' && !geo_location_search) {
				// address not selected from google. try to reverse geocode
				let geocoder = new google.maps.Geocoder();
				geocoder.geocode({'address': this.refs.search_bar.value}, (result, status) => {
					if (status == google.maps.GeocoderStatus.OK) {
						let lat = result[0].geometry.location.lat();
						let lng = result[0].geometry.location.lng();
						let geo_location = `${lat},${lng}`;
						onSearchAddress(geo_location);
					}
					else alert('this is not a valid address');
				})
			}
		}, 1000)
	}
}
