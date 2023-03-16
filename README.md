# Simple Express server of OpenAI and ChatGPT

A express server connects OpenAI text completion api and ChatGPT api.

## Quick Start
1. npm install

2. Setting your custom server port and your token of OpenAI secret key in .env file. (port default running on 3001)
3. If you want to persist you database records, you need set connection between your local folder path with docker MongoDB's _/data/configdb_ before you boot your image in docker.  
4. Setting your custom MongoDB database connection URL. (default is _mongodb://localhost:27017/chatgptDB_)
5. npm run start