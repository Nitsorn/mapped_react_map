class MapWorkersPanel extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			expanded: false,
			query: ''
		}
	}

	render() {
		const { expanded } = this.state;
		const { selected_users } = this.props;
		return (
			<div className='map_panel map_panel-workers'>
				<div
					className={'lf-card ' + (expanded ? 'expanded' : '')}
					onClick={ _ => this.setState({
						expanded: !expanded
					})}
				>
					<div className='map_panel-expand_toggle lf-animate lf-animate-fast'></div>
					<h4 className='lf-align-items-inline lf-unselectable lf-padding-ten lf-no-padding-top lf-no-padding-bottom'>
						<i className='lf-icon lf-icon-participants'/>
						<span>Tracking {selected_users.length} worker{selected_users.length == 1 ? '' : 's'}</span>
					</h4>
					<div
						className='lf-align-items-inline lf-padding-ten lf-no-padding-top lf-align-center'
						onClick={ e => e.stopPropagation()}
					>
						<i className='lf-icon lf-icon-search' />
						<input
							placeholder='Search Worker'
							onChange={ e => this.setState({
								query: e.target.value
							})}
							className='lf-input lf-input-underline lf-no-margin lf-align-left'
						/>
					</div>
					{this.renderWorkers()}
				</div>
			</div>
		)
	}

	renderWorkers() {
		const { users, selected_users, onToggleUser } = this.props;
		const { query } = this.state;
		return (
			<div className='map_panel-workers-wrapper'>
				{
					users
					.filter( user => {
						return (
							UsersObject.format('name',user).toLowerCase().indexOf(query.toLowerCase()) > -1 &&
							user.account_active
						)
					})
					.sort((a,b) => a.first_name.localeCompare(b.first_name))
					.map( user =>
						<div
							key={user.id}
							onClick={ e => {
								e.stopPropagation();
								if (user.mobile && user.last_known_location)
									onToggleUser(user.id)
							}}
							className='map_panel-workers-worker lf-align-items-inline'
						>
							<span>
								{UsersObject.format('name', user)} - <span className={UsersObject.get('availability', user)}>
									{UsersObject.get('availability', user)}
								</span>
							</span>
							<div className='lf-float-right'>
								{
									user.mobile && user.last_known_location ? (
										<div
											className={
												'map_panel-workers-worker-checkbox lf-cursor-pointer ' +
												(selected_users.indexOf(user.id) > -1 ? 'checked' : '')
											}
										/>
									) : ''
								}
							</div>
						</div>
					)
				}
			</div>
		)
	}
}
