# cheerio-scrape
Let’s scrape!

## First Start
When first time pull the repo, you must run this command to install all the packages based on **package.json**:
```
npm install
```

## Accessing the endpoint
There are 2 main functions:
1. Fetch all categories based on city
```
http://localhost:3000/categories?city=*city*
```

For example:
```
http://localhost:3000/categories?city=kuala-lumpur
```

2. Fetch all merchants based on city, category and category_ids
```
http://localhost:3000/merchants?city=*city*&category=*category*&categoryId=*category_ids*
```

For example:
```
http://localhost:3000/merchants?city=jakarta&category=eat&categoryId=2
```