const MovieView = ({ data, id }) => (
  {
    "type": "template",
    "altText": "this is a carousel template",
    "template": {
        "type": "carousel",
        "columns": [
            {
              "thumbnailImageUrl": "https://example.com/bot/images/item1.jpg",
              "imageBackgroundColor": "#FFFFFF",
              "title": `${data.title}`,
              "text": `${data.summary.length>30?`${data.summary.substring(0, 30)}...(點擊查看更多)`:data.summary}`,
              "defaultAction": {
                  "type": "postback",
                  "label": "View detail",
                  "data": `action=getMovieSummary&id=${id}`
              },
              "actions": [
                  {
                      "type": "postback",
                      "label": "Buy",
                      "data": "action=buy&id=111"
                  }
              ]
            },
            {
              "thumbnailImageUrl": "https://example.com/bot/images/item2.jpg",
              "imageBackgroundColor": "#000000",
              "title": "this is menu",
              "text": "description",
              "defaultAction": {
                  "type": "uri",
                  "label": "View detail",
                  "uri": "http://example.com/page/222"
              },
              "actions": [
                  {
                      "type": "postback",
                      "label": "Buy",
                      "data": "action=buy&itemid=222"
                  }
              ]
            }
        ],
        "imageAspectRatio": "rectangle",
        "imageSize": "cover"
    }
  }
)

export {
  MovieView
}