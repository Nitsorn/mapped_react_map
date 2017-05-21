class MapDatePanel extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	render() {
		const { date, onChangeDate } = this.props;
		return (
			<div className='map_panel map_panel-date lf-align-items-inline'>
				<DatePicker
					futureOnly={false}
					dateFormat={'mm-dd-yy'}
					defaultDate={moment(new Date(date)).format("MM-DD-YYYY")}
					listening_for_changes={false}
					style={'no-style'}
					additionalClassNames={'lf-button lf-button-card day_picker_button lf-align-items-inline lf-no-margin lf-padding-five'}
					onChange={ date_string => {
						onChangeDate(moment(new Date(moment(date_string, 'MM-DD-YYYY'))));
					}}
				>
					<i className='lf-icon lf-icon-calendar' />
				</DatePicker>
			</div>
		)
	}
}
