class MapObjectPanel extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			object: null
		}
		this.street_view = null;
	}

	componentWillMount() {
		this.initialize(this.props);

	}

	componentWillReceiveProps(nextProps) {
		this.initialize(nextProps);
	}

	initialize(props) {
		let { object, users, jobs } = props;

		this.setState({ object }, _ => {
			if (object.type == 'job')
				// get users for job
				this.getJobUsers(object.id);
			if (object.type == 'user' && object.status == 'driving') {
				// if user is driving to job, get ETA and update state.user
				this.getETA(object.id);
			}
		});
	}

	getJobUsers(job_id) {
		API.fetch('GET', '/jobs/get_participants', { id: job_id }, (err, response) => {
			if (err) console.log(err);
			else {
				let { object } = this.state;
				object.users = response.users
				this.setState({object});
			}
		})
	}

	getETA() {
		let user = this.state.object;
		let upcoming_jobs = user.jobs ? user.jobs.filter( job => job.status != 'past' && job.status != 'done') : []
		let current_job = upcoming_jobs.length ? upcoming_jobs[0] : null;

		if (current_job && moment().isSame(moment(new Date(current_job.start_date)), 'day') && user.status.toLowerCase().indexOf('driving') > -1) {
			// if user is driving to job that is today
			let starting_point = user.last_known_location;
			let end_point = current_job.geo_location;

			let point_1 = new google.maps.LatLng(starting_point.split(',')[0], starting_point.split(',')[1])
			let point_2 = new google.maps.LatLng(end_point.split(',')[0], end_point.split(',')[1])
			let service = new google.maps.DistanceMatrixService();

			service.getDistanceMatrix({
				origins: [point_1],
				destinations: [point_2],
				travelMode: 'DRIVING'
			}, (response, status) => {
				if (status == 'OK') {
					let result = response.rows[0].elements[0];
					duration = result.duration;
					distance = result.distance;
					this.setState({
						object: Object.assign({}, user, {
							duration_to_job: duration,
							distance_to_job: distance
						})
					})
				}
			})
		}
	}

	initializeStreetView() {
		let { object } = this.props;
		let { geo_location } = object;
		let lat = Number(geo_location.split(',')[0]) || null;
		let lng = Number(geo_location.split(',')[1]) || null;
		let position = { lat, lng };

		this.street_view = new google.maps.StreetViewPanorama(
				document.getElementById('street_view'), {
					position,
					pov: {
						heading: 34,
						pitch: 10
					}
				});
	}

	render() {
		const { expanded, object } = this.state;
		const { onClose } = this.props;
		return (
			<div className='map_panel map_panel-object'>
				<div
					style={
						object.type == 'job' ? {
							borderLeft: `4px solid #${object.color}`
						} : {}
					}
					className='my-card expanded my-overflow-auto'
					onClick={ _ => this.setState({
						expanded: !expanded
					})}
				>
					<div
						onClick={onClose}
						className='map_panel-expand_toggle map_panel-close my-animate my-cursor-pointer my-animate-fast'
					/>
					{this.renderObjectContent()}
				</div>
			</div>
		)
	}

	renderObjectContent() {
		const { object, onRefresh, date, onExpandJob, onExpandCustomer } = this.props;
		if (object.type == 'job') {
			let job = this.state.object;
			return (
			 <div className='map_panel-object-job'>
				 <div>
					 <h4
						 className='my-align-items-inline'
					 >
					 		<i className='my-icon my-icon-job' />
						 {job.name}</h4>
					 <div
						 style={{color: APP.getColor(job.status, true)}}
						 className='my-float-right my-padding-five my-uppercase'>{job.status}</div>
				 </div>
				 <div className='map_panel-object-job-info'>
					 <span>
						 <h6 className='my-align-items-inline my-bold my-inline-block'>
							 <i className='my-icon my-icon-information' />
							 Job Info
						 </h6>
					 </span>
					 <span
						 onClick={onExpandJob.bind(null, job)}
						 className='my-float-right expand'>expand
					 </span>
					 <div className='my-padding-ten'>
						 <div>Date: {moment(new Date(job.start_date)).format('ll')}</div>
						 <div>Time: {moment(new Date(job.start_date)).format('LT')}</div>
						 <div>Address: {APP.format('address',job)}</div>
					 </div>
				 </div>
				 <div className='map_panel-object-job-info'>
					 <span>
						 <h6 className='my-align-items-inline my-bold my-inline-block'>
							 <i className='my-icon my-icon-customer' />
							 Customer Info
						 </h6>
					 </span>
					 <span
						 onClick={onExpandCustomer.bind(null, job.customer)}
						 className='my-float-right expand'>expand</span>
					 <div className='my-padding-ten'>
						 <div>Name: {APP.format('name', job.customer)}</div>
						 <div>Number: {APP.format('phone_number', job.customer)}</div>
					 </div>
				 </div>
				 <div className='map_panel-object-job-info'>
			 			<JobParticipants
						  job={job}
							updateAttributes={onRefresh}
						/>
				 </div>
			 </div>
		 )
		}
		else if (object.type == 'user') {
			let user = this.state.object;
			let upcoming_jobs = user.jobs ? user.jobs.filter( job => job.status != 'past' && job.status != 'done') : []
			let current_job = upcoming_jobs.length ? upcoming_jobs[0] : null;
			return (
				<div className=' map_panel-object-user '>
					<h4
						className='my-align-items-inline'
					>
						<i className='my-icon my-icon-male' />
						{UsersObject.format('name', user)}
					</h4>
					<div
						style={{color: APP.getColor(user.availability, true)}}
						className='my-float-right my-padding-five my-uppercase'>{user.availability}
					</div>
					<br /> <br />
					{
						// past time cards
						user.time_cards && user.time_cards.map( time_card =>
							<div
								className='map_panel-object-user-moment map_panel-object-user-moment-past'
								key={time_card.id}
							>
								<span className='my-bold'>{time_card.job_name}</span>
								<div className='my-float-right'>
									{moment(new Date(time_card.start_time)).format('LT')}
								</div>
							</div>
						)
					}
					{ moment(date).isSame(moment(),'day') &&
						// right now
						<div
							className='map_panel-object-user-moment map_panel-object-user-moment-right_now'
						>
							<span className='my-bold'>Right now</span>
							<div className='my-float-right'>
								{moment().format('LT')}
							</div>
							<div className='map_panel-object-user-moment-right_now-content'>
								{UsersObject.format('status', user)}
								{ current_job &&
									// on/driving to job. show job info
									<div>
										<div>{current_job.name}</div>
										<div>{APP.format('address', current_job)}</div>
										{	(user.duration_to_job && user.distance_to_job) &&
											// driving to that job
											<div>
												ETA: <span className='my-green-text'>{user.duration_to_job.text}</span> ({user.distance_to_job.text}) away from job
											</div>
										}
									</div>
								}
							</div>

						</div>
					}
					{
						// future jobs
						upcoming_jobs.map( job =>
							<div
								className='map_panel-object-user-moment map_panel-object-user-moment-future'
								key={job.id}
							>
								<span className='my-bold'>{job.name}</span>
								{ job.id == current_job.id && user.duration_to_job &&
									<div className='my-float-right map_panel-object-user-moment-time_stamp-tentative'>
										{moment().add(user.duration_to_job.value, 'seconds').format('LT')}
									</div>
								}
								<div>
									Scheduled at: {moment(new Date(job.start_date)).format('LT')}
								</div>
							</div>
						)
					}
				</div>
			)
		}
	}


}
