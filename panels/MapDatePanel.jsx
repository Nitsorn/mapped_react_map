class MapDatePanel extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	render() {
		const { date, onChangeDate } = this.props;
		return (
			<div className='map_panel map_panel-date my-align-items-inline'>
				<SomeDatePicker
					dateFormat={'mm-dd-yy'}
					date={moment(new Date(date)).format("MM-DD-YYYY")}
					onChange={ date_string => {
						onChangeDate(moment(new Date(moment(date_string, 'MM-DD-YYYY'))));
					}}
				/>
			</div>
		)
	}
}
