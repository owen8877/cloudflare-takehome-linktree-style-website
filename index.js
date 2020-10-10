'use strict';

const Router = require('./router')

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
    const r = new Router()
    r.get('/links', request => handler_links(request))
    r.get('/.*', request => handler_general(request))

    const resp = await r.route(request)
    return resp
}

// Materials
const links = [
	{
		name: "owen8877/calendar-as-diary: Make Google calendar as your automated calendar.",
		url: "https://github.com/owen8877/calendar-as-diary",
	},
	{
		name: "🐿️👒 On Twitter: \"Deep thinking https://t.co/iDRt2afnHl\" / Twitter",
		url: "https://twitter.com/SythonUK/status/1013702083227222017",
	},
	{
		name: "141 Optical Illusions & Visual Phenomena",
		url: "https://michaelbach.de/ot/",
	},
]

const social_links = [
	{
		url: "https://github.com/owen8877",
		svg: "https://simpleicons.org/icons/github.svg",
	},
	{
		url: "https://www.linkedin.com/in/ziheng-stokes-chen/",
		svg: "https://simpleicons.org/icons/linkedin.svg",
	},
	{
		url: "https://twitter.com/owen8877",
		svg: "https://simpleicons.org/icons/twitter.svg",
	},
]
const profile = {
	name: 'xDroid',
	avatar_url: 'https://avatars1.githubusercontent.com/u/9379520?s=460&u=a0a282643bb6bfe71149dcc4e00fa7465349a053&v=4',
}

// Endpoint: /links
async function handler_links(request) {
    const init = {
        headers: { 'content-type': 'application/json' },
    }
    const body = JSON.stringify(links)
    return new Response(body, init)
}

// Endpoint (general)
class LinksTransformer {
	constructor(links) {
		this.links = links
	}

	async element(element) {
		for (let link of this.links) {
			element.append(`<a href="${link.url}">${link.name}</a>`, { html: true })
		}
	}
}

class ProfileUpdater {
	constructor() {
	}

	async element(element) {
		let style = element.getAttribute('style')
		if (style) {
			element.setAttribute('style', style.replace(/display: none/, ''))
		}
	}
}

class NameUpdater {
	constructor(profile) {
		this.name = profile.name
	}

	async element(element) {
		element.setInnerContent(this.name)
	}
}

class AvatarUpdater {
	constructor(profile) {
		this.url = profile.avatar_url
	}

	async element(element) {
		element.setAttribute('src', this.url)
	}
}

class SocialUpdater {
	constructor(links) {
		this.links = links
	}

	async element(element) {
		let style = element.getAttribute('style')
		if (style) {
			element.setAttribute('style', style.replace(/display: none/, ''))
		}
		for (let link of this.links) {
			element.append(`<a href="${link.url}"><img src="${link.svg}"></a>`, { html: true })
		}
	}
}

class BackgroundColorChanger {
	constructor(color) {
		this.color = color
	}

	async element(element) {
		element.setAttribute('class', this.color)
	}
}

const rewriter = new HTMLRewriter()
	.on('div#links', new LinksTransformer(links))
	.on('div#profile', new ProfileUpdater())
	.on('img#avatar', new AvatarUpdater(profile))
	.on('h1#name', new NameUpdater(profile))
	.on('title', new NameUpdater(profile))
	.on('div#social', new SocialUpdater(social_links))
	.on('body', new BackgroundColorChanger('bg-blue-700'))

async function handler_general(request) {
	const resp_html = await fetch('https://static-links-page.signalnerve.workers.dev')
	return rewriter.transform(resp_html)
}
