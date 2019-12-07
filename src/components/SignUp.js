import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
// import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Radio from '@material-ui/core/Radio';
import { RadioGroup, Select, MenuItem } from '@material-ui/core';
// import { Dialog, DialogTitle } from '@material-ui/core'
import firebase from 'firebase';
import './SignUp.css';

const styles = theme => ({
	main: {
		width: 'auto',
		display: 'block', // Fix IE 11 issue.
		marginLeft: theme.spacing.unit * 3,
		marginRight: theme.spacing.unit * 3,
		[theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
			maxWidth: 450,
			width: '95%',
			marginLeft: 'auto',
			marginRight: 'auto',
		},
	},
	paper: {
		width: '95%',
		maxWidth: 450,
		marginTop: theme.spacing.unit * 8,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
		position: 'absolute',
		// width: theme.spacing.unit * 50,
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		outline: 'none',
	},
	avatar: {
		margin: theme.spacing.unit,
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing.unit,
	},
});

class SignUp extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loader: false,
			name: '',
			email: '',
			password: '',
			contact: '',
			type: '',
			open: false,
			schoolName: 'Select School Name',
			errorMessage: '',
			valueArray: [],
			SchoolCheckArray: [],
		};
	}

	componentDidMount() {
		firebase
			.database()
			.ref(`AllSchoolNames`)
			.on('value', snapshot => {
				let data = snapshot.val();
				if (data) {
					let valueArray = Object.values(data);
					this.setState({ valueArray });
				}
			});
	}

	handleChange = e => {
		this.setState({
			[e.target.name]: e.target.value,
			errorMessage: '',
		});
	};
	handleSubmit = e => {
		let { SchoolCheckArray } = this.state
		e.preventDefault();
		if (this.state.schoolName !== 'Select School Name') {
			let { name, email, password, contact, type, schoolName } = this.state;
			let school_name = schoolName.replace(/ /g, '_');
			name = name.toLowerCase();
			let contactSplit = contact.split('');
			contactSplit.splice(0, 2, '+');
			contact = contactSplit.join('');
			firebase
				.auth()
				.createUserWithEmailAndPassword(email, password)
				.then(response => {
					this.setState({ errorMessage: 'Successfully Created Acount' });
					const uid = response.user.uid;
					firebase
						.database()
						.ref(`AllSchools/${uid}`)
						.set({ schoolName: school_name, uid: uid })
						.then(() => {
							firebase
								.database()
								.ref(`ParentAllSchool${uid}`)
								.set(JSON.stringify(SchoolCheckArray))
								.then(() => {
									firebase
										.database()
										.ref('/UserName/' + name)
										.set({ email: email })
										.then(() => {
											firebase
												.database()
												.ref('/UserContact/' + contact)
												.set({ email: email })
												.then(() => {
													if (SchoolCheckArray.length) {
														SchoolCheckArray.map(school => {
															firebase.database().ref(`${school}/UserData/${uid}`)
																.set({ username: name, email: email, password: password, contact: contact, type: type })
														})
														this.setState({
															name: '',
															email: '',
															password: '',
															contact: '',
															type: '',
															schoolName: 'Select School Name',
														});
													} else {
														this.setState({ errorMessage: 'Please select any school before submit' });
													}
												});
										})
										.catch(err => {
											return this.setState({ errorMessage: err.message });
										});
								})
						});
				})
				.catch(err => {
					return this.setState({ errorMessage: err.message });
				});
		} else {
			this.setState({ errorMessage: 'No School Selected' });
		}
	};
	// handleClose = () => {
	// 	this.setState({ open: false, errorMessage: '' });
	// };

	handleSchoolCheck = (schoolName) => {
		let { SchoolCheckArray } = this.state
		SchoolCheckArray.push(schoolName)
		this.setState({ SchoolCheckArray })
	}

	render() {
		const { classes } = this.props;
		return (
			<main className={classes.main}>
				<main style={{ display: 'flex', justifyContent: 'center' }}>
					<CssBaseline />

					<Paper className={classes.paper}>
						<Typography component="h1" variant="h5">
							Sign Up
						</Typography>
						<form className={classes.form} onSubmit={e => this.handleSubmit(e)}>
							<FormControl margin="normal" required fullWidth>
								<InputLabel htmlFor="name">User Name:</InputLabel>
								<Input
									name="name"
									type="name"
									id="name"
									autoComplete="current-password"
									value={this.state.name}
									onChange={e => this.handleChange(e)}
									required
								/>
							</FormControl>
							<FormControl margin="normal" required fullWidth>
								<InputLabel htmlFor="email">Email Address:</InputLabel>
								<Input
									id="email"
									name="email"
									autoComplete="email"
									value={this.state.email}
									onChange={e => this.handleChange(e)}
									required
								/>
							</FormControl>
							<FormControl margin="normal" required fullWidth>
								<InputLabel htmlFor="password">Password:</InputLabel>
								<Input
									name="password"
									type="password"
									id="password"
									autoComplete="current-password"
									value={this.state.password}
									onChange={e => this.handleChange(e)}
									required
								/>
							</FormControl>
							<FormControl>
								<RadioGroup
									onChange={e => this.handleChange(e)}
									value={this.state.type}
									name="type"
									required
								>
									<FormControlLabel value="Parent" control={<Radio />} label="Parent" />
									<FormControlLabel value="Teacher" control={<Radio />} label="Teacher" />
								</RadioGroup>
							</FormControl>
							<FormControl margin="normal" required fullWidth>
								<InputLabel htmlFor="contact">Contact No:</InputLabel>
								<Input
									name="contact"
									type="text"
									placeholder="+44...."
									id="contact"
									autoComplete="current-password"
									value={this.state.contact}
									onChange={e => {
										if (this.state.contact.length === 1 || this.state.contact.length === 0) {
											this.setState({
												contact:
													e.target.value.charCodeAt(this.state.contact.length) === 48
														? e.target.value
														: this.state.contact,
											});
										} else {
											this.setState({
												contact: !isNaN(e.target.value) ? e.target.value : this.state.contact,
											});
										}
									}}
									required
								/>
							</FormControl>
							<FormControl margin="normal" required fullWidth>
								<Select
									value={this.state.schoolName}
									onChange={e => this.handleChange(e)}
									name="schoolName"
								>
									<MenuItem value="Select School Name" selected>
										Select School Name
									</MenuItem>
									{this.state.valueArray.length
										? this.state.valueArray.map((e, index) => {
											return (
												<FormControl>
													<MenuItem key={index} lebel={e.SchoolName} value={e.SchoolName}>
														{e.SchoolName}
													</MenuItem>
													<Checkbox onChange={this.handleSchoolCheck(e.schoolName)} value={e.schoolName} />
												</FormControl>
											);
										})
										: ''}
								</Select>
							</FormControl>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								color="primary"
								className={classes.submit}
							>
								Sign Up
							</Button>
						</form>
						<div>
							<p
								style={{
									color: this.state.errorMessage === 'Successfully Created Acount' ? 'green' : 'red',
								}}
							>
								{this.state.errorMessage}
							</p>
						</div>
					</Paper>
				</main>
			</main>
		);
	}
}

export default withStyles(styles)(SignUp);
