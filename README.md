# UI Pattern

Build out user interfaces with HTML, javascript and CSS. The UI follows one UI Pattern, the data to populate the UI Pattern comes from the API.

### Requirements

Combine the UI Pattern and API. The data to populate the UI Pattern comes from the API. When user loads the page, they should see the data from the API load into the UI pattern on the screen.

### Implement technologies

1. Html
2. CSS
3. Javascript

### Features

#### 1. UI Pattern

##### Slider

The UI Pattern used in the project is Slider Pattern. The user will see the content on the screen with 'Next' and 'Previous' buttons. When they click on the 'Next' button, the slider will shift to show the next item in the list. When the user clicks on the 'Previous' button, the slider will shift to show the previous items in the list. If there is no next or previous items, the slider will loop to the other end of the list.

![slider](https://github.com/life2free/UIPattern/blob/master/img/slider.gif)

#### 2. API

There are two apis used in the project.

- News API - [powered by NewsAPI.org](https://newsapi.org/)

Get the top headlines news by the News API.

- New York Times API - [powered by developer.nytimes.com](https://developer.nytimes.com/)

Get the news data according to the relevant conditions by the New York Times API.

#### 3. Control the frequency of query data requests

The data from api are updated infrequently, meanwhile，the amount of data which are got from api is huge. So it's unnecessary to query data from api each time when the user needs some data presented. Achieve this through a value of spacing interval. If interval is less than this value, the program will present the data which were got from api last time instead of query data with api. Otherwise, query data with api.

#### 4. Apply media queries

Apply media queries to delivering a tailored style sheet (responsive web design).
