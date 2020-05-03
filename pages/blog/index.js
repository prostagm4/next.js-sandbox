import Head from 'next/head'
import Router from 'next/router'

import { Layout } from '../../components/notAuthenticated'

import { server } from '../../utils'

import {
	Grid,
	Paper,
	Typography,
	ExpansionPanel,
	ExpansionPanelSummary,
	ExpansionPanelDetails,
} from '@material-ui/core'

import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	paper: {
		padding: theme.spacing(3),
		textAlign: 'center',
		color: theme.palette.text.secondary,
	},
	title: {
		padding: theme.spacing(3),
	},
	heading: {
		fontSize: theme.typography.pxToRem(15),
		fontWeight: theme.typography.fontWeightRegular,
	},
}))

const blogList = ({ data }) => {

	const classes = useStyles()

	const title = 'Blog list'

	const separatedPages = (pages) => {
		let separated = []
		pages.map(({ topic, slug }) => {
			if (!separated[topic]) {
				separated[topic] = [...slug]
			} else {
				separated[topic].push(...slug)
			}
		})

		return separated
	}
	const separated = separatedPages(data.data)

	// Calculate how to build the grid
	const calculateBreakpoints = (numberOfTopics) => {
		switch (numberOfTopics.length) {
			case 1:
				return 12
			case 2:
			case 4:
				return 6
			default:
				return 4
		}
	}

	const breakpoints = calculateBreakpoints(Object.keys(separated))

	const handle_route = (topic, slug) => {
		return () => {
			const href = '/blog/[topic]/[slug]'
			const as = `/blog/${topic}/${slug}`

			return Router.push(href, as)
		}
	}

	const list_pages = Object.entries(separated).map(([key, values]) => {
		return (
			<Grid item xs={breakpoints} key={key}>
				<Paper className={classes.paper}>
					<Typography component='h2' variant='h6'>
						{key}
					</Typography>
					{values.map((page) => {
						return (
							<ExpansionPanel key={page}>
								<ExpansionPanelSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls={`content-${page}`}
									id={page}
								>
									<Typography
										component='h4'
										variant='subtitle1'
										className={classes.heading}
									>
										{page}
									</Typography>
								</ExpansionPanelSummary>
								<ExpansionPanelDetails>
									<Typography>
										Description <span onClick={handle_route(key, page)}>Read</span>
									</Typography>
								</ExpansionPanelDetails>
							</ExpansionPanel>
						)
					})}
				</Paper>
			</Grid>
		)
	})

	return (
		<React.Fragment>
			<Head>
				<title>{title}</title>
			</Head>
			<Layout>
				<main>
					<Typography component='h1' variant='h4' className={classes.title}>
						List of all topics ({Object.keys(separated).length} arguments){' '}
					</Typography>
					<div className={classes.root}>
						<Grid container spacing={3}>
							{list_pages}
						</Grid>
					</div>
				</main>
			</Layout>
		</React.Fragment>
	)
}

blogList.getInitialProps = async () => {

	const data = await server.getAsync('/posts')

	return { data }
}

export default blogList
