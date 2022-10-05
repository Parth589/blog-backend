# API Docs

### getting some posts,
`GET /api/v1/blogs`

Example response 
```js
{
    success:true,
    data:[
        {
            _id:'a unique mongodb id of that blog', 
            title:'The blog post title',
            author:'Name of author',
            brief:'a quick summary of blog post',
            thumbnail_link:'link to the thumbnail of that post',
            keywords:[
                'some keyword which are used to search the blog',
                'maximum 5 keywords will be sent'
            ]
        }
    ]
}
```
### getting a single post,
`GET /api/v1/blogs/:id`

Example response 
```js
{
  success: true,
  data: {
    _id: "63392eb888e8d6c847e76d6c",
    title: "Javascript VS Python, The end battle",
    content: "<h1 id=\"starthere\">start here,</h1>\n<h2 id=\"youneedtounderstandthesetopicsbeforereadingthispost\">you need to understand these topics before reading this post</h2>\n<ul>\n<li>what is python</li>\n<li>what is js </li>\n</ul>",
    brief: "A small talk about two modern day programming languages.",
    thumbnail_link: "https://images.unsplash.com/photo-1522252234503-e356532cafd5",
    keywords: [
      "programming",
      "javascript",
      "python",
      "comparision",
      "vs"
    ],
    author: "p4rth",
    __v: 0
  }
}
```
### creating a post,

`POST /api/v1/blogs/`

Example response
```js
{
  success: true,
  data: {
    title: "a temp blog, The end battle",
    content: "<h1 id=\"thisisanupdatedversionofblog\">this is an updated version of blog,</h1>\n<p>hope you will like it</p>",
    brief: "A small talk about two modern day programming languages.",
    thumbnail_link: "https://source.unsplash.com/random/?javascript",
    "keywords": [
      "javascript"
    ],
    author: "p4rth",
    _id: "633a80ee8f3664ba13c6e182",
    __v: 0
  }
}


```
### searching for posts,
`GET /api/v1/blogs/search?keywords=javascript&title=something&author=anny&fullobject=false&limit=10`

Example response

```js
{
  success: true,
  data: [
    {
      _id: '63392eb888e8d6c847e76d6c',
      title: 'Javascript VS Python, The end battle',
      brief: 'A small talk about two modern day programming languages.',
      thumbnail_link: 'https://images.unsplash.com/photo-1522252234503-e356532cafd5',
      keywords: [
        'programming',
        'javascript',
        'python',
        'comparision',
        'vs'
      ],
      author: 'p4rth',
      __v: 0
    },
    {
      _id: '633a62c68c4a77a7ab12c01c',
      title: 'a temp blog, The end battle',
      brief: 'A small talk about two modern day programming languages.',
      thumbnail_link: 'https://source.unsplash.com/random/?programming&javascript,python',
      keywords: [
        'programming',
        'javascript',
        'python'
      ],
      author: 'p4rth',
      __v: 0
    },
    {
      _id: '633a62e48c4a77a7ab12c01e',
      title: 'a temp blog, The end battle',
      brief: 'A small talk about two modern day programming languages.',
      thumbnail_link: 'https://source.unsplash.com/random/?programming&javascript,python',
      keywords: [
        'programming',
        'javascript',
        'python'
      ],
      author: 'p4rth',
      __v: 0
    },
    {
      _id: '633a63008c4a77a7ab12c020',
      title: 'a temp blog, The end battle',
      brief: 'A small talk about two modern day programming languages.',
      thumbnail_link: 'https://source.unsplash.com/random/?javascript',
      keywords: [
        'javascript'
      ],
      author: 'p4rth',
      __v: 0
    },
    {
      _id: '633a80ee8f3664ba13c6e182',
      title: 'a temp blog, The end battle',
      brief: 'A small talk about two modern day programming languages.',
      thumbnail_link: 'https://source.unsplash.com/random/?javascript',
      keywords: [
        'javascript'
      ],
      author: 'p4rth',
      __v: 0
    }
  ]
}
```
### deleting a post,

`DELETE /api/v1/blogs/:id`

Example response

```js
{
  success: true,
  data: {
    _id: '633a62e48c4a77a7ab12c01e',
    title: 'a temp blog, The end battle',
    content: '<h1 id=\"thisisanupdatedversionofblog\">this is an updated version of blog,</h1>\n<p>hope you will like it</p>',
    brief: 'A small talk about two modern day programming languages.',
    thumbnail_link: 'https://source.unsplash.com/random/?programming&javascript,python',
    keywords: [
      'programming',
      'javascript',
      'python'
    ],
    author: 'p4rth',
    __v: 0
  }
}
```

### updating some or all field of a post,


`PATCH /api/v1/blogs/:id`

Example requets body

```js
{
  title: 'A new title for blog',
  brief: 'two modern day programming languages.',
  keywords: [
    'javascript',
    'python'
  ],
  content: '# this is an updated version of blog,\nhope you will like it'
}
```
Example response
```js
{
  success: true,
  data: {
    _id: '633a7490a50b0cc54aa21fe0',
    title: 'A new title for blog',
    content: '<h1 id=\"thisisanupdatedversionofblog\">this is an updated version of blog,</h1>\n<p>hope you will like it</p>',
    brief: 'two modern day programming languages.',
    thumbnail_link: 'https://source.unsplash.com/random/?testing',
    keywords: [
      'javascript',
      'python'
    ],
    author: 'anny',
    __v: 0
  }
}
```