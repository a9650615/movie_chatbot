const MovieView = ({ data, id }) => (
  {
    "type": "template",
    "altText": "電影簡介選單",
    "template": {
        "type": "carousel",
        "columns": [
            {
              "thumbnailImageUrl": `${data.cover}`,
              "imageBackgroundColor": "#FFFFFF",
              "title": `${data.title}`,
              "text": `${data.upTime}\u000A主要演員:${data.actors}`.substring(0,57),
              "actions": [
								{
									"type": "postback",
									"label": "查看劇照",
									"data": `action=getStagePhoto&id=${id}`
								},
								{
										"type": "postback",
										"label": "主要演員",
										"data": `action=getActor&id=${id}`
								}
              ]
            },
            {
              "thumbnailImageUrl": `${data.cover}`,
              "imageBackgroundColor": "#FFFFFF",
              "title": "簡介",
              "text": `${data.summary.length>40?`${data.summary.substring(0, 40)}...(點擊查看更多)`:data.summary}`,
              "defaultAction": {
                "type": "postback",
                "label": "View detail",
                "data": `action=getMovieSummary&id=${id}`
              },
              "actions": [
                  {
                      "type": "postback",
                      "label": "查看完整簡介",
                      "data": `action=getMovieSummary&id=${id}`
									},
									{
										"type": "postback",
										"label": "是否推薦",
										"data": `action=isRecommend&id=${id}`
									}
              ]
            }
        ],
        "imageAspectRatio": "square",
        "imageSize": "cover"
    }
  }
)

const ActorView = ({ data }) => (
	{
			"type": "template",
			"altText": "演員列表",
			"template": {
					"type": "carousel",
					"columns": [
						...data.actors.map((data) => {
							console.log(data)
							return {
								"thumbnailImageUrl": `${data.img.indexOf('https://')==-1?'https://movies.yahoo.com.tw/'+data.img:data.img}`,
								"imageBackgroundColor": "#FFFFFF",
								"title": `${data.text[0]||data.text}`,
								"text": `${data.text.slice(1).join(' ')||'~'}`,
								actions: [{ 
									"type": "message",
									"label": "回到電影介紹",
									"text": "回到電影介紹"
								}]
							}
						})
					],
					"imageAspectRatio": "square",
					"imageSize": "cover"
			}
	}
)

const SearchView = ({ data }) => (
	{
			"type": "template",
			"altText": "搜尋列表",
			"template": {
					"type": "carousel",
					"columns": [
						...data.map((data) => {
							return {
								"thumbnailImageUrl": `${data.img}`,
								"imageBackgroundColor": "#FFFFFF",
								"title": `${data.title}`,
								"text": `${data.time}`,
								actions: [{ 
									"type": "postback",
									"label": "詳細內容",
									"data": `action=getMovie&id=${data.id}`
								}]
							}
						})
					],
					"imageAspectRatio": "rectangle",
					"imageSize": "cover"
			}
	}
)

const ImagesList = ({ data, id }) => (
	{
		"type": "template",
		"altText": "圖片列表",
		"template": {
				"type": "image_carousel",
				"columns": [
					...data.map((source) => {
						return ({
							"imageUrl": source.src,
							"action": {
								"type": "postback",
								"label": "查看大圖",
								"data": `action=image&src=${source.src}&href=${(source.href)}`
							}
						})
					}).slice(0, 10)
				]
		}
	}
)

const SelectorList = ({ options = [], image = 'https://i.imgur.com/Ake6Gtw.png', title = 'title', content = 'content' }) => ({
  "type": "template",
  "altText": "選項面板",
  "template": {
      "type": "buttons",
      "thumbnailImageUrl": image,
      "imageAspectRatio": "rectangle",
      "imageSize": "contain",
      "imageBackgroundColor": "#FFFFFF",
      "title": title,
      "text": content,
      "actions": options.slice(0, 4).map((val) => ({
				"type": "postback",
				"label": val.label,
				"data": val.action
			}))
  }
})

export {
  MovieView,
	ActorView,
	SearchView,
	ImagesList,
	SelectorList
}