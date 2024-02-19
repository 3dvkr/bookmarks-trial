import express from 'express'
import dotenv from 'dotenv'

import { db } from './db'
import { users } from "./db/schema"

dotenv.config()

const { GITHUB_CLIENT_ID: clientID, GITHUB_CLIENT_SECRET: clientSecret } =
	process.env

const app = express()
app.set('view engine', 'ejs')
var access_token = ''

app.get('/', (req, res) => {
	res.render('pages/index', { client_id: clientID })
})

app.get('/github/callback', async (req, res) => {
	const requestToken = req.query.code

	const resp = await fetch(
		`https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
		{
			method: 'post',
			headers: {
				accept: 'application/json',
			},
		}
	)

	const json = await resp.json()
	access_token = json.access_token
	console.log({ json })
	res.redirect('/success')
})

app.get('/success', async function (req, res) {
	const resp = await fetch(`https://api.github.com/user`, {
		method: 'get',
		headers: {
			Authorization: 'token ' + access_token,
		},
	})
	const userData = await resp.json()
	const dbResp = await db
		.insert(users)
		.values({ githubId: userData.id, userName: userData.login })
	console.log({ dbResp })
	const allUsers = await db.select().from(users)
	console.log({ allUsers })
	res.render('pages/success', { userData })
	// res.send("sucess")
})

app.listen(4000, () => {
	console.log('fridge running')
})
